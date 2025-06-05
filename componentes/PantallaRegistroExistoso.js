{/* Creacion de la pantalla registro exitoso del usuario
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}

// componentes/PantallaRegistroExitoso.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaRegistroExitoso({ navigation }) {
  return (
    <View style={styles.container}>
    <View style={styles.encabezado}>
  <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={24} color="#0A3B74" />
  </TouchableOpacity>

  <Image
    source={require('../assets/logo.png')}
    style={styles.logoEncabezado}
    resizeMode="contain"
  />
</View>

      <Text style={styles.titulo}>Registro exitoso</Text>

      <View style={styles.circle}>
        <Ionicons name="checkmark" size={64} color="#fff" />
      </View>

      <Text style={styles.subtitulo}>Ahora puedes iniciar sesión</Text>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('InicioSesion')}>
        <Text style={styles.textoBoton}>Terminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

encabezado: {
  position: 'relative',
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 32,
},
botonVolver: {
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: [{ translateY: -12 }],
  paddingHorizontal: 16,
},
logoEncabezado: {
  width: 70,
  height: 30,
},


  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginBottom: 24,
  },
  circle: {
    backgroundColor: '#00B5D9',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitulo: {
    fontSize: 14,
    color: '#444',
    marginBottom: 40,
  },
  boton: {
    backgroundColor: '#0A3B74',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 25,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
