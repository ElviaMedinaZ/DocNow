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
import { db } from '../../utileria/firebase';
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

       <Text style={styles.subtitulo}>Por favor, ingresa  tu correo electrónico para recibir un codigo de verificación.</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#7993B1"
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
  container: { 
    flex:1, 
    padding:24, 
    backgroundColor:'#fff' 
  },
  botonVolver: { 
    alignSelf:'flex-start', 
    // marginBottom:'15%',
    paddingBlock: 30,
  },
  logo: { 
    width:120, 
    height:60, 
    alignSelf:'center', 
    marginBottom:32 
  },
  titulo: { 
    fontSize:24, 
    fontWeight:'600', 
    color:'#0A3B74', 
    textAlign:'center' 
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    paddingBlock: 20
  },
  input: { 
    backgroundColor:'#F5F5F5', 
    borderRadius:8, 
    padding:12, 
    fontSize:16, 
    marginBottom:32, 
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
    marginTop: '85%',
    width: 200,
    height: 68,
  },
  textoBoton: { 
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
