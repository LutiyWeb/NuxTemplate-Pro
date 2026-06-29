import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@pinia/nuxt', 'nuxt-primevue', '@nuxt/image'],

  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    domains: ['images.unsplash.com'],
  },

  primevue: {
    usePrimeVue: true,
    options: { ripple: true },
    components: {
      include: [
        'InputText',
        'Button',
        'Password',
        'Card',
        'Sidebar',
        'Dialog',
        'Skeleton',
        'Textarea',
        'Dropdown',
      ],
    },
  },

  css: [
    'modern-normalize/modern-normalize.css',
    'primevue/resources/themes/aura-light-green/theme.css',
    'primevue/resources/primevue.min.css',
    'swiper/css',
    'swiper/css/navigation',
    'swiper/css/pagination',
    '~/assets/styles/main.scss',
    '~/assets/styles/globals.scss',
  ],

  vite: {
    plugins: [svgLoader()],
    server: {
      hmr: { port: 24678 },
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },

  postcss: {
    plugins: { autoprefixer: {} },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      isDev: process.env.NODE_ENV !== 'production',
      hcaptchaSiteKey: process.env.NUXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001',
    },
  },

  components: {
    dirs: [{ path: '~/components', pathPrefix: false }],
  },

  imports: {
    dirs: ['stores', 'composables'],
  },
})
