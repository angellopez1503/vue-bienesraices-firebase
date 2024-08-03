<script setup>
import usePropiedades from '@/composables/usePropiedades'
import Propiedad from '@/components/Propiedad.vue'
import Spinner from '@/components/Spinner.vue'
import { price } from '@/helpers'

const { isLoading, filtro, propiedadesFiltradas } = usePropiedades()
</script>

<template>
  <Spinner v-if="isLoading" />
  <div v-else>
    <h1 class="text-center text-h3 font-weight-bold my-5">Nuestras Propiedades</h1>
    <v-card flat class="py-10">
      <div class="d-flex flex-column justify-center align-center">
        <v-card-title class="text-h6 font-weight-bold">
          Busqueda
        </v-card-title>
        <v-radio-group v-model="filtro" inline>
          <v-radio label="Todos" :value="1"></v-radio>
          <v-radio label="Con alberca" :value="2"></v-radio>
          <v-radio label="Sin alberca" :value="3"></v-radio>
        </v-radio-group>
      </div>
      <v-row>
        <Propiedad
          v-for="propiedad in propiedadesFiltradas"
          :key="propiedad.id"
          :propiedad="propiedad"
          :price="price"
        />
      </v-row>
    </v-card>
  </div>
</template>
<style scoped></style>
