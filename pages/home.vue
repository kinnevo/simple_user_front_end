<!-- pages/home.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- User Welcome -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold">
        Welcome, {{ user?.name }}
      </h1>
      <p class="text-gray-600">
        Manage your sessions below
      </p>
    </div>

    <!-- Session Management -->
    <div class="flex flex-col gap-4">
      <!-- New Session Button -->
      <div class="flex justify-center">
        <button @click="createNewSession" :disabled="loading"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          <span v-if="!loading">Start New Session</span>
          <span v-else>Creating Session...</span>
        </button>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Or Divider -->
      <div class="flex items-center my-4">
        <div class="flex-1 border-t border-gray-300"></div>
        <span class="px-4 text-gray-500">or</span>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>

      <!-- Existing Sessions -->
      <button @click="openSessionList"
        class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
        View Existing Sessions
      </button>
    </div>

    <!-- Session List Modal -->
    <SessionListModal v-if="showSessionList" @close="showSessionList = false" @select="loadExistingSession" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'
import { useAuthStore } from '../stores/auth'

// State
const loading = ref(false)
const error = ref<string | null>(null)
const showSessionList = ref(false)

// Store & Router
const router = useRouter()
const sessionStore = useSessionStore()
const authStore = useAuthStore()

// Computed
const user = computed(() => authStore.state.user)

// Methods
const createNewSession = async () => {
  try {
    loading.value = true
    error.value = null

    // Create new session
    await sessionStore.createSession()

    // Redirect to first stage
    router.push({
      path: '/stage/1',
      query: {
        sessionId: sessionStore.session
      }
    })
  } catch (err) {
    error.value = 'Failed to create new session. Please try again.'
    console.error('Session creation error:', err)
  } finally {
    loading.value = false
  }
}

const openSessionList = () => {
  showSessionList.value = true
}

const loadExistingSession = async (sessionId: string) => {
  try {
    loading.value = true
    error.value = null

    // Load selected session
    await sessionStore.loadSession(sessionId)

    // Redirect to the last active stage
    router.push({
      path: `/stage/${sessionStore.stage}`,
      query: { sessionId }
    })
  } catch (err) {
    error.value = 'Failed to load session. Please try again.'
    console.error('Session loading error:', err)
  } finally {
    loading.value = false
    showSessionList.value = false
  }
}

// Replace the existing onMounted with this:
definePageMeta({
  middleware: async (to, from) => {
    console.log('middleware --1')
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
  }
})
</script>
