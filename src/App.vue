<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

console.log(route)

console.log(authStore.isAuth)
</script>

<template>
  <v-card v-if="authStore.loading" elevation="3" max-width="1200" class="mx-auto">
    <v-layout>
      <v-app-bar color="indigo">
        <template v-slot:prepend>
          <v-btn class="font-weight-bold" :to="{ name: 'home', replace: true }">
            Bienes Raices - VueFire
          </v-btn>
        </template>
        <template v-slot:append>
          <div v-if="authStore.isAuth">
            <v-btn class="font-weight-bold" :to="{ name: 'admin-propiedades', replace: true }"
              >Admin</v-btn
            >
            <v-btn @click="authStore.logout" class="font-weight-bold">Cerrar Sesion</v-btn>
          </div>
          <div v-else>
            <v-btn v-if="route.name!=='home'" class="font-weight-bold" :to="{ name: 'home', replace: true }">Inicio</v-btn>
            <v-btn
              v-if="route.name !== 'login'"
              class="font-weight-bold"
              :to="{ name: 'login', replace: true }"
              >Iniciar sesion</v-btn
            >
          </div>
        </template>
      </v-app-bar>
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped></style>
