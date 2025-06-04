// PantallaRegistroDoctor.js
import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { app } from '../../utileria/firebase'

const auth = getAuth(app)
const db = getFirestore(app)
const { width } = Dimensions.get('window')
const INPUT_WIDTH = width * 0.9

export default function PantallaRegistroDoctor({ navigation }) {
  const [nombres, setNombres] = useState('')
  const [apellidoP, setApellidoP] = useState('')
  const [apellidoM, setApellidoM] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [curp, setCurp] = useState('')
  const [cedula, setCedula] = useState('')
  const [sexo, setSexo] = useState(null)
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [error, setError] = useState(null)
  const [imagenUri, setImagenUri] = useState(null)
  const [cargando, setCargando] = useState(false)
  const rol = 'Doctor'

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitas permitir el acceso a la galería para subir una imagen')
      }
    })()
  }, [])

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    })

    if (!resultado.canceled) {
      setImagenUri(resultado.assets[0].uri)
    }
  }

  const subirAImgbb = async (base64) => {
    const apiKey = '6bf581fff38d47c8c68359dc9945a4a9'
    const body = new FormData()
    body.append('key', apiKey)
    body.append('image', base64)

    try {
      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body
      })
      const data = await res.json()
      if (data.success) {
        return data.data.url
      } else {
        console.error('Error imgbb:', data)
        return null
      }
    } catch (e) {
      console.error('Error subiendo imagen:', e)
      return null
    }
  }

  const handleSiguiente = async () => {
    if (!nombres || !apellidoP || !fechaNacimiento ||
      !curp || !cedula || !sexo || !telefono || !email ||
      !contrasena || contrasena !== confirmarContrasena) {
      setError('Por favor completa todos los campos y revisa la contraseña')
      return
    }
    setError(null)
    setCargando(true)

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), contrasena)
      const uid = cred.user.uid

      let fotoURL = null
      if (imagenUri) {
        const base64 = await (await fetch(imagenUri)).blob()
        const reader = new FileReader()
        reader.readAsDataURL(base64)
        await new Promise(resolve => reader.onloadend = resolve)
        const base64Data = reader.result.split(',')[1]
        fotoURL = await subirAImgbb(base64Data)
      }

      await setDoc(doc(db, 'usuarios', uid), {
        nombres,
        apellidoP,
        apellidoM,
        fechaNacimiento,
        curp,
        cedula,
        sexo,
        telefono,
        email: email.trim(),
        contrasena,
        rol,
        fotoURL: fotoURL || null,
        creado: new Date().toISOString()
      })

      navigation.replace('InicioSesion', {
        doctorId: uid,
        nombreDoctor: nombres
      })
    } catch (e) {
      console.error('Error registrando doctor:', e)
      setError('Error al registrar. ' + (e.message || 'Intenta de nuevo.'))
    } finally {
      setCargando(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Registro de Doctor</Text>
        <Text style={styles.subtitulo}>Llena los campos para completar tu registro como doctor</Text>

        <TouchableOpacity onPress={seleccionarImagen} style={{ alignSelf: 'center', marginBottom: 20 }}>
          <Image
            source={imagenUri ? { uri: imagenUri } : require('../../assets/avatar_placeholder.png')}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ color: '#0B2E59', textAlign: 'center', marginTop: 8 }}>
            {imagenUri ? 'Cambiar foto' : 'Agregar foto'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput style={styles.input} placeholder="Nombre(s)" value={nombres} onChangeText={setNombres} />
        <TextInput style={styles.input} placeholder="Apellido Paterno" value={apellidoP} onChangeText={setApellidoP} />
        <TextInput style={styles.input} placeholder="Apellido Materno (opcional)" value={apellidoM} onChangeText={setApellidoM} />
        <TextInput style={styles.input} placeholder="Fecha de Nacimiento (YYYY-MM-DD)" value={fechaNacimiento} onChangeText={setFechaNacimiento} />
        <TextInput style={styles.input} placeholder="C" value={curp} onChangeText={setCurp} />
        <TextInput style={styles.input} placeholder="Cédula Profesional" value={cedula} onChangeText={setCedula} />

        <Text style={styles.labelRadio}>Sexo:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={[styles.radioOption, sexo === 'M' && styles.radioActive]} onPress={() => setSexo('M')}>
            <Text style={[styles.radioText, sexo === 'M' && styles.radioTextActive]}>Masculino</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.radioOption, sexo === 'F' && styles.radioActive]} onPress={() => setSexo('F')}>
            <Text style={[styles.radioText, sexo === 'F' && styles.radioTextActive]}>Femenino</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Teléfono" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
        <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={contrasena} onChangeText={setContrasena} />
        <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry value={confirmarContrasena} onChangeText={setConfirmarContrasena} />

        <TouchableOpacity style={styles.boton} onPress={handleSiguiente}>
          <Text style={styles.botonTexto}>Siguiente</Text>
        </TouchableOpacity>
        {cargando && <ActivityIndicator style={{ marginTop: 16 }} />}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { alignItems: 'center', paddingTop: 30, paddingBottom: 50 },
  titulo: { fontSize: 26, fontWeight: '700', color: '#0B2E59', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#6B6B6B', marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 },
  error: { color: 'red', marginBottom: 12 },
  input: { width: INPUT_WIDTH, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  labelRadio: { alignSelf: 'flex-start', marginLeft: (width - INPUT_WIDTH) / 2, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  radioGroup: { flexDirection: 'row', marginBottom: 12 },
  radioOption: { flex: 1, borderWidth: 1, borderColor: '#CCC', paddingVertical: 10, borderRadius: 8, marginHorizontal: 6, alignItems: 'center' },
  radioActive: { borderColor: '#0B2E59', backgroundColor: '#DDE6F0' },
  radioText: { color: '#4A4A4A', fontWeight: '500' },
  radioTextActive: { color: '#0B2E59', fontWeight: '700' },
  boton: { width: INPUT_WIDTH, backgroundColor: '#0B2E59', paddingVertical: 14, borderRadius: 8, marginTop: 20 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }
})
