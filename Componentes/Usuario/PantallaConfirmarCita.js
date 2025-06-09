import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default function PantallaConfirmarCita({ route, navigation }) {
  const { cita } = route.params;

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Confirmar cita</Text>
        <View style={{ width: 24 }} /> {/* Espacio para equilibrar el ícono */}
      </View>

      {/* Tarjeta de cita */}
      <View style={styles.cardCita}>
        <View style={styles.leftBar} />
        <Image source={cita.foto} style={styles.cardAvatar} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardNombre}>{cita.nombre}</Text>
          <Text style={styles.cardTipo}>{cita.tipo}</Text>
        </View>
        <View style={styles.cardLinea} />
        <View style={styles.cardFechaHora}>
          <Ionicons name="calendar" size={18} color="#0A3B74" />
          <Text style={styles.cardFecha}>
            {moment(cita.fecha).format('DD MMM. YYYY')}
          </Text>
          <Text style={styles.cardHora}>{cita.hora}</Text>
        </View>
      </View>

      {/* Botones */}
      <TouchableOpacity style={styles.botonConfirmar}>
        <Text style={styles.textoConfirmar}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonCancelar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginTop: 20,
  },
  cardCita: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    padding: 10,
    marginTop: 20,
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
    alignItems: 'center',
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
  botonConfirmar: {
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginTop: '80%',
    width: 300,
    height: 68,
    marginLeft: 30,
  },
  textoConfirmar: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  botonCancelar: {
    borderWidth: 1,
    borderColor: '#0A3B74',
    // paddingVertical: 15,
    // borderRadius: 8,
    marginLeft: 30,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginTop: '10%',
    width: 300,
    height: 68,

  },
  textoCancelar: {
    color: '#0A3B74',
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
