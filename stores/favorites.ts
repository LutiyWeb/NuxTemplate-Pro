import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', () => {
  const config = useRuntimeConfig()
  const ids = ref<number[]>([])
  const count = computed(() => ids.value.length)

  function has(id: number) {
    return ids.value.includes(id)
  }

  async function toggle(id: number) {
    const authStore = useAuthStore()
    const toastStore = useToastStore()
    const adding = !ids.value.includes(id)

    // Optimistic update
    if (adding) ids.value.push(id)
    else ids.value.splice(ids.value.indexOf(id), 1)

    // Sync with server if logged in
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
        // Rollback on error
        if (adding) ids.value.splice(ids.value.indexOf(id), 1)
        else ids.value.push(id)
        toastStore.add('Не удалось обновить избранное', 'error')
      }
    } else if (adding) toastStore.add('Войдите, чтобы сохранить в избранное', 'warning')
  }

  return { ids, count, has, toggle }
})
