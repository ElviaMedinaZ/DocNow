import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Alert } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../utileria/firebase';



export default function PantallaCitasHome({ navigation }) {
  const insets = useSafeAreaInsets(); // ← obtiene espacios seguros
  const [vistaActiva, setVistaActiva] = useState('citas'); // 'citas' o 'historial'

  const citas = [
    {
      id: '1',
      nombre: 'Maria Jose Perez Luna',
      tipo: 'Consulta',
      foto: require('../../assets/avatar_placeholder.png'), 
    },
    {
      id: '2',
      nombre: 'Daniel Flores Zazueta',
      tipo: 'Rayos X',
      foto: require('../../assets/avatar_placeholder.png'),
    },
  ];

  const renderCita = ({ item }) => (
      <View style={styles.card}>
        <Image source={item.foto} style={styles.avatar} />
        
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.tipo}>{item.tipo}</Text>
        </View>

        {/* Contenedor vertical para los botones */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.btnFinalizar}>
            <Text style={styles.btnTexto}>Finalizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnNotas}
            onPress={() => navigation.navigate('NotaConsulta', {
              nombrePaciente: item.nombre,
              edad: 21,
              consultorio: '5',
            })}
          >
            <Text style={styles.btnTextoNotas}>+ Notas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

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
              style={[
                styles.tabText,
                vistaActiva === 'citas' && styles.tabActivo,
              ]}
            >
              Citas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVistaActiva('historial')} style={styles.tabItem}>
            <Ionicons name="archive" size={24} color="#0A3B74"  alignItems='center'/>
            <Text
              style={[
                styles.tabText,
                vistaActiva === 'historial' && styles.tabActivo,
              ]}
            >
              Historial
            </Text>
          </TouchableOpacity>

        </View>
          <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
              <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
        
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
      <View style={[styles.barraInferior,{ paddingBottom: insets.bottom || 10 }]}>
        {/*Boton perfil */}
        <TouchableOpacity onPress={() => navigation.navigate('PacienteDoctor')}>
            <Ionicons name="people" size={24} color="#0A3B74" />
        </TouchableOpacity>
    
        {/*Boton citas */}
        <TouchableOpacity onPress={() => navigation.navigate('pantallaHomeDoctor')}>
            <Ionicons name="calendar" size={24} color="#007AFF" />
        </TouchableOpacity>
    
        {/*Boton notificacion */}
        <TouchableOpacity onPress={() => navigation.navigate('NotificacionesDoctores')}>
            <Ionicons name="notifications" size={24} color="#0A3B74" />
        </TouchableOpacity>

          {/*Boton perfils */}   
        <TouchableOpacity onPress={() => navigation.navigate('PerfilDoctor')}>
            <Ionicons name="person" size={24} color="#0A3B74" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  botonesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  tabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
    marginHorizontal: 10,
  },
  tabItem:{
    alignItems: 'center',
  },
  tabActivo: {
    color: '#007AFF',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipo: {
    fontSize: 12,
    color: '#0A3B74',
  },
  btnFinalizar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
    borderBlockColor: '#0A3B74',
    borderWidth: 1,
  },
  btnNotas: {
    backgroundColor: '#7993B1',
    borderColor: '#0A3B74' ,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
    borderBlockColor: '#0A3B74',
    borderWidth: 1,
  },
  btnTexto: {
    color: '#0A3B74',
    fontSize: 12,
  },
  btnTextoNotas: {
    color: '#ffffff',
    fontSize: 12,
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
});
