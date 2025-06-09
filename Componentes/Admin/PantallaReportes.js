{/* Creacion de la pantalla reportes
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaReportes({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Reportes</Text>
        <View style={{ width: 24 }} /> {/* Espacio simétrico al ícono */}
      </View>

      {/* Contenido aquí */}
      {/* <Text style={styles.textoContenido}>Aquí irán tus reportes...</Text> */}
      {/*Diseño de la seccion de reporte
      Programadora: Irais Reyes
      Fecha: 07 de junio del 2025 */}
      <View style={styles.contenedorRespaldo}>
        <View style={styles.respaldoItem}>
        <Image
          source={require('../../assets/Iconos_Admin/Iconos_Reporte/reporte.png')}
          style={styles.imagenBaseDatos}
        />
        <View style={styles.infoContainer}>
          <View style={styles.infoFila}>
            <Text style={styles.labelFecha}>09 de mayo de 2020</Text>
            <TouchableOpacity style={styles.btnVer} onPress={() => alert('Generando reporte...')}>
              <Text style={styles.verText}>Ver</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.labelHora}>02:30 am</Text>
        </View>
      </View>

      </View>
      <TouchableOpacity style={styles.boton}>
        <Text style={styles.textoBoton}>Reporte</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A3B74',
    marginTop: 20
  },
  textoContenido: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
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
    marginTop: '90%',
    width: 200,
    height: 68,
  },
  textoBoton: {
    textAlign: 'center', 
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  contenedorRespaldo: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBlock: '15%',
  },
  respaldoItem: {
    flexDirection: 'row',
  },
  imagenBaseDatos: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  labelCitas: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "100",
  },
  labelFecha: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
  labelHora: {
    fontSize: 16,
    fontWeight: "100",
    color: '#0A3B74',
  },
  icono: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  btnVer: {
    backgroundColor: '#0A3B74',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  verText: { 
    color: '#fff', 
    fontSize: 14 
  },
  infoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
});