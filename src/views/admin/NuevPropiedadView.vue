<script setup>
import { useForm, useField } from 'vee-validate'
import { validationSchema, imageSchema } from '@/validation/propiedadSchema'
import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { useRouter } from 'vue-router'
import useImage from '@/composables/useImage'
import useLocationMap from '@/composables/useLocationMap'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer,LMarker } from '@vue-leaflet/vue-leaflet'

const { url, uploadImage, image } = useImage()
const { zoom, center,pin } = useLocationMap()

const items = [1, 2, 3, 4, 5]
const db = useFirestore()
const router = useRouter()
const { handleSubmit } = useForm({
  validationSchema: {
    ...validationSchema,
    ...imageSchema
  }
})

const titulo = useField('titulo')
const imagen = useField('imagen')
const precio = useField('precio')
const habitaciones = useField('habitaciones')
const wc = useField('wc')
const estacionamiento = useField('estacionamiento')
const descripcion = useField('descripcion')
const alberca = useField('alberca', null, {
  initialValue: false
})

const submit = handleSubmit(async (values) => {
  const { imagen, ...propiedad } = values

  const docRef = await addDoc(collection(db, 'propiedades'), {
    ...propiedad,
    imagen: url.value,
    ubicacion:center.value
  })
  if (docRef.id) {
    router.push({ name: 'admin-propiedades' })
  }
})
</script>

<template>
  <v-card max-width="800" flat class="mx-auto my-10">
    <div class="mb-5 d-flex flex-column flex-md-row justify-md-space-between ga-3">
        <v-btn color="blue" class="font-weight-bold w-100 w-md-33" :to="{name:'admin-propiedades'}">
            Salir
        </v-btn>
        <v-btn @click="submit" color="indigo" class="font-weight-bold w-100 w-md-33"
          >Agregar Propiedad</v-btn
        >
      </div>
    <v-card-title class="text-h5 text-center font-weight-bold">Nueva Propiedad</v-card-title>
    <v-card-subtitle class="text-h6 py-5"
      >Crea una nueva propiedad llenando el siguiente formulario</v-card-subtitle
    >
    <v-form class="mt-10">
      <div class="d-flex flex-column ga-2 mb-5" :class="{ 'flex-md-row': !image }">
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
        <div v-if="image" class="my-5 d-flex flex-column justify-center align-center">
          <!-- <p class="font-weight-bold">Imagen Propiedad</p> -->
          <img :src="image" alt="" class="w-50" />
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
            <LMarker
              :lat-lng="center"
              draggable
              @moveend="pin"
            />
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
          </LMap>
        </div>
      </div>
      <div class="mb-5 d-flex flex-column flex-md-row justify-md-space-between ga-3">
        <v-btn color="blue" class="font-weight-bold w-100 w-md-33" :to="{name:'admin-propiedades'}">
            Salir
        </v-btn>
        <v-btn @click="submit" color="indigo" class="font-weight-bold w-100 w-md-33"
          >Agregar Propiedad</v-btn
        >
      </div>
    </v-form>
  </v-card>
</template>

<style scoped></style>
