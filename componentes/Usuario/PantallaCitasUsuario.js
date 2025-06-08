import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../utileria/firebase';
import { signOut } from 'firebase/auth';

export default function PantallaCitasHome({ navigation }) {
  const insets = useSafeAreaInsets();
  const [vistaActiva, setVistaActiva] = useState('citas');

  const citas = [
    {
      id: '1',
      nombre: 'Dr. Juan Hernández',
      tipo: 'Rayos X',
      foto: require('../../assets/avatar_placeholder.png'),
      fecha: '13 Sept. 2022',
      hora: '10:00 AM',
    },
    {
      id: '2',
      nombre: 'Dra. María Gonzalez',
      tipo: 'Consulta',
      foto: require('../../assets/avatar_placeholder.png'),
      fecha: '20 Sept. 2022',
      hora: '01:00 PM',
    },
    {
      id: '3',
      nombre: 'Dr. Ernesto Guluarte',
      tipo: 'Consulta',
      foto: require('../../assets/avatar_placeholder.png'),
      fecha: '10 Oct. 2022',
      hora: '10:00 AM',
    },
  ];

  const renderCita = ({ item }) => (
    <View style={styles.contenedorCitas}>
      <TouchableOpacity style={styles.citasItem}>
        <Image
          source={require('../../assets/Iconos_Citas/rectangulo.png')}
          style={styles.imagenRectangulo}
        />
        <Image source={item.foto} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.labelCitas}>{item.nombre}</Text>
          <Text style={styles.tipo}>{item.tipo}</Text>
        </View>
        <Image
          source={require('../../assets/Iconos_Citas/linea.png')}
          style={styles.imagenLinea}
        />
        <View style={styles.contenedorFechas}>
          <Ionicons name="calendar" size={20} color="#0A3B74" style={styles.icono} />
          <Text style={styles.labelFecha}>{item.fecha}</Text>
          <Text style={styles.labelHora}>{item.hora}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

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

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={manejarCerrarSesion}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setVistaActiva('citas')} style={styles.tabItem}>
            <Ionicons name="calendar-outline" size={24} color="#0A3B74" />
            <Text
              style={[styles.tabText, vistaActiva === 'citas' && styles.tabActivo]}
            >
              Citas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVistaActiva('historial')} style={styles.tabItem}>
            <Ionicons name="archive" size={24} color="#0A3B74" />
            <Text
              style={[styles.tabText, vistaActiva === 'historial' && styles.tabActivo]}
            >
              Historial
            </Text>
          </TouchableOpacity>
        </View>

        <Ionicons name="settings-outline" size={24} color="black" />
      </View>

      {/* CONTENIDO */}
      {vistaActiva === 'citas' ? (
        <FlatList
          data={citas}
          renderItem={renderCita}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.sinContenido}>
          <Text style={styles.labelInfo}>Sin historial</Text>
        </View>
      )}

      {/* BARRA INFERIOR */}
      <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('MenuPaciente')}>
            <Ionicons name="home" size={24} color="#0A3B74" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaCitas')}>
            <Ionicons name="calendar" size={24} color="#007AFF4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaNotificaciones')}>
            <Ionicons name="notifications" size={24} color="#0A3B74" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaPerfilUsuario')}>
            <Ionicons name="person" size={24} color="#0A3B74" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  tabActivo: {
    color: '#007AFF',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  sinContenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelInfo: {
    fontSize: 16,
    color: 'gray',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  // NUEVOS ESTILOS PARA CITA HORIZONTAL
  contenedorCitas: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginHorizontal: 20,
  },
  citasItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  imagenRectangulo: {
    width: 8,
    height: 90,
    marginRight: 10,
  },
  imagenLinea: {
    width: 1,
    height: 80,
    marginHorizontal: 10,
    backgroundColor: '#ccc',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  labelCitas: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A3B74',
  },
  tipo: {
    fontSize: 14,
    color: '#7993B1',
  },
  contenedorFechas: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  labelFecha: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  labelHora: {
    fontSize: 13,
    color: '#333',
  },
  icono: {
    marginBottom: 4,
  },
});
