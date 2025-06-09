{/* Creacion de la pantalla de notas
  Programador: Kristofer Hernandez
  Fecha: 05 de junio del 2025 */}
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [focusedField, setFocusedField] = useState(null);
  const { nombrePaciente, edad, consultorio } = route.params;

  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [tratamiento, setTratamiento] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.encabezado}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Notas de consulta</Text>
          <Ionicons name="settings-outline" size={24} color="black" />
        </View>

        {/* Info paciente */}
        <Text style={styles.label}>Fecha: 21 de mayo de 2024</Text>
        <Text style={styles.label}>Nombre: {nombrePaciente}</Text>
        <Text style={styles.label}>Edad: {edad} años</Text>
        <Text style={styles.label}>Consultorio: {consultorio}</Text>

        {/* Peso y altura */}
        <View style={styles.row}>
          {/* Peso */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Peso:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1 },
                  focusedField === 'peso' && styles.inputFocused,
                ]}
                placeholder="Peso (kg)"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
                onFocus={() => setFocusedField('peso')}
                onBlur={() => setFocusedField(null)}
              />
              <Text style={styles.unitLabel}>kg</Text>
            </View>
          </View>

          {/* Altura */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Altura:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1 },
                  focusedField === 'altura' && styles.inputFocused,
                ]}
                placeholder="Altura (cm)"
                keyboardType="numeric"
                value={altura}
                onChangeText={setAltura}
                onFocus={() => setFocusedField('altura')}
                onBlur={() => setFocusedField(null)}
              />
              <Text style={styles.unitLabel}>cm</Text>
            </View>
          </View>
        </View>


        {/* Diagnóstico */}
        <Text style={styles.label}>Diagnóstico</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'diagnostico' && styles.inputFocused,
          ]}
          placeholder="Diagnóstico"
          value={diagnostico}
          onChangeText={setDiagnostico}
          onFocus={() => setFocusedField('diagnostico')}
          onBlur={() => setFocusedField(null)}
        />

        {/* Síntomas */}
        <Text style={styles.label}>Síntomas</Text>
        <TextInput
          style={[
            styles.input,
            { height: 70 },
            focusedField === 'sintomas' && styles.inputFocused,
          ]}
          placeholder="Síntomas"
          multiline
          value={sintomas}
          onChangeText={setSintomas}
          onFocus={() => setFocusedField('sintomas')}
          onBlur={() => setFocusedField(null)}
        />

        {/* Tratamiento */}
        <Text style={styles.label}>Tratamiento</Text>
        <TextInput
          style={[
            styles.input,
            { height: 70 },
            focusedField === 'tratamiento' && styles.inputFocused,
          ]}
          placeholder="Añadir indicaciones..."
          multiline
          value={tratamiento}
          onChangeText={setTratamiento}
          onFocus={() => setFocusedField('tratamiento')}
          onBlur={() => setFocusedField(null)}
        />

        {/* Botones */}
        <TouchableOpacity style={styles.botonGuardar}>
          <Text style={styles.textoBoton}>Guardar nota</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotonCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra Inferior Fija */}
      <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
        <Ionicons name="people" size={24} color="#0A3B74" />
        <Ionicons name="calendar" size={24} color="#0A3B74" />
        <Ionicons name="notifications" size={24} color="#0A3B74" />
        <TouchableOpacity onPress={() => navigation.navigate('PerfilDoctor')}>
          <Ionicons name="person" size={24} color="#0A3B74" />
        </TouchableOpacity>
      </View>
    </View>
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
    // marginBottom: '10%',
    paddingBlock: 25,
    marginTop: '10%',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B2E59',
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    marginBlock: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  unitLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#0A3B74',
    borderWidth: 1,
  },
  botonGuardar: {
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
  botonCancelar: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#0A3B74',
    padding: 12,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: '5%',
    width: 200,
    height: 68,
  },
  textoBoton: {
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  textoBotonCancelar: {
    color: '#0B2E59',
    fontWeight: 'bold',
    fontSize: 18,
    fontWeight: '600'
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
