// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  routeRules: {
    '/stage/**': { ssr: false }
  },
  nitro: {
    devProxy: {
      '/api': 'http://localhost:8000'
    },
    routeRules: {
      '/api/**': {
        proxy: process.env.FASTAPI_URL || 'http://localhost:8000'
      }
    }
  },
  pinia: {
    storesDirs: ['./stores/**']
  },
  pages: true,
  runtimeConfig: {
    // Private keys are only available on the server
    FASTAPI_URL: process.env.FASTAPI_URL || 'http://localhost:8000',

    // Public keys that are exposed to the client
    public: {
      apiBase: '/api'
    }
  }
})
