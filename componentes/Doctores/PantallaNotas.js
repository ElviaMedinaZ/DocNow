import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const notasMock = [
  { id: '1', fecha: '09 de mayo 2022', tipo: 'Consulta' },
  { id: '2', fecha: '12 de abril 2022', tipo: 'Rayos X' },
  { id: '3', fecha: '5 de marzo 2022', tipo: 'Inyección' },
  { id: '4', fecha: '10 de febrero 2022', tipo: 'Consulta' },
];

export default function PantallaNotasPaciente({ navigation }) {
  const renderNota = ({ item }) => (
    <View style={styles.notaItem}>
      <FontAwesome5 name="file-alt" size={50} color="#0A3B74" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.fecha}>{item.fecha}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>
      </View>
      <TouchableOpacity style={styles.btnVer}>
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
        <Text style={styles.nombrePaciente}>Aquí va el nombre</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* LISTA DE NOTAS */}
      <FlatList
        data={notasMock}
        renderItem={renderNota}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* BOTÓN RESPALDAR */}
      <View style={styles.contenedorBtn}>
        <TouchableOpacity style={styles.btnRespaldar}>
          <Text style={styles.btnTextoRespaldar}>Respaldar</Text>
        </TouchableOpacity>
      </View>

      {/* BARRA INFERIOR */}
      <View style={styles.barraInferior}>
        {/*Boton perfil */}
        <TouchableOpacity onPress={() => navigation.navigate('PacienteDoctor')}>
            <Ionicons name="people" size={24} color="#0A3B74" />
        </TouchableOpacity>
    
        {/*Boton citas */}
        <TouchableOpacity onPress={() => navigation.navigate('PantallaHomeDoctor')}>
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
  nombrePaciente: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginTop: 20,
  },
  notaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
  },
  fecha: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipo: {
    fontSize: 12,
    color: '#0A3B74',
  },
  btnVer: {
    backgroundColor: '#0A3B74',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnTexto: {
    color: '#fff',
    fontSize: 12,
  },
  btnRespaldar: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginTop: '10%',
    width: 200,
    height: 68,
  },
  btnTextoRespaldar: {
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  contenedorBtn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom: 35,
  },
});
