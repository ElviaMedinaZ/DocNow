import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../utileria/firebase';

const auth = getAuth(app);
const db = getFirestore(app);

export default function PantallaPerfilDoctor({ navigation }) {
  const insets = useSafeAreaInsets();
  const [datos, setDatos] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicios, setServicios] = useState({});
  const [precios, setPrecios] = useState({});
  const [turnoDia, setTurnoDia] = useState('');
  const [turnoHora, setTurnoHora] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const user = auth.currentUser;
        const ref = doc(db, 'usuarios', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setDatos(data);

          const serviciosArray = data.Servicios?.split(',') || [];
          const serviciosObj = {};
          serviciosArray.forEach(serv => {
            serviciosObj[serv.trim()] = true;
          });
          setServicios(serviciosObj);
          setTurnoDia(data.turnoDia || '');
          setTurnoHora(data.turnoHora || '');
        }
      } catch (e) {
        console.error('Error obteniendo datos del doctor:', e);
        Alert.alert('Error', 'No se pudieron cargar los datos');
      }
    };

    const cargarPreciosServicios = async () => {
      try {
        const serviciosRef = collection(db, 'Servicios');
        const snapshot = await getDocs(serviciosRef);
        const preciosTemp = {};

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data.Servicio && data.Precio) {
            preciosTemp[data.Servicio] = data.Precio;
          }
        });

        setPrecios(preciosTemp);
      } catch (error) {
        console.error('Error obteniendo precios:', error);
      }
    };

    cargarDatos();
    cargarPreciosServicios();
  }, []);

  const toggleServicio = (servicio) => {
    setServicios(prev => ({ ...prev, [servicio]: !prev[servicio] }));
  };

  const guardarCambios = async () => {
    const nuevosServiciosArray = Object.keys(servicios).filter(s => servicios[s]);
    if (nuevosServiciosArray.length === 0) {
      return Alert.alert('Error', 'Debes seleccionar al menos un servicio.');
    }
    try {
      const nuevosServicios = nuevosServiciosArray.join(',');
      const user = auth.currentUser;
      const ref = doc(db, 'usuarios', user.uid);
      await updateDoc(ref, {
        Servicios: nuevosServicios,
        turnoDia,
        turnoHora,
      });
      setModoEdicion(false);
      Alert.alert('Actualizado', 'Los datos fueron actualizados correctamente.');
    } catch (e) {
      console.error('Error al guardar:', e);
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    }
  };

  if (!datos) return null;

  const todosLosServicios = Object.keys(precios);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Ajustes')}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.imageContainer}>
          <Image
            source={datos.fotoURL ? { uri: datos.fotoURL } : require('../../assets/avatar_placeholder.png')}
            style={styles.fullImage}
          />
          <View style={styles.overlayInfo}>
            <Text style={styles.name}>Dr. {datos.nombres} {datos.apellidoP}</Text>
            <Text style={styles.specialty}>Internista</Text>
          </View>
          <TouchableOpacity style={styles.editIcon} onPress={() => setModoEdicion(true)}>
            <Ionicons name="create-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de contacto</Text>
          <Text style={styles.detail}>📞 {datos.telefono}</Text>
          <Text style={styles.detail}>📧 {datos.email}</Text>
          <Text style={styles.detail}>🏠 Consultorio {datos.consultorio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios ofrecidos <Text style={{ fontWeight: 'normal' }}>(Costo)</Text></Text>
          {modoEdicion ? (
            todosLosServicios.map((serv) => (
              <View key={serv} style={styles.serviceRow}>
                <Text>{serv}</Text>
                <Switch
                  value={servicios[serv] || false}
                  onValueChange={() => toggleServicio(serv)}
                />
                <Text>${precios[serv] || '-'}</Text>
              </View>
            ))
          ) : (
            Object.keys(servicios).filter(s => servicios[s] && precios[s]).map((s) => (
              <View key={s} style={styles.serviceRow}>
                <Text style={styles.bullet}>• {s}</Text>
                <Text style={styles.price}>${precios[s]}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidad</Text>
          {modoEdicion ? (
            <View>
              <Text style={{ marginBottom: 4, color: '#666' }}>Días disponibles</Text>
              <TouchableOpacity onPress={() => setTurnoDia('lunes a viernes')}><Text style={[styles.turnoBtn, turnoDia === 'lunes a viernes' && styles.selectedTurno]}>Lunes a viernes</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setTurnoDia('sábado y domingo')}><Text style={[styles.turnoBtn, turnoDia === 'sábado y domingo' && styles.selectedTurno]}>Sábado y domingo</Text></TouchableOpacity>

              <Text style={{ marginTop: 12, marginBottom: 4, color: '#666' }}>Horario</Text>
              <TouchableOpacity onPress={() => setTurnoHora('matutino')}><Text style={[styles.turnoBtn, turnoHora === 'matutino' && styles.selectedTurno]}>Matutino</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setTurnoHora('vespertino')}><Text style={[styles.turnoBtn, turnoHora === 'vespertino' && styles.selectedTurno]}>Vespertino</Text></TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.detail}>{datos.turnoDia || 'Sin días definidos'}</Text>
              <Text style={styles.detail}>{datos.turnoHora || 'Sin horario definido'}</Text>
            </>
          )}
        </View>

        {modoEdicion && (
          <TouchableOpacity style={styles.saveBtn} onPress={guardarCambios}>
            <Text style={styles.saveText}>Guardar cambios</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
        <Ionicons name="people" size={24} color="gray" />
        <Ionicons name="calendar" size={24} color="gray" />
        <Ionicons name="notifications" size={24} color="gray" />
        <Ionicons name="person" size={24} color="#007AFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: 220,
  },
  overlayInfo: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
    backgroundColor: '#0A3B74',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    padding: 8,
    elevation: 5,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialty: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A3B74',
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0A3B74',
  },
  turnoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#EEE',
    borderRadius: 8,
  },
  selectedTurno: {
    backgroundColor: '#0A3B74',
    color: '#fff',
  },
  saveBtn: {
    margin: 20,
    backgroundColor: '#0A3B74',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
