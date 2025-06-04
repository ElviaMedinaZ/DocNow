import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../utileria/firebase';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaPerfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, 'usuarios', userId); // Asegúrate de que tu colección sea 'Usuarios'
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsuario(docSnap.data());
      } else {
        Alert.alert('Error', 'No se encontraron los datos del usuario');
      }
    };

    obtenerDatosUsuario();
  }, []);

  const manejarCerrarSesion = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            await signOut(auth);
            navigation.replace('InicioSesion');
          },
        },
      ]
    );
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (


    <View style={styles.container}>

        <View style={styles.encabezado}>
            <TouchableOpacity onPress={manejarCerrarSesion}>
            <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>

        <Image source={{ uri: usuario.fotoUrl }} style={styles.avatar} />
        <Text style={styles.nombre}>{usuario.nombre}</Text>



        <TextInput
            style={styles.input}
            value={usuario.email}
            editable={false}
        />

        <TextInput
            style={styles.input}
            value="************"
            secureTextEntry={true}
            editable={false}
        />

        <TextInput
            style={styles.input}
            value={usuario.telefono}
            editable={false}
        />

        <TouchableOpacity style={styles.botonCerrar} onPress={manejarCerrarSesion}>
            <Text style={styles.textoBoton}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.barraInferior}>
            <TouchableOpacity onPress={() => navigation.navigate('MenuPaciente', {
                nombreUsuario: usuario.nombre,
                userId: auth.currentUser.uid,})} >
                <Ionicons name="home" size={24} color="gray" />
            </TouchableOpacity>
            <Ionicons name="calendar" size={24} color="gray" />
            <Ionicons name="heart" size={24} color="gray" />
            <Ionicons name="person" size={24} color="#007AFF" />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
    encabezado: {
    width: '100%',           
    paddingHorizontal: 20,   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
    logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginVertical: 15,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  botonCerrar: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
});
