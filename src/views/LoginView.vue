<script setup>
import { useForm, useField } from 'vee-validate'
import { loginSchema } from '@/validation/loginSchema'
import { useAuthStore } from '@/stores/auth'

const { handleSubmit } = useForm({ validationSchema: loginSchema })

const authStore = useAuthStore()

const email = useField('email')
const password = useField('password')

// email.value.value = "correo@correo.com"
// password.value.value = "password"

const submit = handleSubmit((values) => {
  authStore.login(values)
})
</script>

<template>
  <v-card flat max-width="600" class="mx-auto py-10">
    <v-card-title class="text-h4 font-weight-bold text-center">
      Iniciar sesion
    </v-card-title>
    <v-card-subtitle class="text-h6 mt-5">
      Inicia sesion con tu cuenta
    </v-card-subtitle>
    <v-alert v-if="authStore.hasError" class="my-5" :title="authStore.errorMsg" type="error"></v-alert>
    <v-form @submit.prevent="submit" class="mt-3">
      <v-text-field
        type="email"
        label="Email"
        bg-color="blue-grey-lighten-5"
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        class="mb-3"
      ></v-text-field>
      <v-text-field
        type="password"
        label="Password"
        bg-color="blue-grey-lighten-5"
        v-model="password.value.value"
        :error-messages="password.errorMessage.value"
        class="mb-3"
      ></v-text-field>
      <v-btn block color="indigo" type="submit">
        <v-icon
          icon="mdi-content-save"
          start
        ></v-icon>
        Iniciar sesion
      </v-btn>
    </v-form>
  </v-card>
</template>

<style scoped></style>
