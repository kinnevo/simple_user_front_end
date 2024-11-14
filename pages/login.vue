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

interface LoginResponse {
    token: string;
    token_type: string;
}

const pending = ref(false)

const username = ref('')
const password = ref('')
pending.value = false

const error = ref('')

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

        // Add this console.log to see the response data
        console.log('Login successful:', {
            token: data.token,
            username: username.value
        })

        // Handle successful login
        if (data) {
            // Store token if your API returns one
            // const token = data.token
            // Save token to localStorage or use auth store

            // Redirect to dashboard or home page
            navigateTo('/')
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
