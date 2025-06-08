import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, Entypo, FontAwesome } from '@expo/vector-icons';

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
      />
    </View>
  );

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
        icon={<Ionicons name="notifications" size={24} color="#0A3B74" />}
        texto="Notificaciones"
        valor={notificaciones}
        setValor={setNotificaciones}
      />
      <Opcion
        icon={<MaterialIcons name="vibration" size={24} color="#0A3B74" />}
        texto="Vibración"
        valor={vibracion}
        setValor={setVibracion}
      />
      <Opcion
        icon={<Entypo name="mail" size={24} color="#0A3B74" />}
        texto="Correo"
        valor={correo}
        setValor={setCorreo}
      />
      <Opcion
        icon={<FontAwesome name="volume-up" size={24} color="#0A3B74" />}
        texto="Vibración y sonido"
        valor={vibraSonido}
        setValor={setVibraSonido}
      />
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
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3B74',
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