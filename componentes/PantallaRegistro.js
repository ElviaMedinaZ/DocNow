// componentes/PantallaRegistro.js
import React, { useState, useEffect } from "react";
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
import * as ImagePicker from 'expo-image-picker';

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
  const [imagenUri, setImagenUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitas permitir acceso a la galería.');
      }
    })();
  }, []);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true
    });

    if (!resultado.canceled) {
      setImagenUri(resultado.assets[0].uri);
    }
  };

  const subirAImgbb = async (base64) => {
    const apiKey = '6bf581fff38d47c8c68359dc9945a4a9';
    const body = new FormData();
    body.append('key', apiKey);
    body.append('image', base64);

    try {
      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.success) return data.data.url;
      return null;
    } catch (e) {
      console.error('Error subiendo imagen:', e);
      return null;
    }
  };

    const abrirDatePicker = () => setShowDate(true);

  const onChangeFecha = (e, selected) => {
    setShowDate(false);
    if (selected) setFecha(selected);
  };


  const manejarRegistro = async () => {
    const emailLimpio = email.trim();
    const reEmail = /^\S+@\S+\.\S+$/;
    if (!reEmail.test(emailLimpio)) return console.error("Correo inválido");
    if (password !== confirm) return console.error("Contraseñas no coinciden");

    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('email', '==', emailLimpio));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) return console.error("Correo ya registrado");

      const cred = await createUserWithEmailAndPassword(auth, emailLimpio, password);
      const uid = cred.user.uid;

      let fotoURL = null;
      if (imagenUri) {
        const blob = await (await fetch(imagenUri)).blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise((resolve) => (reader.onloadend = resolve));
        const base64Data = reader.result.split(',')[1];
        fotoURL = await subirAImgbb(base64Data);
      }

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
        rol: 'Paciente',
        fotoURL: fotoURL || null
      });

      console.log("¡Registro completo!");
      navigation.replace("MenuPrincipal", { emailUsuario: emailLimpio });
    } catch (err) {
      console.error("REGISTRO ERROR →", err.code, err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#0A3B74" />
      </TouchableOpacity>

      <TouchableOpacity onPress={seleccionarImagen} style={{ alignSelf: 'center', marginBottom: 20 }}>
        <Image
          source={imagenUri ? { uri: imagenUri } : require('../assets/avatar_placeholder.png')}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ textAlign: 'center', marginTop: 8, color: '#0A3B74' }}>
          {imagenUri ? 'Cambiar foto' : 'Agregar foto'}
        </Text>
      </TouchableOpacity>

      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.titulo}>Registro</Text>

      <TextInput style={styles.input} placeholder="Nombre(s)" value={nombres} onChangeText={setNombres} />
      <TextInput style={styles.input} placeholder="Apellido paterno" value={apellidoP} onChangeText={setApellidoP} />
      <TextInput style={styles.input} placeholder="Apellido materno" value={apellidoM} onChangeText={setApellidoM} />
      <TextInput style={styles.input} placeholder="CURP" value={curp} onChangeText={setCurp} />

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Sexo:</Text>
        <Picker selectedValue={sexo} onValueChange={setSexo} style={styles.picker}>
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Femenino" value="F" />
        </Picker>
      </View>

      <TouchableOpacity onPress={abrirDatePicker} style={styles.input}>
        <Text>
          Fecha de nacimiento: {fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker value={fecha} mode="date" display="spinner" onChange={onChangeFecha} />
      )}

      <View style={styles.pickerRow}>
        <Text style={styles.label}>Estado Civil:</Text>
        <Picker selectedValue={estadoCivil} onValueChange={setEstadoCivil} style={styles.picker}>
          <Picker.Item label="Soltero/a" value="Soltero" />
          <Picker.Item label="Casado/a" value="Casado" />
          <Picker.Item label="Divorciado/a" value="Divorciado" />
          <Picker.Item label="Viudo/a" value="Viudo" />
        </Picker>
      </View>

      <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Número telefónico" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry value={confirm} onChangeText={setConfirm} />

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
