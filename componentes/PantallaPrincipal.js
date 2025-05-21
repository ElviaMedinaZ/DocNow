import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../utileria/firebase';

export default function PantallaPrincipal({ route, navigation }) {
  const { nombreUsuario, userId } = route.params;

  const manejarCerrarSesion = async () => {
    await signOut(auth);
    navigation.replace('InicioSesion');
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>¡Bienvenido, {nombreUsuario}!</Text>
      <Text style={styles.subtitulo}>ID: {userId}</Text>
      <Button title="Cerrar Sesión" onPress={manejarCerrarSesion} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, marginBottom: 10 },
  subtitulo: { fontSize: 18, marginBottom: 20, color: '#666' }
});
