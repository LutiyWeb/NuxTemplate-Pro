import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@pinia/nuxt',
    'nuxt-primevue',
  ],

  primevue: {
    usePrimeVue: true,
    options: {
      ripple: true,
    },
    components: {
      include: ['InputText', 'Button', 'Card', 'Sidebar', 'Dialog', 'Skeleton'],
    },
  },

  css: [
    'primevue/resources/themes/aura-light-green/theme.css',
    'primevue/resources/primevue.min.css',
    '@/assets/scss/main.scss',
  ],

  vite: {
    plugins: [svgLoader()],
  },

  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
    },
  },

  imports: {
    dirs: ['stores', 'composables'],
  },
})
