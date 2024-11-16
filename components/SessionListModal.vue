<!-- components/SessionListModal.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-lg">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Your Sessions</h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <span class="sr-only">Close</span>
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="loading" class="text-center py-4">
                Loading sessions...
            </div>

            <div v-else-if="error" class="text-red-600 py-4">
                {{ error }}
            </div>

            <div v-else-if="sessions.length === 0" class="text-center py-4 text-gray-500">
                No existing sessions found
            </div>

            <div v-else class="space-y-2">
                <button v-for="session in sessions" :key="session.id" @click="$emit('select', session.id)"
                    class="w-full text-left px-4 py-3 rounded border hover:bg-gray-50 transition-colors">
                    <div class="font-medium">
                        Session {{ session.id }}
                    </div>
                    <div class="text-sm text-gray-500">
                        Stage {{ session.currentStage }} -
                        Created {{ new Date(session.createdAt).toLocaleDateString() }}
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSessionStore } from '../stores/session'

const loading = ref(false)
const error = ref<string | null>(null)
const sessions = ref<any[]>([])
const sessionStore = useSessionStore()

onMounted(async () => {
    try {
        loading.value = true
        // Get user's sessions
        sessions.value = await sessionStore.getUserSessions()
    } catch (err) {
        error.value = 'Failed to load sessions'
        console.error('Error loading sessions:', err)
    } finally {
        loading.value = false
    }
})

defineEmits<{
    (e: 'close'): void
    (e: 'select', sessionId: string): void
}>()
</script>