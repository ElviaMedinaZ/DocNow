import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaMetodoPago({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Métodos de Pago</Text>

      <TouchableOpacity style={styles.tarjetaBoton}>
        <Ionicons name="card-outline" size={20} color="#000" />
        <Text style={styles.textoBoton}> Agregar tarjeta crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tarjetaBoton}>
        <Ionicons name="card-outline" size={20} color="#000" />
        <Text style={styles.textoBoton}> Agregar tarjeta Débito</Text>
      </TouchableOpacity>

      {/* Barra inferior */}
      <View style={styles.barraInferior}>
        <TouchableOpacity onPress={() => navigation.navigate('MenuPaciente')}>
          <Ionicons name="home" size={24} color="#0A3B74" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaCitas')}>
          <Ionicons name="calendar" size={24} color="#0A3B74" />
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
    flex: 1, backgroundColor: '#fff', padding: 20,
  },
  backButton: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginTop: 20,
    marginBottom: 30,
  },
  tarjetaBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  textoBoton: {
    fontSize: 16,
    color: '#333',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});
