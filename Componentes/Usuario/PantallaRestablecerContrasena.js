import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../utileria/firebase';
import {
  collection, query, where,
  getDocs, doc, updateDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword
} from 'firebase/auth';

export default function PantallaRestablecerContrasena({ route, navigation }) {
  const { email } = route.params;
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const manejarRestablecer = async () => {
    if (contrasena !== confirmarContrasena) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(contrasena)) {
      console.error('La contraseña debe tener al menos 8 caracteres y un número ');
      return;
    }

    try {
    // 1) Actualizar Firestore (campo contrasena)
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('email', '==', email));
    const snap = await getDocs(q);
    const userDoc = snap.docs[0];
    const userRef = doc(db, 'usuarios', userDoc.id);
    await updateDoc(userRef, { contrasena });

    // 2) Autenticar con la contraseña temporal
    const auth = getAuth();
    // aquí `temporalPassword` es el valor que tú generaste y guardaste
    await signInWithEmailAndPassword(auth, email, temporalPassword);

    // 3) Cambiar al password definitivo
    const usuario = auth.currentUser;
    await updatePassword(usuario, contrasena);

    console.log('Password Auth y Firestore actualizados');
    navigation.replace('InicioSesion');

  } catch(err) {
    console.error('Error restableciendo:', err);
  }
}
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={24} color="#0A3B74" />
      </TouchableOpacity>
      <Text style={styles.titulo}>Restablecer contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A7A6A5"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#A7A6A5"
        secureTextEntry
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
      />
      <TouchableOpacity style={styles.boton} onPress={manejarRestablecer}>
        <Text style={styles.textoBoton}>Restablecer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  botonVolver: { position: 'absolute', top: 20, left: 20 },
  titulo: { fontSize: 24, fontWeight: '600', color: '#0A3B74', textAlign: 'center', marginBottom: 12 },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    width: '100%'
  },
  boton: {
    backgroundColor: '#0A3B74',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 20
  },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
