import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../utileria/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

export default function PantallaPacientesDoctor({ navigation }) {
  const insets = useSafeAreaInsets();
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const citasQuery = query(
          collection(db, 'citas'),
          where('estado', '==', 'Finalizada')
        );
        const snapshot = await getDocs(citasQuery);

        const pacientesMap = new Map();

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const pacienteId = data.pacienteId;

          if (pacienteId && !pacientesMap.has(pacienteId)) {
            const pacienteDoc = await getDoc(doc(db, 'usuarios', pacienteId));
            if (pacienteDoc.exists()) {
              const pacienteData = pacienteDoc.data();
              pacientesMap.set(pacienteId, {
                id: pacienteId,
                nombre: `${pacienteData.nombres || ''} ${pacienteData.apellidoP || ''}`.trim(),
                tipo: data.tipo || 'Consulta',
                foto: pacienteData.fotoUrl || null,
              });
            }
          }
        }

        setPacientes(Array.from(pacientesMap.values()));
      } catch (error) {
        console.error('Error cargando pacientes:', error);
      }
    };

    cargarPacientes();
  }, []);

  const renderPaciente = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.foto ? { uri: item.foto } : require('../../assets/avatar_placeholder.png')}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>
      </View>
      <TouchableOpacity
        style={styles.btnNotas}
        onPress={() => navigation.navigate('PantallaNotas')}
      >
        <Text style={styles.btnTexto}>Ver nota</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pacientes}
        renderItem={renderPaciente}
        keyExtractor={(item) => item.id}
      />

      <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('PacienteDoctor')}>
          <Ionicons name="people" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PantallaHomeDoctor')}>
          <Ionicons name="calendar" size={24} color="#0A3B74" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('NotificacionesDoctores')}>
          <Ionicons name="notifications" size={24} color="#0A3B74" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PerfilDoctor')}>
          <Ionicons name="person" size={24} color="#0A3B74" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B2E59',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipo: {
    fontSize: 12,
    color: 'gray',
  },
  btnNotas: {
    backgroundColor: '#7993B1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
    borderBlockColor: '#0A3B74',
    borderWidth: 1,
  },
  btnTexto: {
    color: '#fff',
    fontSize: 12,
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
