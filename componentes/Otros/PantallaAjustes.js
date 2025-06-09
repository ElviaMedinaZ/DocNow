import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { Alert } from 'react-native'; 
// import { signOut } from 'firebase/auth';
// import { auth } from '../../utileria/firebase';

export default function SettingsScreen({ navigation }) {
  const [notificaciones, setNotificaciones] = useState(true);
  const [vibracion, setVibracion] = useState(false);
  const [correo, setCorreo] = useState(true);
  const [vibraSonido, setVibraSonido] = useState(false);

  const Opcion = ({ icon, texto, valor, setValor }) => (
    <View style={styles.opcion}>
      <View style={styles.opcionInfo}>
        {icon}
        <Text style={styles.opcionTexto}>{texto}</Text>
      </View>
      <Switch
        value={valor}
        onValueChange={setValor}
        trackColor={{ false: '#ccc', true: '#0A3B74' }}
        thumbColor={valor ? '#0A3B74' : '#fff'}
         style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
      />
    </View>
  );

  const manejarCerrarSesion = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: async () => {
            await signOut(auth);
            navigation.navigation('InicioSesion');
          } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Ajustes</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Opciones */}
      <Opcion
        icon={<Ionicons name="notifications" size={50} color="#0A3B74" />}
        texto="Notificaciones"
        valor={notificaciones}
        setValor={setNotificaciones}
      />
      <Opcion
        icon={<MaterialIcons name="vibration" size={50} color="#0A3B74" />}
        texto="Vibración"
        valor={vibracion}
        setValor={setVibracion}
      />
      <Opcion
        icon={<Entypo name="mail" size={50} color="#0A3B74" />}
        texto="Correo"
        valor={correo}
        setValor={setCorreo}
      />
      <Opcion
        icon={<FontAwesome name="volume-up" size={50} color="#0A3B74" />}
        texto="Vibración y sonido"
        valor={vibraSonido}
        setValor={setVibraSonido}
      />
      <View style={styles.itemCerrarSesion}>
        <TouchableOpacity onPress={manejarCerrarSesion}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../assets/Iconos_Ajustes/Cerrar_Sesion.png')}
              style={styles.cerrar}
            />
            <Text style={styles.textoCerrar}>Cerrar sesión</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3B74',
  },
  cerrar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textoCerrar: {
    fontSize: 18,
    color: '#0A3B74',
    fontWeight: 'bold',
  },
  itemCerrarSesion: {
    marginTop: 10,
    paddingVertical: 10,
  },
  opcion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  opcionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcionTexto: {
    fontSize: 16,
    marginLeft: 10,
  },
});