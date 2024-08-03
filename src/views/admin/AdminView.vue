<script setup>
import usePropiedades from '@/composables/usePropiedades'
import { price } from '@/helpers'
import Spinner from '@/components/Spinner.vue'

const { propiedadesCollection, isLoading, deleteItem } = usePropiedades()
</script>

<template>
  <spinner v-if="isLoading" />
  <div v-else>
    <h2 class="text-center text-h3 my-5 font-weight-bold">Admin Panel</h2>
    <v-btn color="blue" variant="flat" :to="{ name: 'nueva-propiedad' }">
      Nueva Propiedad
    </v-btn>
    <v-card class="mx-auto mt-10" flat>
      <v-list>
        <v-list-item v-for="propiedad in propiedadesCollection" :key="propiedad.id">
          <template v-slot:prepend>
            <v-list-item-media start>
              <img width="180" :src="propiedad.imagen" />
            </v-list-item-media>
          </template>
          <v-list-item-title>{{ propiedad.titulo }}</v-list-item-title>
          <v-list-item-title>{{ price(propiedad.precio) }}</v-list-item-title>
          <template v-slot:append>
            <div class="d-flex ga-2">
              <v-btn
                color="info"
                variant="flat"
                :to="{ name: 'editar-propiedad', params: { id: propiedad.id } }"
              >
                Editar
              </v-btn>
              <v-btn color="red" variant="flat" @click="deleteItem(propiedad.id, propiedad.imagen)">
                Eliminar
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<style scoped></style>
