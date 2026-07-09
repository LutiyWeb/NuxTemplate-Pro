export default defineNuxtPlugin({
  name: 'auth-hydrate',
  enforce: 'post',
  setup() {
    const authStore = useAuthStore()

    const savedToken = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken) authStore.token = savedToken
    if (savedUser) {
      try {
        authStore.user = JSON.parse(savedUser)
      } catch {}
    }
  },
})
