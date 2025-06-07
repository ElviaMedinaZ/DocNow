{/* Creacion de la pantalla multilista
  Programador: Kristofer Hernandez
  Fecha: 03 de junio del 2025 */}
import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native'
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { app } from '../../utileria/firebase'
import { Ionicons } from '@expo/vector-icons';

const db = getFirestore(app)

const placeholderAvatar = require('../../assets/avatar_placeholder.png')

export default function MultiListScreen({ navigation, route }) {
  const { type } = route.params // 1=doctores, 2=pacientes
  const [items, setItems] = useState([])
  const [itemsFiltrados, setItemsFiltrados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let q
        switch (type) {
          case 1:
            q = query(collection(db, 'usuarios'), where('rol', '==', 'Doctor'))
            break
          case 2:
            q = query(collection(db, 'usuarios'), where('rol', '==', 'Paciente'))
            break
          default:
            setItems([])
            setItemsFiltrados([])
            setLoading(false)
            return
        }
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setItems(list)
        setItemsFiltrados(list)
      } catch (e) {
        console.error('Error fetching items:', e)
        Alert.alert('Error', 'No se pudieron cargar los elementos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [type])

  const filtrarPorNombre = (texto) => {
    setBusqueda(texto)
    if (texto.trim().length < 3) {
      setItemsFiltrados(items)
      return
    }
    const textoMin = texto.toLowerCase()
    const filtrados = items.filter(item =>
      item.nombres.toLowerCase().startsWith(textoMin)
    )
    setItemsFiltrados(filtrados)
  }

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar este registro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'usuarios', id))
              const actualizados = items.filter(item => item.id !== id)
              setItems(actualizados)
              setItemsFiltrados(actualizados)
            } catch (e) {
              console.error('Error deleting:', e)
              Alert.alert('Error', 'No se pudo eliminar')
            }
          }
        }
      ]
    )
  }

 const renderPaciente = ({ item }) => {
  const fullName = `${item.nombres} ${item.apellidoP}`
  return (

    <View style={styles.card}>
      <Image
        source={item.fotoURL ? { uri: item.fotoURL } : placeholderAvatar}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Ver citas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditarRegistro', { id: item.id })}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

  const renderDoctor = ({ item }) => {
  const prefix = item.sexo === 'F' ? 'Dra.' : 'Dr.'
  const fullName = `${prefix} ${item.nombres} ${item.apellidoP}`
  return (
    <View style={styles.card}>
      <Image
        source={item.fotoURL ? { uri: item.fotoURL } : placeholderAvatar}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Ver citas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditarDoctor', { id: item.id })}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>
        {type === 1 ? 'Doctores' : type === 2 ? 'Pacientes' : ''}
      </Text>

      {/* Rediseño del buscador
      Programadora: Irais Reyes
      Fecha: 07 de junio del 2025 */}
      <View style={styles.contenedorBuscador}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar"
          placeholderTextColor="#0A3B74"
          value={busqueda}
          onChangeText={filtrarPorNombre}
        />
        <Ionicons name="search" size={20} color="#0A3B74" style={styles.iconoBuscar} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0B2E59" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={itemsFiltrados}
          keyExtractor={item => item.id}
          renderItem={type === 1 ? renderDoctor : type === 2 ? renderPaciente : null}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  backBtn: { 
    padding: 12, 
    marginTop: 30
  },
  contenedorBuscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#0A3B74',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 9,
  },
  iconoBuscar: {
    marginRight: 8,
  },
  buscador: {
    flex: 1,
    height: 40,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4
  },
  editText: {
    color: '#fff',
    fontSize: 14
  },
  backText: { color: '#0B2E59', 
    fontSize: 16 
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0B2E59',
    alignSelf: 'center',
    marginVertical: 12
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDD'
  },
  info: { 
    flex: 1, 
    marginLeft: 12 
  },
  name: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#333' 
  },
  link: { 
    fontSize: 14, 
    color: '#0B2E59', 
    marginTop: 4 
  },
  deleteBtn: {
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteText: { 
    color: '#fff', 
    fontSize: 14 
  },
  editBtn: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  }
})
