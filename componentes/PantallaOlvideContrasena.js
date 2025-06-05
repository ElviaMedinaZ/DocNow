{/* Creacion de la pantalla olvidar contrasena
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}

import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../utileria/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function PantallaOlvideContrasena({ navigation }) {
  const [correo, setCorreo] = useState('');

  const manejarSiguiente = async () => {
    const emailLimpio = correo.trim();
    if (!emailLimpio) {
      return Alert.alert('Error', 'Ingresa tu correo electrónico');
    }

    try {
      // Validar si el correo existe en Firestore
      const q = query(collection(db, 'usuarios'), where('email', '==', emailLimpio));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return Alert.alert('Error', 'El correo no está registrado en el sistema');
      }

      // Generar el código de verificación
      const codigo = Math.floor(10000 + Math.random() * 90000);

      // Llamar al backend para enviar el correo
      const response = await fetch('http://localhost:3000/enviarCodigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpio, codigo }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Código enviado', `El código se ha enviado a: ${emailLimpio}`);
        navigation.replace('VerificarCodigo', { email: emailLimpio });  // Corregido
      } else {
        throw new Error(result.error || 'Error al enviar el código');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={24} color="#0A3B74" />
      </TouchableOpacity>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.titulo}>Olvidé mi contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#A7A6A5"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />
      <TouchableOpacity style={styles.boton} onPress={manejarSiguiente}>
        <Text style={styles.textoBoton}>Siguiente</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:24, backgroundColor:'#fff' },
  botonVolver: { alignSelf:'flex-start', marginBottom:32 },
  logo: { width:120, height:60, alignSelf:'center', marginBottom:32 },
  titulo: { fontSize:24, fontWeight:'600', color:'#0A3B74', textAlign:'center' },
  input: { backgroundColor:'#F5F5F5', borderRadius:8, padding:12, fontSize:16, marginBottom:32 },
  boton: { backgroundColor:'#0A3B74', borderRadius:25, paddingVertical:14, alignItems:'center', width:'60%', alignSelf:'center' },
  textoBoton: { color:'#fff', fontSize:16, fontWeight:'600' }
});
