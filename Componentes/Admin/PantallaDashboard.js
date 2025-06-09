{/* Creacion de la pantalla dashboard
  Programador: Elvia Medina
  Fecha: 09 de junio del 2025 */}

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const PantallaDashboard = () => {
  const citasMensuales = {
    labels: ['Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab', 'Dom'],
    datasets: [{ data: [30, 45, 28, 80, 99, 43, 55] }],
  };

  const citasSemanales = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{ data: [30, 45, 28, 80, 99, 43] }],
  };

  const serviciosSolicitados = [
    { name: 'Consulta', population: 35, color: '#f39c12' },
    { name: 'Rayos X', population: 25, color: '#2ecc71' },
    { name: 'Ultrasonidos', population: 20, color: '#e74c3c' },
    { name: 'Inyecciones', population: 20, color: '#3498db' },
  ];

  const medicosPopulares = {
    labels: ['Dr. Pérez', 'Dra. Gómez', 'Dr. Luna', 'Dra. Díaz'],
    datasets: [{ data: [50, 40, 70, 30] }],
  };

  const generarPDF = async () => {
    const htmlContent = `
      <h1>Dashboard de Citas y Servicios</h1>

      <h2>Citas Mensuales</h2>
      <ul>
        ${citasMensuales.labels.map(
          (label, i) => `<li><b>${label}:</b> ${citasMensuales.datasets[0].data[i]}</li>`
        ).join('')}
      </ul>

      <h2>Citas Semanales</h2>
      <ul>
        ${citasSemanales.labels.map(
          (label, i) => `<li><b>${label}:</b> ${citasSemanales.datasets[0].data[i]}</li>`
        ).join('')}
      </ul>

      <h2>Servicios Destacados</h2>
      <ul>
        ${serviciosSolicitados.map(
          servicio => `<li><b>${servicio.name}:</b> ${servicio.population}</li>`
        ).join('')}
      </ul>

      <h2>Médicos Populares</h2>
      <ul>
        ${medicosPopulares.labels.map(
          (label, i) => `<li><b>${label}:</b> ${medicosPopulares.datasets[0].data[i]}</li>`
        ).join('')}
      </ul>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('PDF generado', `Ruta del archivo: ${uri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Citas Mensuales</Text>
      <BarChart
        data={citasMensuales}
        width={screenWidth - 40}
        height={220}
        chartConfig={styles.chartConfigAzul}
        verticalLabelRotation={30}
        style={styles.chart}
      />

      <Text style={styles.titulo}>Citas Semanales</Text>
      <BarChart
        data={citasSemanales}
        width={screenWidth - 40}
        height={220}
        chartConfig={styles.chartConfigAzul}
        verticalLabelRotation={30}
        style={styles.chart}
      />

      <Text style={styles.tituloConMargen}>Servicios destacados</Text>
      <PieChart
        data={serviciosSolicitados}
        width={screenWidth - 40}
        height={220}
        chartConfig={styles.chartConfigNegro}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={styles.chart}
      />

      <Text style={styles.tituloConMargen}>Médicos destacados</Text>
      <BarChart
        data={medicosPopulares}
        width={screenWidth - 40}
        height={220}
        chartConfig={styles.chartConfigRojo}
        verticalLabelRotation={30}
        style={styles.chart}
      />

      <TouchableOpacity onPress={generarPDF} style={styles.boton}>
        <Text style={styles.textoBoton}>Descargar PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tituloConMargen: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  chart: {
    marginBottom: 10,
  },
  chartConfigAzul: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: () => '#333',
    barPercentage: 0.7,
  },
  chartConfigRojo: {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
    labelColor: () => '#333',
    barPercentage: 0.6,
  },
  chartConfigNegro: {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  },
  boton: {
    alignSelf: 'center',
    backgroundColor: '#0A3B74',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginTop: 40,
    marginBottom: 40,
    width: 200,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PantallaDashboard;




