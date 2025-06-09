import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../utileria/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaEditarCita({ route, navigation }) {
  const { citaId } = route.params;
  const [cita, setCita] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs().format('YYYY-MM-DD'));
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [disabledDates, setDisabledDates] = useState({});
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  useEffect(() => {
    const cargarCitaYDoctor = async () => {
      const citaRef = doc(db, 'citas', citaId);
      const citaSnap = await getDoc(citaRef);
      if (!citaSnap.exists()) return Alert.alert('Cita no encontrada');
      const citaData = citaSnap.data();
      setCita(citaData);
      setFechaSeleccionada(citaData.fecha);
      setHoraSeleccionada(citaData.hora);

      const doctorRef = doc(db, 'usuarios', citaData.doctorId);
      const doctorSnap = await getDoc(doctorRef);
      if (!doctorSnap.exists()) return Alert.alert('Doctor no encontrado');
      const doctorData = doctorSnap.data();
      setDoctor(doctorData);
    };

    cargarCitaYDoctor();
  }, [citaId]);

  useEffect(() => {
    if (doctor) {
      generarFechasDeshabilitadas(doctor);
      cargarHorasOcupadas(fechaSeleccionada);
    }
  }, [doctor, fechaSeleccionada]);

  const cargarHorasOcupadas = async (fecha) => {
    if (!cita?.doctorId) return;
    const snapshot = await getDocs(collection(db, 'citas'));
    const ocupadas = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (
        data.doctorId === cita.doctorId &&
        data.fecha === fecha &&
        data.estatus === 'Pendiente' &&
        docSnap.id !== citaId
      ) {
        ocupadas.push(data.hora);
      }
    });
    setHorasOcupadas(ocupadas);
  };

  const generarFechasDeshabilitadas = (doctorData) => {
    const turno = doctorData.turnoDia;
    const disabled = {};
    for (let i = 0; i < 90; i++) {
      const date = dayjs().add(i, 'day');
      const day = date.day();
      const dateStr = date.format('YYYY-MM-DD');
      if (
        (turno === 'lunes a viernes' && (day === 0 || day === 6)) ||
        (turno === 'sábado y domingo' && day >= 1 && day <= 5)
      ) {
        disabled[dateStr] = { disabled: true, disableTouchEvent: true };
      }
    }
    setDisabledDates(disabled);
  };

  const generarHoras = () => {
    if (!doctor) return [];
    const turno = doctor.turnoHora;
    const horas = [];
    let inicio = turno === 'matutino' ? 8 : 15;
    let fin = turno === 'matutino' ? 14 : 21;

    for (let h = inicio; h < fin; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
      horas.push(`${String(h).padStart(2, '0')}:30`);
    }
    horas.push(`${fin}:00`);
    return horas;
  };

  const guardarCambios = async () => {
    if (!horaSeleccionada || !fechaSeleccionada) {
      return Alert.alert('Error', 'Selecciona fecha y hora');
    }
    try {
      await updateDoc(doc(db, 'citas', citaId), {
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
      });
      Alert.alert('Cita actualizada');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error al guardar');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar cita</Text>

      <Calendar
        onDayPress={(day) => setFechaSeleccionada(day.dateString)}
        markedDates={{
          [fechaSeleccionada]: { selected: true, marked: true, selectedColor: '#0A3B74' },
          ...disabledDates
        }}
        minDate={dayjs().format('YYYY-MM-DD')}
        disableAllTouchEventsForDisabledDays={true}
      />

      <Text style={styles.subtitle}>Horarios disponibles</Text>
      <View style={styles.horaContainer}>
        {generarHoras()
          .filter(hora => !horasOcupadas.includes(hora))
          .map(hora => (
            <TouchableOpacity
              key={hora}
              style={[styles.horaButton, horaSeleccionada === hora && styles.horaSeleccionada]}
              onPress={() => setHoraSeleccionada(hora)}>
              <Text style={horaSeleccionada === hora ? styles.horaTextSel : styles.horaText}>{hora}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
        <Text style={styles.btnText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
        <Text style={styles.btnCancelarText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginTop: 20, marginBottom: 10 },
  horaContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  horaButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    margin: 5,
  },
  horaSeleccionada: {
    backgroundColor: '#0A3B74',
  },
  horaText: { color: '#000' },
  horaTextSel: { color: '#fff' },
  btnGuardar: {
    backgroundColor: '#0A3B74',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnCancelar: {
    borderColor: '#0A3B74',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  btnCancelarText: { color: '#0A3B74', fontWeight: 'bold' },
});
