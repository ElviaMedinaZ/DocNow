import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaNotaConsulta({ navigation, route }) {
  const { nombrePaciente, edad, consultorio } = route.params;

  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [tratamiento, setTratamiento] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Notas de consulta</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Info paciente */}
      <Text style={styles.label}>Fecha: 21 de mayo de 2024</Text>
      <Text style={styles.label}>Nombre: {nombrePaciente}</Text>
      <Text style={styles.label}>Edad: {edad} años</Text>
      <Text style={styles.label}>Consultorio: {consultorio}</Text>

      {/* Peso y altura */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
      </View>

      {/* Diagnóstico */}
      <TextInput
        style={styles.input}
        placeholder="Diagnóstico"
        value={diagnostico}
        onChangeText={setDiagnostico}
      />

      {/* Síntomas */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Síntomas"
        multiline
        value={sintomas}
        onChangeText={setSintomas}
      />

      {/* Tratamiento */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Añadir indicaciones..."
        multiline
        value={tratamiento}
        onChangeText={setTratamiento}
      />

      {/* Botones */}
      <TouchableOpacity style={styles.botonGuardar}>
        <Text style={styles.textoBoton}>Guardar nota</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botonCancelar} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B2E59',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  botonGuardar: {
    backgroundColor: '#0B2E59',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botonCancelar: {
    borderWidth: 1,
    borderColor: '#0B2E59',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoBotonCancelar: {
    color: '#0B2E59',
    fontWeight: 'bold',
  },
});
