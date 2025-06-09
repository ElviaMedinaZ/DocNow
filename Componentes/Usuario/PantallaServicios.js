import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utileria/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaServicios({ route, navigation }) {
  const { servicioSeleccionado } = route.params;
  const [doctoresFiltrados, setDoctoresFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultadoVisible, setResultadoVisible] = useState([]);

  useEffect(() => {
    const obtenerDoctores = async () => {
      const snapshot = await getDocs(collection(db, 'usuarios'));
      const doctores = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc =>
          doc.rol === 'Doctor' &&
          typeof doc.Servicios === 'string' &&
          doc.Servicios.split(',').map(s => s.trim()).includes(servicioSeleccionado)
        );
      setDoctoresFiltrados(doctores);
      setResultadoVisible(doctores);
    };

    obtenerDoctores();
  }, [servicioSeleccionado]);

  const filtrarDoctores = (texto) => {
    setBusqueda(texto);
    const filtrados = doctoresFiltrados.filter(doc =>
      `${doc.nombres} ${doc.apellido}`.toLowerCase().includes(texto.toLowerCase())
    );
    setResultadoVisible(filtrados);
  };

  const renderDoctor = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
            item.fotoURL
            ? { uri: item.fotoURL }
            : require('../../assets/avatar_placeholder.png')
        }
        style={styles.avatar}
        />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombres} {item.apellido}</Text>
        <Text style={styles.citaTexto}>{servicioSeleccionado}</Text>
      </View>
      <TouchableOpacity
        style={styles.botonVer}
        onPress={() => navigation.navigate('PantallaVerDoctor',{ doctorId: item.id })}
      >
        <Text style={styles.botonTexto}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Doctores</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.contenedorBusqueda}>
        <TextInput
          style={styles.input}
          placeholder="Buscar"
          placeholderTextColor="#0A3B74"
          value={busqueda}
          onChangeText={filtrarDoctores}
        />
        <Ionicons name="search" size={20} color="#0A3B74" />
      </View>

      {/* Lista de doctores */}
      {resultadoVisible.length === 0 ? (
        <Text style={styles.sinResultados}>Sin doctores disponibles</Text>
      ) : (
        <FlatList
          data={resultadoVisible}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#0A3B74',
  },
  contenedorBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A3B74',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 40,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#0A3B74',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  citaTexto: {
    fontSize: 13,
    color: 'gray',
  },
  botonVer: {
    backgroundColor: '#0A3B74',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sinResultados: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 16,
  },
});
