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
import { auth, db } from "../../utileria/firebase";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PantallaRegistroDoctor({ navigation }) {
  const [nombres, setNombres] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [cedula, setCedula] = useState("");
  const [sexo, setSexo] = useState("");
  const [fecha, setFecha] = useState(new Date(1980, 0, 1));
  const [showDate, setShowDate] = useState(false);
  const [estadoCivil, setEstadoCivil] = useState("Soltero");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [imagenUri, setImagenUri] = useState(null);
  const [errores, setErrores] = useState({});

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
    const curpRegex = /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]\d$/;

    const nuevosErrores = {};
    if (!nombres.trim()) nuevosErrores.nombres = true;
    if (!apellidoP.trim()) nuevosErrores.apellidoP = true;
    if (!email.trim()) nuevosErrores.email = true;
    if (!sexo) nuevosErrores.sexo = true;
    if (!telefono.trim()) nuevosErrores.telefono = true;
    if (!password.trim()) nuevosErrores.password = true;
    if (!confirm.trim()) nuevosErrores.confirm = true;
    if (!cedula.trim()) nuevosErrores.cedula = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return Alert.alert('Campos incompletos', 'Por favor llena todos los campos obligatorios.');
    }



    if (!/^\d{10}$/.test(telefono.trim())) {
      Alert.alert("Teléfono inválido", "El número debe tener exactamente 10 dígitos.");
      return;
    }

    if (!reEmail.test(emailLimpio)) {
      return Alert.alert("Correo inválido");
    }

    if (password.trim().length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      return Alert.alert("Contraseñas no coinciden");
    }

    setErrores({});

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
        cedula,
        sexo,
        contrasena: password,
        fechaNacimiento: fecha.toISOString().split("T")[0],
        estadoCivil,
        email: emailLimpio,
        telefono,
        creado: new Date().toISOString(),
        rol: 'Doctor',
        turno: 'Matutino',
        fotoURL: fotoURL || null
      });

      console.log("¡Registro de doctor completo!");
      navigation.navigate("PantallaExitoso", { emailUsuario: emailLimpio });
    } catch (err) {
      console.error("REGISTRO ERROR →", err.code, err.message);
    }
  };

 return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#0A3B74" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logoEncabezado} resizeMode="contain" />
      </View>
        
      <Text style={styles.titulo}>Registro</Text>  
      <Text style={styles.subtitulo}>Llena los siguientes campos tal y como aparece en tus documentos oficiales.</Text>
      <TouchableOpacity onPress={seleccionarImagen} style={{ alignSelf: 'center', marginBottom: 20 }}>
        <Image
          source={imagenUri ? { uri: imagenUri } : require('../../assets/avatar_placeholder.png')}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ textAlign: 'center', marginTop: 8, color: '#0A3B74' }}>
          {imagenUri ? 'Cambiar foto' : 'Agregar foto'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nombre(s)</Text>
      <TextInput style={[styles.input, errores.nombres && styles.inputError]} value={nombres} onChangeText={setNombres} />

      <Text style={styles.label}>Apellido paterno</Text>
      <TextInput style={[styles.input, errores.apellidoP && styles.inputError]} value={apellidoP} onChangeText={setApellidoP} />

      <Text style={styles.label}>Apellido materno</Text>
      <TextInput style={styles.input} value={apellidoM} onChangeText={setApellidoM} />

      <Text style={styles.label}>Cédula Profesional</Text>
      <TextInput style={[styles.input, errores.cedula && styles.inputError]} value={cedula} onChangeText={setCedula} keyboardType="numeric" />

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.pickerRow}>
        <TouchableOpacity
          style={[styles.botonSexo, sexo === "M" && styles.botonSexoSeleccionado]}
          onPress={() => setSexo("M")}
        >
          <Image source={require('../../assets/Iconos_Registro/iconoMasculino.png')} style={styles.iconoSexo} />
          <Text style={styles.textoSexo}>Masculino</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonSexo, sexo === "F" && styles.botonSexoSeleccionado]}
          onPress={() => setSexo("F")}
        >
          <Image source={require('../../assets/Iconos_Registro/iconoFemenino.png')} style={styles.iconoSexo} />
          <Text style={styles.textoSexo}>Femenino</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TouchableOpacity onPress={abrirDatePicker} style={styles.input}>
        <Text>{fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })}</Text>
      </TouchableOpacity>
      {showDate && (<DateTimePicker value={fecha} mode="date" display="spinner" onChange={onChangeFecha} />)}

      <Text style={styles.label}>Estado Civil</Text>
      <View style={styles.picker}>
        <Picker selectedValue={estadoCivil} onValueChange={setEstadoCivil}>
          <Picker.Item label="Soltero/a" value="Soltero" />
          <Picker.Item label="Casado/a" value="Casado" />
          <Picker.Item label="Divorciado/a" value="Divorciado" />
          <Picker.Item label="Viudo/a" value="Viudo" />
        </Picker>
      </View>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput style={[styles.input, errores.email && styles.inputError]} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Número telefónico</Text>
      <TextInput style={[styles.input, errores.telefono && styles.inputError]} keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput style={[styles.input, errores.password && styles.inputError]} secureTextEntry value={password} onChangeText={setPassword} />

      <Text style={styles.label}>Confirmar contraseña</Text>
      <TextInput style={[styles.input, errores.confirm && styles.inputError]} secureTextEntry value={confirm} onChangeText={setConfirm} />

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
  encabezado: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginBottom: 16,
  },
  botonVolver: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -14 }],
    padding: 10,
  },
  logoEncabezado: {
    width: 70,
    height: 30,
    marginTop: 32,   
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0A3B74",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    width: 200,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 15,
  },
  boton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    width: 200,
    height: 68,
    marginBlockEnd: 60
  },
  textoBoton: {
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  botonSexo: {
    backgroundColor: "#F1F1F1",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonSexoSeleccionado: {
    borderWidth: 2,
    borderColor: '#0A3B74',
    backgroundColor: '#E0ECF8',
  },
  textoSexo: {
    color: "#0A3B74",
    fontSize: 16,
    fontWeight: "800",
    paddingHorizontal: 5,
  },
  iconoSexo: {
    width: 40,
    height: 40,
    marginRight: 6,
    resizeMode: "contain",
  },
});
