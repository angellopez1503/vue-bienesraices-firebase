import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { VueFire,VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firebase'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
  })



const app = createApp(App)

app.use(VueFire,{
  firebaseApp,
  modules:[VueFireAuth()]
})
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
