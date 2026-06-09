import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { authFetch } = useAuthFetch()
  const toastStore = useToastStore()

  const ids = ref<number[]>([])
  const count = computed(() => ids.value.length)

  function has(id: number) {
    return ids.value.includes(id)
  }

  async function fetchFavorites() {
    try {
      const res = await authFetch<{ data: { productId: number }[] }>('/api/favorites')
      ids.value = res.data.map((f) => f.productId)
    } catch {}
  }

  async function toggle(id: number) {
    const adding = !ids.value.includes(id)

    if (adding) ids.value.push(id)
    else ids.value.splice(ids.value.indexOf(id), 1)

    if (authStore.isLoggedIn && authStore.token) {
      try {
        if (adding) {
          await $fetch(`${config.public.apiBase}/api/favorites`, {
            method: 'POST',
            body: { productId: id },
            headers: { Authorization: `Bearer ${authStore.token}` },
          })
          toastStore.add('Товар добавлен в избранное')
        } else {
          await $fetch(`${config.public.apiBase}/api/favorites/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` },
          })
          toastStore.add('Товар удалён из избранного', 'warning')
        }
      } catch {
        if (adding) ids.value.splice(ids.value.indexOf(id), 1)
        else ids.value.push(id)
        toastStore.add('Не удалось обновить избранное', 'error')
      }
    } else if (adding) toastStore.add('Войдите, чтобы сохранить в избранное', 'warning')
  }

  if (process.client && authStore.isLoggedIn) {
    fetchFavorites()
  }

  watch(
    () => authStore.isLoggedIn,
    (loggedIn) => {
      if (loggedIn) fetchFavorites()
      else ids.value = []
    },
  )

  return { ids, count, has, toggle, fetchFavorites }
})
