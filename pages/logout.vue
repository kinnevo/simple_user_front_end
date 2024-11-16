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

const authStore = useAuthStore()
const router = useRouter()

// Example using fetch
async function logout() {
  try {
    const response = await fetch('http://localhost:8000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Redirect to login page or home
      // window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Execute logout on page load
onMounted(() => {
  // Clear local auth state
  authStore.setUsername("")
})

const goToHome = () => {
  logout()
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
