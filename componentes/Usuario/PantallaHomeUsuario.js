import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utileria/firebase';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaPrincipal({ route, navigation }) {
  const { nombreUsuario, userId } = route.params;
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const obtenerServicios = async () => {
      const coleccion = collection(db, 'Servicios');
      const snapshot = await getDocs(coleccion);
      const serviciosObtenidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServicios(serviciosObtenidos);
    };

    obtenerServicios();
  }, []);

  const manejarCerrarSesion = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: async () => {
            await signOut(auth);
            navigation.replace('InicioSesion');
          } },
      ]
    );
  };

  const renderServicio = ({ item }) => (
    <TouchableOpacity style={styles.servicioItem}>
      <Image source={{ uri: item.FotoUrl }} style={styles.servicioImagen} />
      <View style={styles.servicioTextoContenedor}>
        <Text style={styles.servicioTexto}>{item.Servicio}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={manejarCerrarSesion}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar"
      />

      <TouchableOpacity
        style={styles.tituloConIcono}
        onPress={() => navigation.navigate('PantallaServicios')}
        >
        <Text style={styles.seccionTitulo}>Servicios</Text>
        <Ionicons name="chevron-forward" size={18} color="gray" />
      </TouchableOpacity>

      <FlatList
        horizontal
        data={servicios}
        renderItem={renderServicio}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaServicios}
      />

      <View style={styles.barraInferior}>
        <Ionicons name="home" size={24} color="gray" />
        <Ionicons name="calendar" size={24} color="gray" />
        <Ionicons name="heart" size={24} color="gray" />
        <TouchableOpacity onPress={() => navigation.navigate('PantallaPerfilUsuario')}>
            <Ionicons name="person" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#fff', padding: 16 },
  encabezado: {
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
  buscador: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
  },
  tituloConIcono: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 6,
  },
  listaServicios: {
    paddingHorizontal: 4,
  },
  servicioItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  servicioImagen: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  servicioTexto: {
    fontSize: 14,
    textAlign: 'center',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
});
