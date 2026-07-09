export default defineNuxtRouteMiddleware(() => {
  if (process.server) return
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  if (!authStore.isLoggedIn) {
    uiStore.authModalOpen = true
    return navigateTo('/')
  }
})
