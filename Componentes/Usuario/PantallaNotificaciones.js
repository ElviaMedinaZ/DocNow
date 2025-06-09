import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../utileria/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import moment from 'moment';

export default function PantallaCitasHome({ navigation }) {
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState(null);
  const [proximaCita, setProximaCita] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsuario(docSnap.data());
      }

      const fechaHoy = moment().format('YYYY-MM-DD');
      const fechaMax = moment().add(2, 'days').format('YYYY-MM-DD');

      const q = query(collection(db, 'citas'),
        where('pacienteId', '==', userId),
        where('estatus', '==', 'Pendiente')
      );
      
        const snapshot = await getDocs(q);
        let citasProximas = [];

        for (let docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (data.fecha >= fechaHoy && data.fecha <= fechaMax) {
            const doctorRef = doc(db, 'usuarios', data.doctorId);
            const doctorSnap = await getDoc(doctorRef);
            const doctorData = doctorSnap.exists() ? doctorSnap.data() : {};
            
            citasProximas.push({
              id: docSnap.id, // 👈 NECESARIO para updateDoc
              ...data,
              doctorNombre: `Dr. ${doctorData.nombres || ''} ${doctorData.apellidoP || ''}`,
              foto: doctorData.fotoURL || null
            });
          }
        }

        setProximaCita(citasProximas);
    };

    cargarDatos();
  }, []);

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

return (
  <View style={styles.container}>
    {/* ENCABEZADO */}
    <View style={styles.encabezado}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.titulo}>Notificaciones</Text>
      <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>

    {/* CONTENIDO PRINCIPAL */}
    <View style={styles.contenido}>
     {proximaCita && proximaCita.length > 0 ? (
  proximaCita.map((cita, index) => (
    <View key={index} style={styles.contenedorFechas}>
      <TouchableOpacity style={styles.citasItem}    
      onPress={() => navigation.navigate('PantallaConfirmarCita', { cita })} 
      >
        <Image source={require('../../assets/Iconos_Citas/rectangulo.png')} style={styles.imagenRectangulo} />
        <Image
          source={cita.foto ? { uri: cita.foto } : require('../../assets/avatar_placeholder.png')}
          style={styles.avatar}
        />
        <View style={styles.contenedorNombreEstado}>
          <Text style={styles.labelCitas}>{cita.doctorNombre}</Text>
          <Text style={styles.estado}>{cita.estatus}</Text>
        </View>
        <Image source={require('../../assets/Iconos_Citas/linea.png')} style={styles.imagenLinea} />
        <View style={styles.contenedorFechas}>
          <Ionicons name="calendar" size={20} color="#0A3B74" />
          <Text style={styles.labelFecha}>{moment(cita.fecha).format('DD MMM. YYYY')}</Text>
          <Text style={styles.labelHora}>{cita.hora}</Text>
        </View>
      </TouchableOpacity>
    </View>
  ))
) : (
  <View style={styles.sinContenido}>
    <Text style={styles.labelInfo}>Sin citas próximas</Text>
  </View>
)}

    </View>

    {/* BARRA INFERIOR */}
    <View style={[styles.barraInferior, { paddingBottom: insets.bottom || 10 }]}>
      <TouchableOpacity onPress={() => navigation.navigate('MenuPaciente')}>
        <Ionicons name="home" size={24} color="#0A3B74" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PantallaCitas')}>
        <Ionicons name="calendar" size={24} color="#0A3B74" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PantallaNotificaciones')}>
        <Ionicons name="notifications" size={24} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PantallaPerfilUsuario')}>
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
    marginTop: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginTop: 20
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
  contenedorCitas: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  citasItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagenDoctoresCitas: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginLeft: 10,
  },
  labelCitas: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "100",
  },
  imagenRectangulo: {
    width: 10,
    height: 100,
    marginLeft: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
  },
  imagenLinea: {
    width: 1,
    height: 100,
    marginLeft: 8,
  },
  contenedorFechas: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelFecha: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  labelHora: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "100",
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  icono: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  contenedorNombreEstado: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  estado: {
    fontSize: 16,
    color: '#0A3B74',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  contenido: {
  flex: 1,
  paddingHorizontal: 20,
},
});