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
import { Ionicons } from '@expo/vector-icons';

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
      <TouchableOpacity style={styles.btnFinalizar}>
        <Text style={styles.btnTexto}>Finalizar</Text>
      </TouchableOpacity>
        <TouchableOpacity
            style={styles.btnNotas}
            onPress={() => navigation.navigate('NotaConsulta', {
                nombrePaciente: item.nombre,
                edad: 21, // Reemplaza con datos reales si los tienes
                consultorio: '5'
            })}
            >
            <Text style={styles.btnTexto}>Notas</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Cerrar sesión',
                '¿Deseas cerrar sesión y salir?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: () => navigation.navigate('PantallaInicio'), // Cambia si tu pantalla de login es diferente
                  },
                ]
              )
            }
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setVistaActiva('citas')}>
            <Text
              style={[
                styles.tabText,
                vistaActiva === 'citas' && styles.tabActivo,
              ]}
            >
              Citas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVistaActiva('historial')}>
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
      <View style={[styles.barraInferior,{ paddingBottom: insets.bottom || 10 }]}>
        <Ionicons name="people" size={24} color="gray" />
        <Ionicons name="calendar" size={24} color="#007AFF" />
        <Ionicons name="notifications" size={24} color="gray" />
        <TouchableOpacity onPress={() => navigation.navigate('PerfilDoctor')}>
          <Ionicons name="person" size={24} color="gray" />
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
    color: 'gray',
  },
  btnFinalizar: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnNotas: {
    backgroundColor: '#5C6BC0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
  btnTexto: {
    color: '#fff',
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
