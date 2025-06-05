{/* Pantalla para iniciar sesión
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../utileria/firebase';

export default function PantallaInicioSesion({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContra, setMostrarContra] = useState(false);

const manejarInicioSesion = async () => {
  if (!correo || !contrasena) {
    console.error('Error: Ingresa correo y contraseña');
    return;
  }

  try {
    // 1) Autenticar
    await signInWithEmailAndPassword(auth, correo.trim(), contrasena);

    // 2) Leer el documento de usuario por email
    const usuariosRef   = collection(db, 'usuarios');
    const q             = query(usuariosRef, where('email', '==', correo.trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('Usuario no encontrado en Firestore');
      return;
    }

    // 3) Extraer datos
    const userDoc      = querySnapshot.docs[0];
    const userId       = userDoc.id;
    const userData     = userDoc.data();
    const nombreUsuario = userData.nombres;
    // Puede venir como string, lo convertimos a número:
    let rol = userData.rol;

    console.log(`Inicio de sesión: ${nombreUsuario} (ID: ${userId}), rol=${rol}`);

    // 4) Redirigir según rol
    switch (rol) {
      case 'Admin': // Admin
        navigation.replace('MenuAdmin', {
          userId,
          nombreUsuario,
          emailUsuario: correo.trim()
        });
        break;

      case 'Doctor': // Doctor
        navigation.replace('pantallaHomeDoctor', {
          userId,
          nombreUsuario,
          emailUsuario: correo.trim()
        });
        break;

      case 'Paciente': // Principal
        navigation.replace('MenuPaciente', {
          userId,
          nombreUsuario,
          emailUsuario: correo.trim()
        });
        break;

      default:
        console.error('Rol de usuario no válido:', rol);
        // Puedes enviar a un screen de error o logout
        break;
    }

  } catch (error) {
    console.error('ERROR INICIO SESIÓN →', error.code, error.message);
    switch (error.code) {
      case 'auth/user-not-found':
        console.error('No existe un usuario con este correo.');
        break;
      case 'auth/wrong-password':
        console.error('La contraseña es incorrecta.');
        break;
      case 'auth/invalid-email':
        console.error('El formato del correo es inválido.');
        break;
      case 'auth/user-disabled':
        console.error('La cuenta está deshabilitada.');
        break;
      default:
        console.error('Error desconocido al iniciar sesión.');
    }
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.titulo}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#A7A6A5"
        autoCapitalize="none"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />

      <View style={styles.inputPasswordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Contraseña"
          placeholderTextColor="#A7A6A5"
          secureTextEntry={!mostrarContra}
          value={contrasena}
          onChangeText={setContrasena}
        />
        <TouchableOpacity onPress={() => setMostrarContra(!mostrarContra)} style={styles.iconoOjo}>
          <Ionicons name={mostrarContra ? 'eye' : 'eye-off'} size={20} color="#646464" />
        </TouchableOpacity>
      </View>

       {/* Olvidaste contraseña */}
      <TouchableOpacity
        onPress={() => navigation.navigate('OlvideContrasena')}
        style={styles.linkOlvidaste}
      >
        <Text style={styles.textOlvidaste}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.boton} onPress={manejarInicioSesion}>
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>

        {/* Registro */}
      <View style={styles.footer}>
        <Text style={styles.textoFooter}>¿No tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={[styles.textoFooter, styles.linkRegistro]}>
            Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    // Añade espacio extra arriba:
    paddingTop: 48,   // antes era 24, ahora 48
  },
  logo: {
    width: 100,
    height: 60,
    alignSelf: 'center',
    // Si quieres desplazar solo el logo:
    marginTop: 32,    // antes 16, ahora 32 o más
    marginBottom: 32
  },
  titulo: {
    fontSize: 24,
    color: '#0A3B74',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24
  },
  input: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16
  },
  inputPasswordContainer: {
    width: '80%',
    textAlign: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 8
  },
  iconoOjo: {
    top: '50%',
    transform: [{translateY: -10}],
    position: 'absolute',
    right: 16
  },
  linkOlvidaste: {
    alignSelf: 'flex-end',
    marginBottom: 24
  },
  textOlvidaste: {
    paddingRight: 50,  // empuja el texto 20px desde el borde derecho
    color: '#488FC0',
    fontSize: 14
  },
  boton: {
    marginTop : 170,
    backgroundColor: '#0A3B74',
    borderRadius: 25,
    marginBottom: 32,
    paddingTop :20,
    paddingBottom :20,
  // centrar + ancho al 80% del contenedor
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',

  },
  textoBoton: {
    textAlign: 'center', 
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textoFooter: {
    fontSize: 14,
    color: '#646464'
  },
  linkRegistro: {
    color: '#488FC0',
    fontWeight: '600'
  }
});
