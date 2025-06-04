import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaReportes({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Reportes</Text>
        <View style={{ width: 24 }} /> {/* Espacio simétrico al ícono */}
      </View>

      {/* Contenido aquí */}
      <Text style={styles.textoContenido}>Aquí irán tus reportes...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textoContenido: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});