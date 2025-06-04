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
  ActivityIndicator
} from 'react-native'
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { app } from '../../utileria/firebase'

const db = getFirestore(app)

// Placeholder local avatar (segunda imagen)
const placeholderAvatar = require('../../assets/avatar_placeholder.png')

export default function MultiListScreen({ navigation, route }) {
  const { type } = route.params // 1=doctores, 2=pacientes, 3=especialidades, 4=servicios
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let q
        console.log('Tipo recibido:', type)
        switch (type) {
          case 1:
            // Doctores -> rol === 2
            q = query(collection(db, 'usuarios'), where('rol', '==', 'Doctor'))
          break
          case 2:
            // Paciente -> rol === 3
            q = query(collection(db, 'usuarios'), where('rol', '==', 'Paciente'))
          break

          default:
            setItems([])
            setLoading(false)
            return
        }
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setItems(list)
      } catch (e) {
        console.error('Error fetching items:', e)
        Alert.alert('Error', 'No se pudieron cargar los elementos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [type])

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
              setItems(prev => prev.filter(item => item.id !== id))
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
          <Text style={styles.link}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
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
            <Text style={styles.link}>Ver más</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>{'<'} Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {type === 1 ? 'Doctores' : ''}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0B2E59" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={type === 1 ? renderDoctor : type === 2 ? renderPaciente : null}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { padding: 12 },
  backText: { color: '#0B2E59', fontSize: 16 },
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
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '500', color: '#333' },
  link: { fontSize: 14, color: '#0B2E59', marginTop: 4 },
  deleteBtn: {
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  },
  deleteText: { color: '#fff', fontSize: 14 }
})
