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
      <View style={styles.header}>
        <Text style={styles.titulo}>Comencemos</Text>
        <Text style={styles.subtitulo}>
          Por favor elige una opción para continuar
        </Text>
      </View>

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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#0B2E59',
    borderRadius: 8,
    width: CARD_WIDTH,
    paddingVertical: 14,
    marginBottom: 30
  },
  botonDisabled: {
    backgroundColor: '#A0A0A0'
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
})