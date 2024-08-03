<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Spinner from '@/components/Spinner.vue'
import { doc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import { price } from '@/helpers'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import useLocationMap from '@/composables/useLocationMap'

const { zoom, center, pin } = useLocationMap()

const route = useRoute()
const router = useRouter()
const db = useFirestore()
const loading = ref(false)

const docRef = doc(db, 'propiedades', route.params.id)
const { data: propiedad, promise } = useDocument(docRef)
loading.value = true
promise.value.then((propiedad) => {
  if (!propiedad) router.replace({ name: 'home' })
  setTimeout(() => {
    loading.value = false
  }, 400)
})

watch(propiedad, (propiedad) => {
  center.value = propiedad.ubicacion
})
</script>

<template>
  <Spinner v-if="loading" />
  <v-card v-else variant="flat">
    <v-card-title class="mt-5 text-h3 text-center py-5 font-weight-bold">
      {{ propiedad.titulo }}
    </v-card-title>
    <v-img :src="propiedad.imagen" height="550" cover></v-img>
    <div
      class="bg-blue-grey-lighten-5 d-flex flex-column align-center flex-md-row justify-md-space-between"
    >
      <v-card-text class="text-h7">
        Precio:
        <span class="font-weight-bold">{{ price(propiedad.precio) }}</span>
      </v-card-text>
      <v-card-text class="text-h7">
        Baños:
        <span class="font-weight-bold">{{ propiedad.wc }}</span>
      </v-card-text>
      <v-card-text class="text-h7">
        Estacionamiento:
        <span class="font-weight-bold">{{ propiedad.estacionamiento }}</span>
      </v-card-text>
      <v-card-text class="text-h7">
        Habitaciones:
        <span class="font-weight-bold">{{ propiedad.habitaciones }}</span>
      </v-card-text>
    </div>
    <v-row>
      <v-col cols="12" md="8">
        <div class="text-pre-wrap py-8">
          {{ propiedad.descripcion }}
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="py-8 h-600">
          <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
            <LMarker :lat-lng="center">
              <LPopup>
                {{ propiedad.titulo }}
              </LPopup>
            </LMarker>
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
          </LMap>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
