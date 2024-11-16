import { defineStore } from 'pinia'
import { useNuxtApp } from 'nuxt/app'

interface AuthState {
    authenticated: boolean;
    token: string | null
    username: string
    password: string | null
    user: string | null
}
export type AuthStoreType = ReturnType<typeof useAuthStore>
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        authenticated: useNuxtApp().isClient ? !!localStorage.getItem('token') : false,
        token: useNuxtApp().isClient ? localStorage.getItem('token') : null,
        username: '',
        password: null,
        user: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user
    },

    actions: {
        clearAuth() {
            this.$patch({
                token: null,
                username: '',
                password: null
            })
        },

        logout() {
            this.clearAuth()
            navigateTo('/login')
        },

        setUsername(username: string) {
            this.username = username
        },

        setToken(token: string) {
            this.token = token
        }
    }
})
