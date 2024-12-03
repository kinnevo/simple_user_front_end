<template>
  <div class="container">
    <h1>Logout</h1>
    <p>Thanks for your visit.</p>
    <button @click="goToHome" class="home-button">Go to Home</button>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { useSessionStore } from '~/stores/session'

const authStore = useAuthStore()
const sessionStore = useSessionStore()
const router = useRouter()

onMounted(async () => {
  await sessionStore.logout()
  authStore.clearAuth()
  router.push('/login')
})

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.home-button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.home-button:hover {
  background-color: #45a049;
}
</style>
