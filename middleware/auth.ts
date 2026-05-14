export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  if (!authStore.isLoggedIn) {
    uiStore.authModalOpen = true
    return navigateTo('/')
  }
})
