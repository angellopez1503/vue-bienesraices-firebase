import { computed, ref } from 'vue'
import { collection, doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'

const usePropiedades = () => {
  const db = useFirestore()
  const loading = ref(false)
  const filtro = ref(1)
  const storage = useFirebaseStorage()

  loading.value = true
  const propiedadesCollection = useCollection(collection(db, 'propiedades'))
  setTimeout(() => {
    loading.value = false
  }, 400)

  const isLoading = computed(() => loading.value)
  
  const propiedadesFiltradas = computed(() => {
    if (filtro.value === 1) {
      return propiedadesCollection.value
    } else if (filtro.value === 2) {
      return propiedadesCollection.value.filter((propiedad) => propiedad.alberca)
    } else if (filtro.value === 3) {
      return propiedadesCollection.value.filter((propiedad) => !propiedad.alberca)
    }
  })

  const deleteItem = async (id, urlImage) => {
    if (confirm('Deseas eliminar esta propiedad ?')) {
      const docRef = doc(db, 'propiedades', id)
      const imageRef = storageRef(storage, urlImage)
      await Promise.all([deleteDoc(docRef), deleteObject(imageRef)])
    }
  }

  return {
    propiedadesCollection,
    propiedadesFiltradas,
    isLoading,
    filtro,
    deleteItem
  }
}

export default usePropiedades
