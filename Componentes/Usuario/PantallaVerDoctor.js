import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, getDoc, getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { app, auth } from '../../utileria/firebase';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

const db = getFirestore(app);

export default function VerDoctor({ route, navigation }) {
  const { doctorId } = route.params;
  const insets = useSafeAreaInsets();
  const [datos, setDatos] = useState(null);
  const [precios, setPrecios] = useState({});
  const [modoCita, setModoCita] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs().format('YYYY-MM-DD'));
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [disabledDates, setDisabledDates] = useState({}); // ← Agrega esto

  useEffect(() => {
    const cargarDatosDoctor = async () => {
      try {
        const ref = doc(db, 'usuarios', doctorId);
        const snap = await getDoc(ref);
       if (snap.exists()) {
        const data = snap.data();
        setDatos(data);
        generarFechasDeshabilitadas(data); // ← LLÁMALA AQUÍ
        } else {
        Alert.alert('Error', 'Doctor no encontrado');
        }
      } catch (error) {
        console.error('Error cargando doctor:', error);
      }
    };

    const cargarPreciosServicios = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Servicios'));
        const preciosTemp = {};
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data.Servicio && data.Precio) {
            preciosTemp[data.Servicio] = data.Precio;
          }
        });
        setPrecios(preciosTemp);
      } catch (error) {
        console.error('Error cargando precios:', error);
      }
    };

    cargarDatosDoctor();
    cargarPreciosServicios();
  }, [doctorId]);

  useEffect(() => {
    if (fechaSeleccionada) cargarHorasOcupadas(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const cargarHorasOcupadas = async (fecha) => {
    try {
      const snapshot = await getDocs(collection(db, 'citas'));
      const ocupadas = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.doctorId === doctorId && data.fecha === fecha && data.estatus === 'Pendiente') {
          ocupadas.push(data.hora);
        }
      });
      setHorasOcupadas(ocupadas);
    } catch (error) {
      console.error('Error cargando horas ocupadas:', error);
    }
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
        (turno === 'sábado y domingo' && (day >= 1 && day <= 5))
      ) {
        disabled[dateStr] = { disabled: true, disableTouchEvent: true };
      }
    }
    setDisabledDates(disabled);
  };

  // Validación para los días permitidos en el calendario
    const diasPermitidos = (date) => {
    const day = dayjs(date).day(); // 0=Dom, 1=Lun, ..., 6=Sab
    const turno = datos.turnoDia;

    if (turno === 'lunes a viernes') return day >= 1 && day <= 5;
    if (turno === 'sábado y domingo') return day === 0 || day === 6;
    return false;
    };


  if (!datos) return null;

  let servicios = [];
  try {
    if (typeof datos.Servicios === 'string') {
      servicios = datos.Servicios.split(',').map(s => s.trim());
    }
  } catch (err) {
    console.error('Error al procesar Servicios:', err);
  }

// Generador de horas según turno
const generarHoras = () => {
  const turno = datos.turnoHora;
  const horas = [];
  let inicio, fin;

  if (turno === 'matutino') {
    inicio = 8;
    fin = 14;
  } else if (turno === 'vespertino') {
    inicio = 15;
    fin = 21;
  } else {
    return [];
  }

  for (let h = inicio; h < fin; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    horas.push(`${String(h).padStart(2, '0')}:30`);
  }
  horas.push(`${fin}:00`);
  return horas;
};
  const crearCita = async () => {
    if (serviciosSeleccionados.length === 0 || !horaSeleccionada) {
      return Alert.alert('Error', 'Selecciona al menos un servicio y una hora.');
    }
    try {
      const pacienteId = auth.currentUser?.uid;
      if (!pacienteId) return Alert.alert('Error', 'No se pudo identificar al paciente.');

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

      Alert.alert('Cita creada', 'Tu cita ha sido registrada con éxito.');
      setModoCita(false);
      setServiciosSeleccionados([]);
      setTotal(0);
      setHoraSeleccionada('');
    } catch (e) {
      console.error('Error al crear la cita:', e);
      Alert.alert('Error', 'No se pudo crear la cita.');
    }
  };

  const toggleServicio = (servicio) => {
    let actualizados = [...serviciosSeleccionados];
    if (actualizados.includes(servicio)) {
      actualizados = actualizados.filter(s => s !== servicio);
    } else {
      actualizados.push(servicio);
    }
    setServiciosSeleccionados(actualizados);
    const nuevoTotal = actualizados.reduce((sum, serv) => sum + Number(precios[serv] || 0), 0)
    setTotal(nuevoTotal);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.imageContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Image source={datos.fotoURL ? { uri: datos.fotoURL } : require('../../assets/avatar_placeholder.png')} style={styles.fullImage} />
          <View style={styles.overlayInfo}>
            <Text style={styles.name}>Dr. {datos.nombres} {datos.apellidoP}</Text>
            <Text style={styles.specialty}>Internista</Text>
          </View>
        </View>

        {!modoCita ? (
          <>
            {/* contacto y servicios */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Datos de contacto</Text>
              <View style={styles.contactRow}><Ionicons name="call-sharp" size={24} color="#0A3B74" /><Text style={styles.contactText}>{datos.telefono}</Text></View>
              <View style={styles.contactRow}><Ionicons name="mail-outline" size={24} color="#0A3B74" /><Text style={styles.emailText}>{datos.email}</Text></View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Servicios ofertados</Text>
              {servicios.map(serv => (<View key={serv} style={styles.serviceRow}><Text style={styles.serviceText}>{serv.trim()}</Text><Text style={styles.price}>${precios[serv.trim()] || '-'}</Text></View>))}
            </View>
            <TouchableOpacity style={styles.btnCita} onPress={() => setModoCita(true)}><Text style={styles.btnCitaText}>Solicitar cita</Text></TouchableOpacity>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecciona servicios</Text>
            {servicios.map(serv => (
              <TouchableOpacity key={serv} style={[styles.serviceRow, serviciosSeleccionados.includes(serv) && { backgroundColor: '#e0f0ff' }]} onPress={() => toggleServicio(serv)}>
                <Text style={styles.serviceText}>{serv}</Text>
                <Text style={styles.price}>${precios[serv] || '-'}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.sectionTitle}>Selecciona fecha</Text>
           <Calendar
                onDayPress={day => {
                    setFechaSeleccionada(day.dateString);
                    cargarHorasOcupadas(day.dateString);
                }}
                markedDates={{
                    [fechaSeleccionada]: { selected: true, marked: true, selectedColor: '#0A3B74' },
                    ...disabledDates
                }}
                minDate={dayjs().format('YYYY-MM-DD')}
                disableAllTouchEventsForDisabledDays={true}
                />
            <Text style={styles.sectionTitle}>Selecciona hora</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {generarHoras().filter(hora => !horasOcupadas.includes(hora)).map(hora => (
                <TouchableOpacity key={hora} style={{ margin: 5, padding: 10, backgroundColor: horaSeleccionada === hora ? '#0A3B74' : '#e0e0e0', borderRadius: 6 }} onPress={() => setHoraSeleccionada(hora)}>
                  <Text style={{ color: horaSeleccionada === hora ? '#fff' : '#000' }}>{hora}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.price, { marginTop: 10 }]}>Total: ${total}</Text>
            <TouchableOpacity style={styles.btnCita} onPress={crearCita}><Text style={styles.btnCitaText}>Confirmar cita</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  imageContainer: { position: 'relative' },
  fullImage: { width: '100%', height: 300 },
  overlayInfo: { position: 'absolute', bottom: -40, alignSelf: 'center', backgroundColor: '#0A3B74', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 12, elevation: 5, alignItems: 'center' },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  specialty: { color: '#fff', fontSize: 14, marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 70 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#0A3B74', marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  contactText: { marginLeft: 10, fontSize: 16, color: '#333' },
  emailText: { marginLeft: 10, fontSize: 16, color: '#333', textDecorationLine: 'underline' },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: 10, borderRadius: 6 },
  serviceText: { fontSize: 15, color: '#000' },
  price: { fontSize: 14, fontWeight: '500', color: '#0A3B74' },
  btnCita: { margin: 20, backgroundColor: '#0A3B74', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 30 },
  btnCitaText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reviewRow: { flexDirection: 'row', marginBottom: 12 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
  reviewInfo: { marginLeft: 10, flex: 1 },
  reviewName: { fontWeight: 'bold' },
  reviewText: { color: '#444' },
  reviewDate: { fontSize: 12, color: '#888' }
});