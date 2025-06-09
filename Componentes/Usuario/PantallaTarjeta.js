import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../utileria/firebase';

export default function PantallaFormularioPago({ navigation, route }) {
  const { doctorId, fechaSeleccionada, horaSeleccionada, serviciosSeleccionados, total } = route.params;

  const [numero, setNumero] = useState('');
  const [fecha, setFecha] = useState('');
  const [cvv, setCvv] = useState('');
  const [titular, setTitular] = useState('');

  const crearCita = async () => {
    if (!doctorId || !fechaSeleccionada || !horaSeleccionada || serviciosSeleccionados.length === 0 || !total) {
      return Alert.alert('Error', 'Faltan datos para crear la cita.');
    }

    const pacienteId = auth.currentUser?.uid;
    if (!pacienteId) return Alert.alert('Error', 'No se pudo identificar al paciente.');

    try {
      await addDoc(collection(db, 'citas'), {
        doctorId,
        pacienteId,
        servicio: serviciosSeleccionados.join(', '),
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        comentario: 'Sin comentario.',
        valoracion: null,
        coste: total,
        medioPago: 'Tarjeta',
        estatus: 'Pendiente',
      });

      navigation.replace('PagoConfirmado'); // navegar a pantalla de éxito
    } catch (error) {
      console.error('Error al crear la cita:', error);
      Alert.alert('Error', 'No se pudo registrar la cita.');
    }
  };

 const manejarConfirmacion = () => {
  if (!numero || !fecha || !cvv || !titular) {
    return Alert.alert('Error', 'Completa todos los campos de la tarjeta.');
  }

  Alert.alert(
    'Confirmar pago',
    `¿Deseas confirmar el pago de $${total} y agendar tu cita?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => crearCita(),
      },
    ],
    { cancelable: false }
  );
};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Métodos de Pago</Text>

      <TextInput
        style={styles.input}
        placeholder="Información de la tarjeta"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="MM/AA"
          value={fecha}
          onChangeText={setFecha}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre del titular de tarjeta"
        value={titular}
        onChangeText={setTitular}
      />

      <TouchableOpacity style={styles.boton} onPress={manejarConfirmacion}>
        <Text style={styles.textoBoton}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backButton: { marginTop: 30 },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginVertical: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  boton: {
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
