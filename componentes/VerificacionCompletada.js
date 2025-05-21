import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function VerificacionCompletada({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Verificación completada</Text>
      <Text style={styles.subtitulo}>Ahora puedes restablecer tu contraseña</Text>
      <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('RestablecerContrasena')}>
        <Text style={styles.textoBoton}>Siguiente</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitulo: { fontSize: 16, color: '#646464', marginBottom: 40 },
  boton: { backgroundColor: '#0A3B74', padding: 15, borderRadius: 25, width: '60%', alignItems: 'center' },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
