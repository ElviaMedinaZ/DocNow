import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../utileria/firebase';
import { signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaPerfil({ navigation }) {
   const insets = useSafeAreaInsets();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [nuevaFoto, setNuevaFoto] = useState(null);

  const IMGBB_API_KEY = '6bf581fff38d47c8c68359dc9945a4a9';

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsuario(data);
        setNuevaFoto(data.fotoUrl || null);
      } else {
        Alert.alert('Error', 'No se encontraron los datos del usuario');
      }
    };

    obtenerDatosUsuario();
  }, []);

  const manejarCerrarSesion = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        onPress: async () => {
          await signOut(auth);
          navigation.replace('InicioSesion');
        },
      },
    ]);
  };

  const subirImagenAImgBB = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'perfil.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        return result.data.url;
      } else {
        throw new Error('No se pudo subir la imagen');
      }
    } catch (error) {
      console.error('Error subiendo imagen a ImgBB:', error);
      return null;
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setNuevaFoto(resultado.assets[0].uri);
    }
  };

  const guardarCambios = async () => {
    if (!nuevaFoto || !nuevaFoto.startsWith('file')) {
      Alert.alert('Nada que actualizar', 'Selecciona una nueva imagen primero.');
      return;
    }

    Alert.alert(
      '¿Confirmar cambio?',
      '¿Estás seguro de que deseas actualizar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, actualizar',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return Alert.alert('Error', 'Usuario no autenticado.');

              const urlSubida = await subirImagenAImgBB(nuevaFoto);
              if (!urlSubida) return Alert.alert('Error', 'No se pudo subir la imagen.');

              await updateDoc(doc(db, 'usuarios', user.uid), {
                fotoUrl: urlSubida,
              });

              Alert.alert('Éxito', 'Foto de perfil actualizada.');
              setNuevaFoto(urlSubida);
              setModoEdicion(false);
            } catch (error) {
              console.error('Error al guardar foto:', error);
              Alert.alert('Error', 'Ocurrió un problema al actualizar la imagen.');
            }
          },
        },
      ]
    );
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
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('PantallaAjustes')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={modoEdicion ? seleccionarImagen : null}>
        <Image
          source={nuevaFoto ? { uri: nuevaFoto } : require('../../assets/avatar_placeholder.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.nombre}>
        {usuario.nombres} {usuario.apellidoP} {usuario.apellidoM}
      </Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={usuario.email}
        editable={false}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={'**************'}
        editable={false}
        secureTextEntry={true}
      />

      <Text style={styles.label}>Número telefónico</Text>
      <TextInput
        style={styles.input}
        value={usuario.telefono}
        editable={false}
      />

      {modoEdicion ? (
        <>
          <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
            <Text style={styles.textoGuardar}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonCancelar} onPress={() => setModoEdicion(false)}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.botonEditar} onPress={() => setModoEdicion(true)}>
            <Text style={styles.textoEditar}>Editar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonCerrar} onPress={manejarCerrarSesion}>
            <Text style={styles.textoCerrar}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      )}

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
    flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff',
  },
  encabezado: {
    width: '100%', paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10, marginTop: 35,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  avatar: { width: 110, height: 110, borderRadius: 55, marginVertical: 15 },
  nombre: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#0A3B74' },
  label: { width: '100%', fontSize: 16, color: "#333", marginBottom: 5 },
  input: {
    width: '100%', backgroundColor: '#f2f2f2',
    padding: 12, borderRadius: 8, marginBottom: 20,
  },
  botonEditar: {
    backgroundColor: '#0A3B74',
    paddingVertical: 15, borderRadius: 12,
    width: '100%', alignItems: 'center', marginBottom: 10,
  },
  textoEditar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  botonCerrar: {
    borderColor: '#8B0000', borderWidth: 1.5,
    paddingVertical: 15, borderRadius: 12,
    width: '100%', alignItems: 'center', backgroundColor: '#F9F9F9',
  },
  textoCerrar: { color: '#8B0000', fontSize: 18, fontWeight: 'bold' },
  botonGuardar: {
    backgroundColor: '#0A3B74',
    paddingVertical: 15, borderRadius: 12,
    width: '100%', alignItems: 'center', marginBottom: 10,
  },
  textoGuardar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  botonCancelar: {
    borderColor: '#0A3B74', borderWidth: 1.5,
    paddingVertical: 15, borderRadius: 12,
    width: '100%', alignItems: 'center', backgroundColor: '#fff',
  },  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  textoCancelar: { color: '#0A3B74', fontSize: 18, fontWeight: 'bold' },
  
});
