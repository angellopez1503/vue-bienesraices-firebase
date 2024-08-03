<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useFirestore, useDocument } from 'vuefire'
import { doc, updateDoc } from 'firebase/firestore'

import { useField, useForm } from 'vee-validate'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import useImage from '@/composables/useImage'
import useLocationMap from '@/composables/useLocationMap'
import { validationSchema, imageSchema } from '@/validation/propiedadSchema'
import { ref, watch } from 'vue'
import Spinner from '@/components/Spinner.vue'

const items = [1, 2, 3, 4, 5]

const { url, uploadImage, image, isLoading, isFlag } = useImage()
const { zoom, center, pin } = useLocationMap()

const { handleSubmit } = useForm({ validationSchema })

const titulo = useField('titulo')
const imagen = useField('imagen')
const precio = useField('precio')
const habitaciones = useField('habitaciones')
const wc = useField('wc')
const estacionamiento = useField('estacionamiento')
const descripcion = useField('descripcion')
const alberca = useField('alberca')

const route = useRoute()
const router = useRouter()

const db = useFirestore()
const loading = ref(false)

const docRef = doc(db, 'propiedades', route.params.id)
const { data: propiedad, promise } = useDocument(docRef)
loading.value = true
promise.value.then((propiedad) => {
  if (!propiedad) router.replace({ name: 'admin-propiedades' })
 setTimeout(()=>{
  loading.value = false
},400)
})

watch(propiedad, (propiedad) => {
  titulo.value.value = propiedad.titulo
  precio.value.value = propiedad.precio
  habitaciones.value.value = propiedad.habitaciones
  wc.value.value = propiedad.wc
  estacionamiento.value.value = propiedad.estacionamiento
  descripcion.value.value = propiedad.descripcion
  alberca.value.value = propiedad.alberca
  center.value = propiedad.ubicacion
})

const submit = handleSubmit(async (values) => {
  const { imagen, ...propiedad } = values
  if (image.value) {
    const data = {
      ...propiedad,
      imagen: url.value,
      ubicacion: center.value
    }
    await updateDoc(docRef, data)
  } else {
    const data = {
      ...propiedad,
      ubicacion: center.value
    }
    await updateDoc(docRef, data)
  }

  router.replace({ name: 'admin-propiedades' })
})
</script>

<template>
  <Spinner v-if="loading" />
  <v-card v-else max-width="800" flat class="mx-auto my-10">
    <div class="mb-5 d-flex flex-column flex-md-row justify-md-space-between ga-3">
      <v-btn
        color="blue"
        class="font-weight-bold w-100 w-md-33"
        :to="{ name: 'admin-propiedades' }"
      >
        Salir
      </v-btn>
      <v-btn @click="submit" color="indigo" class="font-weight-bold w-100 w-md-33"
        >Editar Propiedad</v-btn
      >
    </div>
    <v-card-title class="text-h5 text-center font-weight-bold">Editar Propiedad</v-card-title>
    <v-card-subtitle class="text-h6 py-5"
      >Crea una nueva propiedad llenando el siguiente formulario</v-card-subtitle
    >
    <v-form class="mt-10">
      <div class="d-flex flex-column ga-2 mb-5">
        <v-text-field
          label="Titulo Propiedad"
          v-model="titulo.value.value"
          :error-messages="titulo.errorMessage.value"
        ></v-text-field>
        <v-file-input
          accept="image/jpeg,image/png"
          label="Fotografia"
          prepend-icon="mdi-camera"
          v-model="imagen.value.value"
          :error-messages="imagen.errorMessage.value"
          @change="uploadImage"
        ></v-file-input>

        <Spinner v-if="isLoading || loading" />
       
        <div v-if="image && !isLoading" class="my-5 d-flex flex-column justify-center align-center">
          <!-- <p class="font-weight-bold">Imagen Propiedad</p> -->
          <img :src="image" alt="" class="w-50" />
        </div>
        <div v-if="!isFlag && !loading" class="my-5 d-flex flex-column justify-center align-center">
          <!-- <p class="font-weight-bold">Imagen Propiedad</p> -->
          <img :src="propiedad?.imagen" alt="" class="w-50" />
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row ga-2 mb-5">
        <v-text-field
          label="Precio"
          v-model="precio.value.value"
          :error-messages="precio.errorMessage.value"
        ></v-text-field>
        <v-select
          label="Habitaciones"
          :items
          v-model="habitaciones.value.value"
          :error-messages="habitaciones.errorMessage.value"
        ></v-select>
      </div>
      <div class="d-flex flex-column flex-md-row ga-2 mb-5">
        <v-select
          label="WC"
          :items
          v-model="wc.value.value"
          :error-messages="wc.errorMessage.value"
        ></v-select>
        <v-select
          label="Lugares Estacionamiento"
          :items
          v-model="estacionamiento.value.value"
          :error-messages="estacionamiento.errorMessage.value"
        ></v-select>
      </div>
      <div class="mb-5">
        <v-textarea
          label="Descripcion"
          v-model="descripcion.value.value"
          :error-messages="descripcion.errorMessage.value"
        ></v-textarea>
      </div>
      <div class="mb-5">
        <v-checkbox label="Alberca" v-model="alberca.value.value"></v-checkbox>
      </div>
      <h2 class="font-weight-bold text-center my-5">Ubicacion</h2>
      <div class="pb-10">
        <div  class="mb-5 h-600">
          <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
            <LMarker :lat-lng="center" draggable @moveend="pin" />
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
          </LMap>
        </div>
      </div>
      <div class="mb-5 d-flex flex-column flex-md-row justify-md-space-between ga-3">
        <v-btn
          color="blue"
          class="font-weight-bold w-100 w-md-33"
          :to="{ name: 'admin-propiedades' }"
        >
          Salir
        </v-btn>
        <v-btn @click="submit" color="indigo" class="font-weight-bold w-100 w-md-33"
          >Editar Propiedad</v-btn
        >
      </div>
    </v-form>
  </v-card>
</template>

<style scoped></style>
