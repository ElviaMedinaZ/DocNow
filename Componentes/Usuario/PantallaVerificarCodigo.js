import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // asegúrate de tener instalado react-native-vector-icons

export default function PantallaVerificarCodigo({ route, navigation }) {
  const { email } = route.params;  // Obtener el correo del parámetro
  const [codigo, setCodigo] = useState('');

  const manejarVerificar = async () => {
    if (!codigo.trim()) {
      return Alert.alert('Error', 'Ingresa el código de verificación');
    }

    try {
      const response = await fetch('http://localhost:3000/verificarCodigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigoIngresado: codigo }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Verificación exitosa', 'El código es correcto');
        navigation.replace('RestablecerContrasena', { email });  // Navegar a la pantalla de restablecimiento
      } else {
        throw new Error(result.error || 'Código incorrecto');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <View style={styles.lockCircle}>
          <Icon name="lock" size={40} color="#0A3B74" />
        </View>
      </View>

      <Text style={styles.titulo}>Ingresa el código recibido</Text>
      <TextInput
        style={styles.input}
        placeholder="Código de verificación"
        keyboardType="numeric"
        value={codigo}
        onChangeText={setCodigo}
      />
      <TouchableOpacity style={styles.boton} onPress={manejarVerificar}>
        <Text style={styles.textoBoton}>Verificar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    iconContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  lockCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EAF0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  titulo: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  input: { backgroundColor:'#F5F5F5', borderRadius:8, padding:12, fontSize:16, marginBottom:20, width:'80%' },
  boton: { backgroundColor:'#0A3B74', borderRadius:25, paddingVertical:14, alignItems:'center', width:'60%' },
  textoBoton: { color:'#fff', fontSize:16, fontWeight:'600' }
});
