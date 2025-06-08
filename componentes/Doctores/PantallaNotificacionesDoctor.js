import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Alert } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';

export default function PantallaCitasHome({ navigation }) {
  const insets = useSafeAreaInsets();

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

      {/* TEXTO CENTRAL */}
      <View style={styles.sinContenido}>
        <Text style={styles.labelInfo}>Sin citas previas</Text>
      </View>

      {/* BARRA INFERIOR */}
      <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('PacienteDoctor')}>
          <Ionicons name="people" size={24} color="#0A3B74" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PantallaHomeDoctor')}>
          <Ionicons name="calendar" size={24} color="#0A3B74" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('NotificacionesDoctores')}>
          <Ionicons name="notifications" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PerfilDoctor')}>
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
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  sinContenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelInfo: {
    fontSize: 18,
    color: 'gray',
    fontWeight: '500',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});
