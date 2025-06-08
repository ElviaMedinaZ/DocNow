import React from 'react';
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

export default function PantallaPacientesDoctor({ navigation }) {
  const insets = useSafeAreaInsets(); // ← obtiene espacios seguros
  const pacientes = [
    {
      id: '1',
      nombre: 'Maria Jose Perez Luna',
      tipo: 'Consulta general',
      foto: require('../../assets/avatar_placeholder.png'),
    },
    {
      id: '2',
      nombre: 'Daniel Flores Zazueta',
      tipo: 'Rayos X',
      foto: require('../../assets/avatar_placeholder.png'),
    },
  ];

  const renderPaciente = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.foto} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>
      </View>
      <TouchableOpacity style={styles.btnNotas}>
        <Text style={styles.btnTexto}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* LISTA DE PACIENTES */}
      <FlatList
        data={pacientes}
        renderItem={renderPaciente}
        keyExtractor={(item) => item.id}
      />

      {/* BARRA INFERIOR */}
      <View style={[styles.barraInferior,{ paddingBottom: insets.bottom || 10 }]}>
         {/*Boton perfil */}
        <TouchableOpacity onPress={() => navigation.navigate('PacienteDoctor')}>
            <Ionicons name="people" size={24} color="#007AFF" />
        </TouchableOpacity>
    
        {/*Boton citas */}
        <TouchableOpacity onPress={() => navigation.navigate('PantallaHomeDoctor')}>
            <Ionicons name="calendar" size={24} color="#0A3B74" />
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
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B2E59',
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
  btnNotas: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnTexto: {
    color: '#fff',
    fontSize: 12,
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
