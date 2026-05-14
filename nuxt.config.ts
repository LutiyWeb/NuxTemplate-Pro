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
    options: { ripple: true },
    components: {
      include: ['InputText', 'Button', 'Password', 'Card', 'Sidebar', 'Dialog', 'Skeleton', 'Textarea', 'Dropdown'],
    },
  },

  css: [
    'modern-normalize/modern-normalize.css',
    'primevue/resources/themes/aura-light-green/theme.css',
    'primevue/resources/primevue.min.css',
    '~/assets/styles/main.scss',
  ],

  vite: {
    plugins: [svgLoader()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (content: string, filepath: string) => {
            if (
              filepath.includes('_variables') ||
              filepath.includes('_mixins') ||
              filepath.includes('main.scss')
            ) return content
            return `@use "~/assets/styles/variables" as *;\n@use "~/assets/styles/mixins" as mixins;\n${content}`
          },
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
    },
  },

  components: {
    dirs: [{ path: '~/components', pathPrefix: false }],
  },

  imports: {
    dirs: ['stores', 'composables'],
  },
})
