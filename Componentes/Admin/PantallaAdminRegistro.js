{/* Creacion de la pantalla registrar usuario
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}
import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const opciones = [
  {
    key: 'paciente',
    label: 'Paciente',
    sublabel: 'Registrar paciente',
    image: require('../../assets/Iconos_Admin/paciente.png')
  },
  {
    key: 'doctor',
    label: 'Doctor',
    sublabel: 'Registrar doctor',
    image: require('../../assets/Iconos_Admin/medico.png')
  }
]

export default function PantallaAdminRegistro({ navigation }) {
  const [seleccion, setSeleccion] = useState(null)

  const onSiguiente = () => {
    if (!seleccion) return
    navigation.navigate(
      seleccion === 'paciente' ? 'Registro' : 'RegistroDoctor'
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.titulo}>Comencemos</Text>
      <Text style={styles.subtitulo}>
        Por favor elige una opción para continuar
      </Text>

      <View style={styles.lista}>
        {opciones.map(o => {
          const activo = seleccion === o.key
          return (
            <TouchableOpacity
              key={o.key}
              style={[styles.opcion, activo && styles.opcionActiva]}
              activeOpacity={0.8}
              onPress={() => setSeleccion(o.key)}
            >
              <View
                style={[
                  styles.iconoCaja,
                  activo && styles.iconoCajaActivo
                ]}
              >
                <Image source={o.image} style={styles.icono} />
              </View>
              <View style={styles.textos}>
                <Text
                  style={[styles.label, activo && styles.labelActivo]}
                >
                  {o.label}
                </Text>
                <Text style={styles.sublabel}>{o.sublabel}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      <TouchableOpacity
        style={[styles.boton, !seleccion && styles.botonDisabled]}
        activeOpacity={seleccion ? 0.7 : 1}
        onPress={onSiguiente}
        disabled={!seleccion}
      >
        <Text style={styles.botonTexto}>Siguiente</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.9

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 40
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20
  },
    logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    // Si quieres desplazar solo el logo:
    marginTop: 32,    // antes 16, ahora 32 o más
    marginBottom: 32,
    marginLeft: 10
  },
rowHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // cambia a esto
  marginBottom: 20,
  width: '100%',
  paddingHorizontal: 20
},

  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B2E59',
    marginBottom: 8
  },
  subtitulo: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center'
  },
  lista: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center'
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    width: CARD_WIDTH,
    padding: 16,
    marginVertical: 8
  },
  opcionActiva: {
    backgroundColor: '#DDE6F0'
  },
  iconoCaja: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  iconoCajaActivo: {
    backgroundColor: '#0A3B74',
    borderWidth: 1,
    borderColor: '#0B2E59'
  },
  icono: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  textos: {
    flex: 1
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 4
  },
  labelActivo: {
    color: '#0B2E59'
  },
  sublabel: {
    fontSize: 13,
    color: '#6B6B6B'
  },
  boton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginTop: '20%',
    width: 200,
    height: 68,
    marginBottom: '20%'
  },
  botonDisabled: {
    backgroundColor: '#A0A0A0',
    marginBottom: '20%'
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }
})