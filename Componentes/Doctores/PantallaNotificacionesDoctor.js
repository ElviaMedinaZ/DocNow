import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../../utileria/firebase';

export default function PantallaCitasHome({ navigation }) {
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState(null);
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsuario({ id: userId, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'No se encontraron los datos del usuario');
      }
    };

    const cargarDatos = async () => {
      await obtenerDatosUsuario();
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (usuario?.id) {
      obtenerCitasDelDoctor(usuario.id);
    }
  }, [usuario]);

  const obtenerCitasDelDoctor = async (doctorId) => {
    try {
      const citasRef = collection(db, 'citas');
      const q = query(citasRef, where('doctorId', '==', doctorId));
      const querySnapshot = await getDocs(q);

      const citasFiltradas = querySnapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .filter(cita => ['Confirmada', 'Cancelada', 'Pendiente'].includes(cita.estado));

      const citasObtenidas = await Promise.all(
        citasFiltradas.map(async (cita) => {
          let nombrePaciente = 'Paciente desconocido';
          let fotoPaciente = null;

          if (cita.pacienteId) {
            try {
              const pacienteDoc = await getDoc(doc(db, 'usuarios', cita.pacienteId));
              if (pacienteDoc.exists()) {
                const pacienteData = pacienteDoc.data();
                nombrePaciente = `${pacienteData.nombres || ''} ${pacienteData.apellidoP || ''}`;
                fotoPaciente = pacienteData.fotoUrl || null;
              }
            } catch (e) {
              console.warn('Error cargando paciente:', e);
            }
          }

          return {
            ...cita,
            nombrePaciente,
            fotoPaciente,
            estado: cita.estado || 'Pendiente',
          };
        })
      );

      setCitas(citasObtenidas);
    } catch (error) {
      console.error('Error obteniendo citas:', error);
      Alert.alert('Error', 'No se pudieron obtener las citas');
    }
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Notificaciones</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollCitas}>
        {citas.length > 0 ? (
          citas.map((cita, index) => (
            <View key={cita.id || index} style={styles.citasItem}>
              <Image
                source={require('../../assets/Iconos_Citas/rectangulo.png')}
                style={styles.imagenRectangulo}
              />
              <Image
                source={cita.fotoPaciente ? { uri: cita.fotoPaciente } : require('../../assets/avatar_placeholder.png')}
                style={styles.avatar}
              />
              <View style={styles.contenedorNombreEstado}>
                <Text style={styles.labelCitas}>{cita.nombrePaciente || 'Nombre paciente'}</Text>
                <Text style={styles.estado}>{cita.estado}</Text>
              </View>

              <View style={styles.contenedorFechas}>
                <Ionicons name="calendar" size={20} color="#0A3B74" style={styles.icono} />
                <Text style={styles.labelFecha}>{cita.fecha}</Text>
                <Text style={styles.labelHora}>{cita.hora}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.sinContenido}>
            <Text style={styles.labelInfo}>Sin citas previas</Text>
          </View>
        )}
      </ScrollView>

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
  container: { flex: 1, backgroundColor: '#fff' },
  encabezado: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, marginTop: 20,
  },
  titulo: {
    fontSize: 20, fontWeight: 'bold', color: '#0A3B74', marginTop: 20
  },
  scrollCitas: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 80
  },
  sinContenido: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  labelInfo: {
    fontSize: 18, color: 'gray', fontWeight: '500'
  },
  citasItem: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingHorizontal: 10
  },
  imagenRectangulo: { width: 10, height: 100, marginLeft: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginLeft: 10 },
  contenedorNombreEstado: { flexDirection: 'column', marginLeft: 10 },
  labelCitas: { color: '#757575', fontSize: 16 },
  estado: { fontSize: 16, color: '#0A3B74' },
  imagenLinea: { width: 1, height: 100, marginLeft: 8 },
  contenedorFechas: { alignItems: 'center', marginLeft: 10 },
  labelFecha: { color: '#000', fontSize: 16, fontWeight: '500' },
  labelHora: { color: '#000', fontSize: 16 },
  icono: { marginBottom: 5 },
  barraInferior: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});
