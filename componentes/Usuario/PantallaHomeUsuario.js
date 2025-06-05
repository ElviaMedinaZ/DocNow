import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets(); // ← obtiene espacios seguros
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

      <View style={styles.contenedorBuscador}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar"
          placeholderTextColor="#0A3B74"
        />
        <Ionicons name="search" size={20} color="#0A3B74" style={styles.iconoBuscar} />
      </View>

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

            {/* seccion de citas */}Add commentMore actions
        <View style={styles.contenedorCitas}>
          <TouchableOpacity style={styles.citasItem}>
            <Image
              source={require('../../assets/Iconos_Citas/rectangulo.png')}
              style={styles.imagenRectangulo}
            />
            {/* <Image
              source={require('../assets//doctor juan.png')}
              style={styles.imagenDoctoresCitas}
              resizeMode="cover"
            /> */}
            <Text style={styles.labelCitas}>Dr. Juan Hernández</Text>
            <Image
              source={require('../../assets/Iconos_Citas/linea.png')}
              style={styles.imagenLinea}
            />
            <View  Styles={styles.contenedorFechas}>
              <Ionicons name="calendar" size={20} color="#0A3B74" style={styles.icono} />
              <Text style={styles.labelFecha}>13 Sept. 2022</Text>
              <Text style={styles.labelHora}>10:00 AM</Text>
            </View>
          </TouchableOpacity>
        </View>

      <View style={[styles.barraInferior,{ paddingBottom: insets.bottom || 10 }]}>
        <Ionicons name="home" size={24} color="#0A3B74" />Add commentMore actions
        <Ionicons name="calendar" size={24} color="#0A3B74" />
        <Ionicons name="notifications" size={24} color="#0A3B74" />
        <TouchableOpacity onPress={() => navigation.navigate('PantallaPerfilUsuario')}>
            <Ionicons name="person" size={24} color="#0A3B74" />
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
    marginBottom: 25,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 45,
  },
  contenedorBuscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#0A3B74',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  iconoBuscar: {
    marginRight: 8,
  },
  buscador: {
    flex: 1,
    height: 40,
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
    color: '#0A3B74',
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
  listaMedicos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  doctoresImagen: {
    width: 100,
    height: 100,
    marginLeft: 8,
  },
  // Estilos de la seccion de citas
  contenedorCitas: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBlock: 110,
  },
  citasItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagenDoctoresCitas: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginLeft: 10,
  },
  labelCitas: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "100",
  },
  imagenRectangulo: {
    width: 10,
    height: 100,
    marginLeft: 8,
  },
  imagenLinea: {
    width: 1,
    height: 100,
    marginLeft: 8,
  },
  contenedorFechas: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  labelFecha: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
    alignSelf: 'center',
    alignItems: 'center',
  },
  labelHora: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "100",
    alignSelf: 'center',
    alignItems: 'center',
  },
  icono: {
    alignSelf: 'center',
    alignItems: 'center',
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
    marginBottom: 35,
  },
});

