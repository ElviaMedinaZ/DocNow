import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaEvaluacion({ route, navigation }) {
  const { doctor } = route.params;
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);

  const renderEstrellas = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setCalificacion(index + 1)}>
        <Ionicons
          name={index < calificacion ? 'star' : 'star-outline'}
          size={30}
          color="#007AFF"
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flecha}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Tu opinión importa</Text>

      <View style={styles.cardDoctor}>
        <Image source={doctor.foto} style={styles.avatar} />
        <View>
          <Text style={styles.nombre}>{doctor.nombre}</Text>
          <Text style={styles.tipo}>{doctor.tipo}</Text>
        </View>
      </View>

      <View style={styles.estrellas}>{renderEstrellas()}</View>

      <TextInput
        style={styles.textarea}
        placeholder="Añadir comentario..."
        multiline
        value={comentario}
        onChangeText={setComentario}
      />

      <TouchableOpacity style={styles.botonEnviar}>
        <Text style={styles.textoBoton}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonOmitir} onPress={() => navigation.goBack()}>
        <Text style={styles.textoOmitir}>Omitir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20},
  flecha: { marginBottom: 20, marginTop: 30  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardDoctor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0A3B74',
  },
  tipo: {
    fontSize: 14,
    color: '#777',
  },
  estrellas: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  textarea: {
    height: 100,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height:150,
    textAlignVertical: 'top',
    marginBottom: 20,
    marginTop: '10%',
    backgroundColor: '#F1F1F1',
  },
  botonEnviar: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginTop: '40%',
    width: '80%',
    height: 68,
  },
  textoBoton: {
    fontWeight: 'bold',
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  botonOmitir: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#0A3B74',
    padding: 12,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: '5%',
    width: '80%',
    height: 68,
  },
  textoOmitir: {
    color: '#0A3B74',
    fontWeight: 'bold',
    fontSize: 18,
    fontWeight: '600'
    
  },
});
