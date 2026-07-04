import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

export interface WishlistItem {
  productId: number
  createdAt: string
  product: Product
}

export interface Wishlist {
  id: number
  name: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  items: WishlistItem[]
}

const GUEST_KEY = 'wishlistGuest'

export const useWishlistsStore = defineStore('wishlists', () => {
  const { authFetch } = useAuthFetch()
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const wishlists = ref<Wishlist[]>([])
  const guestIds = ref<number[]>([])

  const defaultList = computed(() => wishlists.value.find((w) => w.isDefault) ?? null)

  const count = computed(() => {
    if (!authStore.isLoggedIn) return guestIds.value.length
    const allIds = new Set(wishlists.value.flatMap((w) => w.items.map((i) => i.productId)))
    return allIds.size
  })

  function has(productId: number): boolean {
    if (!authStore.isLoggedIn) return guestIds.value.includes(productId)
    return defaultList.value?.items.some((i) => i.productId === productId) ?? false
  }

  function _saveGuest() {
    localStorage.setItem(GUEST_KEY, JSON.stringify(guestIds.value))
  }

  function _loadGuest() {
    try {
      guestIds.value = JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]')
    } catch {
      guestIds.value = []
    }
  }

  async function fetchWishlists() {
    try {
      const res = await authFetch<{ data: Wishlist[] }>('/api/wishlists')
      wishlists.value = res.data
    } catch {}
  }

  async function toggle(productId: number) {
    if (!authStore.isLoggedIn) {
      const idx = guestIds.value.indexOf(productId)
      if (idx === -1) {
        guestIds.value.push(productId)
        toastStore.add('Товар добавлен в избранное')
      } else {
        guestIds.value.splice(idx, 1)
        toastStore.add('Товар удалён из избранного', 'warning')
      }
      _saveGuest()
      return
    }

    if (!wishlists.value.length) {
      await fetchWishlists()
    }

    if (!defaultList.value) {
      try {
        const res = await authFetch<{ data: Wishlist }>('/api/wishlists/sync', {
          method: 'POST',
          body: { productIds: [productId] },
        })
        wishlists.value = [res.data]
        toastStore.add('Товар добавлен в избранное')
      } catch {
        toastStore.add('Не удалось обновить избранное', 'error')
      }
      return
    }

    const listId = defaultList.value.id
    const inList = has(productId)

    if (inList) {
      const backup = [...defaultList.value.items]
      defaultList.value.items = defaultList.value.items.filter((i) => i.productId !== productId)
      try {
        await authFetch(`/api/wishlists/${listId}/items/${productId}`, { method: 'DELETE' })
        toastStore.add('Товар удалён из избранного', 'warning')
      } catch {
        defaultList.value.items = backup
        toastStore.add('Не удалось обновить избранное', 'error')
      }
    } else {
      try {
        const res = await authFetch<{ data: Wishlist }>(`/api/wishlists/${listId}/items`, {
          method: 'POST',
          body: { productId },
        })
        const idx = wishlists.value.findIndex((w) => w.id === listId)
        if (idx !== -1) wishlists.value[idx] = res.data
        toastStore.add('Товар добавлен в избранное')
      } catch {
        toastStore.add('Не удалось обновить избранное', 'error')
      }
    }
  }

  async function createList(name: string): Promise<Wishlist> {
    const res = await authFetch<{ data: Wishlist }>('/api/wishlists', {
      method: 'POST',
      body: { name },
    })
    await fetchWishlists()
    return res.data
  }

  async function deleteList(id: number) {
    await authFetch(`/api/wishlists/${id}`, { method: 'DELETE' })
    wishlists.value = wishlists.value.filter((w) => w.id !== id)
  }

  async function addItem(wishlistId: number, productId: number) {
    const res = await authFetch<{ data: Wishlist }>(`/api/wishlists/${wishlistId}/items`, {
      method: 'POST',
      body: { productId },
    })
    const idx = wishlists.value.findIndex((w) => w.id === wishlistId)
    if (idx !== -1) wishlists.value[idx] = res.data
  }

  async function removeItem(wishlistId: number, productId: number) {
    await authFetch(`/api/wishlists/${wishlistId}/items/${productId}`, { method: 'DELETE' })
    const list = wishlists.value.find((w) => w.id === wishlistId)
    if (list) list.items = list.items.filter((i) => i.productId !== productId)
  }

  async function moveItems(productIds: number[], fromWishlistId: number, toWishlistId: number) {
    await authFetch('/api/wishlists/bulk-move', {
      method: 'PATCH',
      body: { productIds, fromWishlistId, toWishlistId },
    })
    const from = wishlists.value.find((w) => w.id === fromWishlistId)
    const to = wishlists.value.find((w) => w.id === toWishlistId)
    if (from && to) {
      const idsSet = new Set(productIds)
      const moving = from.items.filter((i) => idsSet.has(i.productId))
      from.items = from.items.filter((i) => !idsSet.has(i.productId))
      moving.forEach((item) => {
        if (!to.items.some((i) => i.productId === item.productId)) to.items.push(item)
      })
    }
  }

  async function moveItem(productId: number, fromWishlistId: number, toWishlistId: number) {
    await authFetch('/api/wishlists/move', {
      method: 'PATCH',
      body: { productId, fromWishlistId, toWishlistId },
    })
    const from = wishlists.value.find((w) => w.id === fromWishlistId)
    const to = wishlists.value.find((w) => w.id === toWishlistId)
    if (from && to) {
      const item = from.items.find((i) => i.productId === productId)
      if (item) {
        from.items = from.items.filter((i) => i.productId !== productId)
        if (!to.items.some((i) => i.productId === productId)) to.items.push(item)
      }
    }
  }

  async function syncGuest() {
    const ids = [...guestIds.value]
    if (!ids.length) return
    try {
      const res = await authFetch<{ data: Wishlist }>('/api/wishlists/sync', {
        method: 'POST',
        body: { productIds: ids },
      })
      const idx = wishlists.value.findIndex((w) => w.isDefault)
      if (idx !== -1) wishlists.value[idx] = res.data
      else wishlists.value.unshift(res.data)
      guestIds.value = []
      localStorage.removeItem(GUEST_KEY)
    } catch {}
  }

  if (process.client) {
    _loadGuest()
    if (authStore.isLoggedIn) fetchWishlists()
  }

  watch(
    () => authStore.isLoggedIn,
    (loggedIn) => {
      if (loggedIn) fetchWishlists()
      else {
        wishlists.value = []
        _loadGuest()
      }
    },
  )

  return {
    wishlists,
    guestIds,
    defaultList,
    count,
    has,
    toggle,
    fetchWishlists,
    createList,
    deleteList,
    addItem,
    removeItem,
    moveItem,
    moveItems,
    syncGuest,
  }
})
