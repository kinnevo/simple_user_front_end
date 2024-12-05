// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
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
    FASTAPI_URL: process.env.FASTAPI_URL || 'http://localhost:8000',
    public: {
      apiBase: '/api'
    }
  }
})
