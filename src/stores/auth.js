import { ref, computed, onMounted, watch,watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter,useRoute } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const auth = useFirebaseAuth()
  const authUser = ref({})
  const router = useRouter()
  const route = useRoute()
  const loading = ref(false)

  console.log(authUser.value)

  const errorMsg = ref('')

  const errorCodes = {
    'auth/invalid-credential': 'credencial inválida',
    'auth/too-many-requests': 'Demasiadas solicitudes'
  }

  onMounted(() => {
    // authUser.value = {}

    onAuthStateChanged(auth, (user) => {
      if (user) {
        authUser.value = user
        console.log(authUser.value)
      }
      loading.value = true
    })
  })

 



  const login = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
        const user = userCredential.user
        authUser.value = user
        router.replace({ name: 'admin-propiedades' })
        console.log(authUser.value)
      })
      .catch((error) => {
        console.log(errorCodes[error.code])
        errorMsg.value = errorCodes[error.code]
      })
  }

  const logout = () => {
    signOut(auth)
      .then(() => {
        authUser.value = {}
        router.replace({ name: 'login' })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const isAuth = computed(() => Object.keys(authUser.value).length)

  const hasError = computed(() => !!errorMsg.value)

  return {
    login,
    logout,
    hasError,
    errorMsg,
    isAuth,
    loading
  }
})
