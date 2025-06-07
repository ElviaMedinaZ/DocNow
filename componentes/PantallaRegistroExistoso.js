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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonVolver}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
    
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
        </View>

        <Text style={styles.titulo}>Registro exitoso</Text>

        <View style={styles.iconoExito}>
          <Image source={require('../assets/Exito.png')} style={styles.icono} resizeMode="contain" />
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
    height: 60,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 33,
  },
  botonVolver: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,
    marginBottom: 33,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    marginBottom: 33,
  },
  logo: {
    width: 100,
    height: 40,
    alignSelf: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginBottom: 30,
  },
  icono: {
    width: '100%',
  },
  iconoExito: {
    width: '80%',
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitulo: {
    fontSize: 18,
    color: '#444',
    marginBottom: 40,
    marginTop: 20
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
    marginTop: '50%'
  },
  textoBoton: {
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
});
