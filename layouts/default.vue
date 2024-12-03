<template>
    <div>
        <!-- Top Ribbon Menu -->
        <nav class="navbar">
            <ul class="menu">
                <li><a href="/">Home</a></li>
                <li><a href="/fast_innovation">Fast Innovation</a></li>
                <li><a href="/about">About</a></li>
            </ul>

            <div class="auth-buttons" v-if="username">
                username: {{ username }}
                <nuxt-link to="/logout">Logout</nuxt-link>
            </div>
            <div class="auth-buttons" v-else>
                <nuxt-link to="/login">Login</nuxt-link>
            </div>

        </nav>

        <!-- Debug Ribbon -->
        <div class="debug-ribbon">
            <div class="debug-content">
                <span><strong>User:</strong> {{ username }}</span>
                <span><strong>JWT:</strong> {{ truncatedToken }}</span>
                <span><strong>Session ID:</strong> {{ sessionStore.sessionId || 'None' }}</span>
                <span><strong>Stage:</strong> {{ sessionStore.sessionStage }}</span>
                <span><strong>Message Index:</strong> {{ messageIndex }}</span>
            </div>
        </div>

        <!-- Page Content -->
        <slot />
    </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useSessionStore } from '~/stores/session'

const authStore = useAuthStore()
const sessionStore = useSessionStore()
const route = useRoute()

const { username } = storeToRefs(authStore)
const messageIndex = ref(0)

const truncatedToken = computed(() => {
    const token = authStore.token
    return token ? `${token.substring(0, 10)}...` : 'No token'
})
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    background-color: #2c3e50;
    padding: 10px;
    color: white;
}

.menu {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.menu li {
    margin-right: 15px;
}

.menu li a {
    color: white;
    text-decoration: none;
}

.auth-buttons {
    display: flex;
    align-items: center;
}

.auth-buttons a {
    color: white;
    margin-left: 10px;
    text-decoration: none;
}

.container {
    padding: 2rem;
}

.navigation {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.nav-link {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.nav-link:hover {
    background-color: #f0f0f0;
}

.debug-ribbon {
    background-color: #e0f2e9;
    border-top: 1px solid #90cca5;
    border-bottom: 1px solid #90cca5;
    padding: 8px 0;
    font-family: monospace;
    font-size: 0.9rem;
}

.debug-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 10px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.debug-content span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.debug-content strong {
    color: #2c5282;
}
</style>