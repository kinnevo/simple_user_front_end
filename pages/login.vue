<template>
    <div class="container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="username" id="username" v-model="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit" :disabled="pending">
                {{ pending ? 'Logging in...' : 'Login' }}
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useSessionStore } from '~/stores/session'
import { useAuthStore } from '~/stores/auth'

interface LoginResponse {
    token: string;
    token_type: string;
    user: {
        username: string;
        // other user fields
    };
    stage?: number;
}

const pending = ref(false)

const username = ref('')
const password = ref('')

const error = ref('')

const sessionStore = useSessionStore()
const authStore = useAuthStore()

const handleLogin = async () => {
    console.log('Login attempted:', { username: username.value, password: password.value })
    pending.value = true
    error.value = '' // Reset error message

    try {
        const formData = new URLSearchParams()
        formData.append('username', username.value)
        formData.append('password', password.value)

        const data = await $fetch<LoginResponse>('http://localhost:8000/api/auth/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        // Handle successful login
        if (data) {
            // Auth store handles JWT token and user authentication
            authStore.setUsername(username.value)
            authStore.setToken(data.token)

            // Create a new session
            try {
                const response = await sessionStore.createSession();
                console.log('Session creation response:', response); // Debug log

                if (!response) {
                    throw new Error('Failed to get session ID from response');
                }

                // Session store handles session-specific data
                sessionStore.setSession({
                    sessionStage: data.stage || 1,
                    sessionId: response,
                    user: {
                        username: username.value
                    }
                });

                console.log('Session state after setting:', {
                    sessionId: sessionStore.sessionId,
                    sessionNumber: sessionStore.sessionStage,
                    user: sessionStore.user
                }); // Debug log

                // Redirect to dashboard or home page
                navigateTo(`/stage/${data.stage || 1}`);
            } catch (sessionError) {
                console.error('Failed to create session:', sessionError);
                error.value = 'Failed to create session';
            }
        }
    } catch (e: any) {
        error.value = 'An error occurred during login'
        console.error('Login error:', e)
        if (e.response) {
            console.error('Error details:', await e.response._data)
        }
    } finally {
        pending.value = false
    }
}
</script>

<style scoped>
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

.login-form {
    max-width: 400px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background-color: #333;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #444;
}
</style>
