import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native'

export default function HomeScreem ({ navigation, route }) {
  const { userId, nombreUsuario } = route.params

  const botones = [
    {
      key: 'registrar',
      label: 'Registrar usuario',
      image: require('../../assets/Iconos_Admin/registro.png'),
      screen: 'RegistroAdmin'
    },
    {
      key: 'pacientes',
      label: 'Pacientes',
      image: require('../../assets/Iconos_Admin/paciente.png'),
      screen: 'MultiList',   // apuntas a MultiListScreen
      type: 2
    },
    {
      key: 'medicos',
      label: 'Médicos',
      image: require('../../assets/Iconos_Admin/medico.png'),
      screen: 'MultiList',   // apuntas a MultiListScreen
      type: 1
    },
    {
      key: 'reportes',
      label: 'Reportes',
      image: require('../../assets/Iconos_Admin/reporte.png'),
      screen: 'MenuReportes'
    },
    {
      key: 'respaldo',
      label: 'Respaldo',
      image: require('../../assets/Iconos_Admin/respaldo.png'),
      screen: 'MenuRespaldo'
    },
    {
      key: 'servicios',
      label: 'Servicios',
      image: require('../../assets/Iconos_Admin/servicio.png'),
      screen: 'MultiList',   // apuntas a MultiListScreen
      type: 4
    },
    {
      key: 'especialidades',
      label: 'Especialidades',
      image: require('../../assets/Iconos_Admin/especialidades.png'),
      sscreen: 'MultiList',  
      type: 3
    }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>¡Bienvenido, {nombreUsuario}!</Text>
      <View style={styles.grid}>
        {botones.map(b => (
          <TouchableOpacity
            key={b.key}
            style={styles.boton}
            activeOpacity={0.7}
                      onPress={() => {
              // si lleva type => vamos a MultiList con ese type
              if (b.type) {
                navigation.navigate(b.screen, {
                  type: b.type,
                  userId,
                  nombreUsuario
                })
              } else {
                // rutas individuales
                navigation.navigate(b.screen, {
                  userId,
                  nombreUsuario
                })
              }
            }}
          >
            <View style={styles.iconoContainer}>
              <Image source={b.image} style={styles.icono} />
            </View>
            <Text style={styles.label}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B2E59',
    alignSelf: 'center',
    marginBottom: 24
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  boton: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#0B2E59',
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconoContainer: {
    marginBottom: 8,
    width: 48,
    height: 48
  },
  icono: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  label: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center'
  }
})
