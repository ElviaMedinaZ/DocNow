// componentes/PantallaRegistro.js
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utileria/firebase";
import { Ionicons } from '@expo/vector-icons';  

export default function PantallaRegistro({ navigation }) {
  const [nombres, setNombres] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [curp, setCurp] = useState("");
  const [sexo, setSexo] = useState("M");
  const [fecha, setFecha] = useState(new Date(2000, 0, 1));
  const [showDate, setShowDate] = useState(false);
  const [estadoCivil, setEstadoCivil] = useState("Soltero");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const abrirDatePicker = () => setShowDate(true);
  const onChangeFecha = (e, selected) => {
    setShowDate(false);
    if (selected) setFecha(selected);
  };

  const manejarRegistro = async () => {
    const emailLimpio = email.trim();
    const reEmail = /^\S+@\S+\.\S+$/;
    if (!reEmail.test(emailLimpio)) {
      console.error("Error: Ingresa un correo electrónico válido");
      return;
    }
    if (password !== confirm) {
      console.error("Error: Las contraseñas no coinciden");
      return;
    }

    try {
      // Verificar si el usuario ya existe
      const usuariosRef   = collection(db, 'usuarios');
      const q             = query(usuariosRef, where('email', '==', emailLimpio));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.error("Error: Este correo ya está registrado en Firestore");
        return;
      }

      // Crear usuario en Auth
      const cred = await createUserWithEmailAndPassword(auth, emailLimpio, password);
      const uid  = cred.user.uid;

      // Guardar datos en Firestore, ahora con rol = 3
      await setDoc(doc(db, "usuarios", uid), {
        nombres,
        apellidoP,
        apellidoM,
        curp,
        sexo,
        contrasena: password,
        fechaNacimiento: fecha.toISOString().split("T")[0],
        estadoCivil,
        email: emailLimpio,
        telefono,
        creado: new Date().toISOString(),
        rol: '3'    // <-- se añade el rol por defecto
      });

      console.log("¡Registro completo! Bienvenido/a " + nombres);
      navigation.replace("MenuPrincipal", { emailUsuario: emailLimpio });
    } catch (err) {
      console.error("REGISTRO ERROR →", err.code, err.message);
      switch (err.code) {
        case "auth/email-already-in-use":
          console.error("Error: Este correo ya está registrado en Auth");
          break;
        case "auth/weak-password":
          console.error("Error: La contraseña debe tener al menos 6 caracteres");
          break;
        case "auth/invalid-email":
          console.error("Error: El formato del correo es inválido");
          break;
        case "auth/network-request-failed":
          console.error("Error: Verifica tu conexión a internet");
          break;
        default:
          console.error("Error desconocido al registrar:", err.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#0A3B74" />
      </TouchableOpacity>

      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Registro</Text>

      {/* campos de formulario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre(s)"
        value={nombres}
        onChangeText={setNombres}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido paterno"
        value={apellidoP}
        onChangeText={setApellidoP}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido materno"
        value={apellidoM}
        onChangeText={setApellidoM}
      />
      <TextInput
        style={styles.input}
        placeholder="CURP"
        value={curp}
        onChangeText={setCurp}
      />

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Sexo:</Text>
        <Picker
          selectedValue={sexo}
          onValueChange={setSexo}
          style={styles.picker}
        >
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Femenino" value="F" />
        </Picker>
      </View>

      <TouchableOpacity onPress={abrirDatePicker} style={styles.input}>
        <Text>
          Fecha de nacimiento:{" "}
          {fecha.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="spinner"
          onChange={onChangeFecha}
        />
      )}

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Estado Civil:</Text>
        <Picker
          selectedValue={estadoCivil}
          onValueChange={setEstadoCivil}
          style={styles.picker}
        >
          <Picker.Item label="Soltero/a" value="Soltero" />
          <Picker.Item label="Casado/a" value="Casado" />
          <Picker.Item label="Divorciado/a" value="Divorciado" />
          <Picker.Item label="Viudo/a" value="Viudo" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Número telefónico"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.boton} onPress={manejarRegistro}>
        <Text style={styles.textoBoton}>Siguiente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 60,
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 32
  },
  botonVolver: {
    marginBottom: 16,
    alignSelf: 'flex-start'
  },
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0A3B74",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 120,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  boton: {
    backgroundColor: "#0A3B74",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
