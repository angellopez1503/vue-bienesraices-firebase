import { computed, ref } from 'vue'
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile } from 'vuefire'
import { uid } from 'uid'

const useImage = () => {
  const storage = useFirebaseStorage()
  const storageRefPath = storageRef(storage, `/propiedades/${uid()}.jpg`)

  const { url, upload } = useStorageFile(storageRefPath)
  const loading = ref(false)
  const flag= ref(false)

  const uploadImage = async (e) => {
    try {
      flag.value = true
      loading.value = true
      const data = e.target.files[0]
      
      if (data) {
        await upload(data)
       
        console.log("first2")
      }
    } catch (error) {
    } finally {
      console.log('first')
      setTimeout(()=>{
        loading.value = false
      },400)
    }
  }

  const image = computed(() => (url.value ? url.value : null))
  const isLoading = computed(() => loading.value)
  const isFlag = computed(()=>flag.value)

  return {
    url,
    uploadImage,
    image,
    isLoading,
    isFlag,
   }
}

export default useImage
