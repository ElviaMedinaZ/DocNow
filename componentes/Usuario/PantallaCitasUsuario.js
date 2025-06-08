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
import { Calendar } from 'react-native-calendars';
import { auth } from '../../utileria/firebase';
import { signOut } from 'firebase/auth';
import moment from 'moment';

export default function PantallaCitasHome({ navigation }) {
  const insets = useSafeAreaInsets();
  const [vistaActiva, setVistaActiva] = useState('citas');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    moment().format('YYYY-MM-DD')
  );

const getMarkedDates = () => {
  const marks = {};

  citas.forEach((cita) => {
    if (!marks[cita.fecha]) {
      marks[cita.fecha] = { marked: true, dotColor: '#007AFF' };
    }
  });

  // Si el día seleccionado también tiene punto, combinamos ambas propiedades
  if (marks[fechaSeleccionada]) {
    marks[fechaSeleccionada] = {
      ...marks[fechaSeleccionada],
      selected: true,
      selectedColor: '#007AFF',
    };
  } else {
    marks[fechaSeleccionada] = {
      selected: true,
      selectedColor: '#007AFF',
    };
  }

  return marks;
};

    const citasHistorial = [
    {
        id: '4',
        nombre: 'Dra. María Gonzalez',
        tipo: 'Rayos X',
        foto: require('../../assets/avatar_placeholder.png'),
    },
    {
        id: '5',
        nombre: 'Dr. Ernesto Guluarte',
        tipo: 'Consulta',
        foto: require('../../assets/avatar_placeholder.png'),
    },
    {
        id: '6',
        nombre: 'Dra. Vanessa Lopez',
        tipo: 'Consulta',
        foto: require('../../assets/avatar_placeholder.png'),
    },
    ];
 const citas = [
  {
    id: '1',
    nombre: 'Dr. Juan Hernández',
    tipo: 'Rayos X',
    foto: require('../../assets/avatar_placeholder.png'),
    fecha: moment().add(1, 'day').format('YYYY-MM-DD'),
    hora: '10:00 AM',
  },
  {
    id: '2',
    nombre: 'Dra. María Gonzalez',
    tipo: 'Consulta',
    foto: require('../../assets/avatar_placeholder.png'),
    fecha: moment().add(3, 'day').format('YYYY-MM-DD'),
    hora: '01:00 PM',
  },
  {
    id: '3',
    nombre: 'Dr. Ernesto Guluarte',
    tipo: 'Consulta',
    foto: require('../../assets/avatar_placeholder.png'),
    fecha: moment().add(5, 'day').format('YYYY-MM-DD'),
    hora: '09:00 AM',
  },
];

  const citasFiltradas = citas.filter((cita) => cita.fecha === fechaSeleccionada);

  const renderCita = ({ item }) => (
  <TouchableOpacity
    style={styles.cardCita}
    onPress={() => navigation.navigate('PantallaConfirmarCita', { cita: item })}
  >
    <View style={styles.leftBar} />
    <Image source={item.foto} style={styles.cardAvatar} />
    <View style={styles.cardInfo}>
      <Text style={styles.cardNombre}>{item.nombre}</Text>
      <Text style={styles.cardTipo}>{item.tipo}</Text>
    </View>
    <View style={styles.cardLinea} />
    <View style={styles.cardFechaHora}>
      <Ionicons name="calendar" size={20} color="#0A3B74" />
      <Text style={styles.cardFecha}>{moment(item.fecha).format('DD MMM. YYYY')}</Text>
      <Text style={styles.cardHora}>{item.hora}</Text>
    </View>
  </TouchableOpacity>
);

    const renderHistorial = ({ item }) => (
    <View style={styles.cardHistorial}>
        <Image source={item.foto} style={styles.cardAvatar} />

        <View style={styles.cardInfo}>
        <Text style={styles.cardNombre}>{item.nombre}</Text>
        <Text style={styles.cardTipo}>{item.tipo}</Text>
        </View>

        <TouchableOpacity
        style={styles.botonEvaluar}
        onPress={() => navigation.navigate('PantallaEvaluacion', { doctor: item })}
        >
        <Text style={styles.textoEvaluar}>Evaluar</Text>
        </TouchableOpacity>
    </View>
    );


  const manejarCerrarSesion = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        onPress: async () => {
          await signOut(auth);
          navigation.replace('InicioSesion');
        },
      },
    ]);
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

        <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
             <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
        
      </View>

      {/* CALENDARIO Y CITAS */}
      {vistaActiva === 'citas' ? (
        <>
          <Calendar
            onDayPress={(day) => setFechaSeleccionada(day.dateString)}
            
            markedDates={getMarkedDates()}
            theme={{
              todayTextColor: '#007AFF',
              arrowColor: '#007AFF',
            }}
          />

          <Text style={styles.fechaTitulo}>
            {moment(fechaSeleccionada).format('DD MMM YYYY')}
          </Text>

            <FlatList
            data={citasFiltradas}
            renderItem={renderCita}
            keyExtractor={(item) => item.id}
            />

        </>
      ) : (
        <FlatList
            data={citasHistorial}
            renderItem={renderHistorial}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            ListEmptyComponent={
                <Text style={styles.labelInfo}>No hay citas archivadas</Text>
            }
            />

      )}

      {/* BARRA INFERIOR */}
      <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('MenuPaciente')}>
          <Ionicons name="home" size={24} color="#0A3B74" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaCitas')}>
          <Ionicons name="calendar" size={24} color="#007AFF" />
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
    cardCita: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    padding: 10,
  },
  leftBar: {
    width: 6,
    height: 70,
    backgroundColor: '#007AFF',
    borderRadius: 3,
    marginRight: 10,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardNombre: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0A3B74',
  },
  cardTipo: {
    fontSize: 13,
    color: '#777',
  },
  cardLinea: {
    width: 1,
    height: 60,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  cardFechaHora: {
    alignItems: 'flex-end',
  },
  cardFecha: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#0A3B74',
  },
  cardHora: {
    fontSize: 13,
    color: '#333',
  },
  cardHistorial: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
},
botonEvaluar: {
  borderWidth: 1,
  borderColor: '#0A3B74',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},
textoEvaluar: {
  color: '#0A3B74',
  fontWeight: 'bold',
  fontSize: 13,
},


});
