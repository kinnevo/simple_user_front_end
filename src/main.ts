import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(VueCompositionAPI)
Vue.use(PiniaVuePlugin)

const pinia = createPinia()

// ... rest of your Vue initialization 