{/* Pantalla para editar el perfil de usuario
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}

// Pantalla para editar el perfil de usuario obteniendo datos de Firestore
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { db } from "../../utileria/firebase";

export default function PantallaEditarRegistro({ navigation, route }) {
  const { id: uid } = route.params; // UID del usuario a editar
  const [nombres, setNombres] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [curp, setCurp] = useState("");
  const [sexo, setSexo] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [estadoCivil, setEstadoCivil] = useState("Soltero");
  const [telefono, setTelefono] = useState("");
  const [imagenUri, setImagenUri] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      const ref = doc(db, "usuarios", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setNombres(data.nombres || "");
        setApellidoP(data.apellidoP || "");
        setApellidoM(data.apellidoM || "");
        setCurp(data.curp || "");
        setSexo(data.sexo || "");
        setFecha(data.fechaNacimiento ? new Date(data.fechaNacimiento) : new Date());
        setEstadoCivil(data.estadoCivil || "Soltero");
        setTelefono(data.telefono || "");
        setImagenUri(data.fotoURL || null);
      }
    };
    cargarDatos();
  }, []);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setImagenUri(resultado.assets[0].uri);
    }
  };

  const abrirDatePicker = () => setShowDate(true);

  const onChangeFecha = (e, selected) => {
    setShowDate(false);
    if (selected) setFecha(selected);
  };

  const guardarCambios = async () => {
    try {
      const ref = doc(db, "usuarios", uid);
      await updateDoc(ref, {
        nombres,
        apellidoP,
        apellidoM,
        curp,
        sexo,
        fechaNacimiento: fecha.toISOString().split("T")[0],
        estadoCivil,
        telefono,
      });
      Alert.alert("Actualizado", "Tu perfil ha sido actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar: ", error);
      Alert.alert("Error", "No se pudo actualizar la información.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#00000" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logoEncabezado} resizeMode="contain" />
      </View>

      {/* Agregamos efecto de filtro en el icono
      Programadora: Irais Reyes
      Fecha: 07 de junio del 2025 */}
      <TouchableOpacity onPress={seleccionarImagen} style={styles.contenedorImagen}>
        <Image
          source={imagenUri ? { uri: imagenUri } : require('../../assets/avatar_placeholder.png')}
          style={styles.imagenPerfil}
        />
        <View style={styles.overlay}>
          <Text style={styles.textoOverlay}>Editar</Text>
          {/* {imagenUri ? 'Cambiar foto' : 'Agregar foto'} */}
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Nombre(s)</Text>
      <TextInput style={styles.input} value={nombres} onChangeText={setNombres} />

      <Text style={styles.label}>Apellido paterno</Text>
      <TextInput style={styles.input} value={apellidoP} onChangeText={setApellidoP} />

      <Text style={styles.label}>Apellido materno</Text>
      <TextInput style={styles.input} value={apellidoM} onChangeText={setApellidoM} />

      <Text style={styles.label}>CURP</Text>
      <TextInput style={styles.input} value={curp} onChangeText={setCurp} />

      <Text style={styles.label}>Sexo</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
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
        <Text>{fecha.toLocaleDateString("es-MX")}</Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker value={fecha} mode="date" display="spinner" onChange={onChangeFecha} />
      )}

      <Text style={styles.label}>Estado Civil</Text>
      <View style={styles.input}>
        <Picker selectedValue={estadoCivil} onValueChange={setEstadoCivil}>
          <Picker.Item label="Soltero/a" value="Soltero" />
          <Picker.Item label="Casado/a" value="Casado" />
          <Picker.Item label="Divorciado/a" value="Divorciado" />
          <Picker.Item label="Viudo/a" value="Viudo" />
        </Picker>
      </View>

      <Text style={styles.label}>Número telefónico</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />

      <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
        <Text style={styles.textoBoton}>Guardar</Text>
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
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: 'center',
  },
  contenedorImagen: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    marginBottom: 20,
    position: 'relative',
  },
  imagenPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // filtro negro
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoOverlay: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
