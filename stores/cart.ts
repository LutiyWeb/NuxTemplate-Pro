import { defineStore } from 'pinia'
import type { Product } from '~/types/product'
import type { CartEntry } from '~/contracts/cart'

export type { CartEntry }

const LS_KEY = 'nexus:cart'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  const { authFetch } = useAuthFetch()
  const toastStore = useToastStore()

  const items = ref<CartEntry[]>([])
  const loading = ref(false)

  const count = computed(() => items.value.reduce((s, e) => s + e.qty, 0))
  const total = computed(() => items.value.reduce((s, e) => s + e.product.price * e.qty, 0))

  // ── localStorage (гость) ─────────────────────────────────────────────────
  function _loadLocal() {
    if (!process.client) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) items.value = JSON.parse(raw)
    } catch {}
  }

  function _saveLocal() {
    if (!process.client) return
    localStorage.setItem(LS_KEY, JSON.stringify(items.value))
  }

  function _clearLocal() {
    if (!process.client) return
    localStorage.removeItem(LS_KEY)
  }

  // ── Применить ответ бэкенда ──────────────────────────────────────────────
  function _apply(backendItems: any[]) {
    items.value = backendItems.map((i) => ({
      id: i.id,
      product: i.product,
      qty: i.quantity,
    }))
  }

  // ── Загрузить корзину с бэкенда ──────────────────────────────────────────
  async function fetchCart() {
    loading.value = true
    try {
      const res = await authFetch<{ data: any }>('/api/cart')
      _apply(res.data.items)
    } catch {
    } finally {
      loading.value = false
    }
  }

  // ── Мигрировать гостевую корзину в бэкенд после входа ────────────────────
  async function _syncAfterLogin() {
    const localItems = [...items.value]
    await fetchCart()
    for (const local of localItems) {
      if (local.qty <= 0) continue
      try {
        const res = await authFetch<{ data: any }>('/api/cart/items', {
          method: 'POST',
          body: { productId: local.product.id, quantity: local.qty },
        })
        _apply(res.data.items)
      } catch {}
    }
    _clearLocal()
  }

  // ── add ──────────────────────────────────────────────────────────────────
  async function add(product: Product, qty = 1) {
    if (authStore.isLoggedIn) {
      try {
        const res = await authFetch<{ data: any }>('/api/cart/items', {
          method: 'POST',
          body: { productId: product.id, quantity: qty },
        })
        _apply(res.data.items)
      } catch (err: any) {
        const msg = err?.data?.error?.message
        toastStore.add(
          msg === 'Not enough product stock'
            ? 'Недостаточно товара на складе'
            : 'Не удалось добавить товар в корзину',
          'error',
        )
      }
    } else {
      const existing = items.value.find((e) => e.product.id === product.id)
      if (existing) existing.qty += qty
      else items.value.push({ id: null, product, qty })
      _saveLocal()
    }
  }

  // ── remove ───────────────────────────────────────────────────────────────
  async function remove(productId: number) {
    const entry = items.value.find((e) => e.product.id === productId)
    if (!entry) return

    if (authStore.isLoggedIn && entry.id !== null) {
      try {
        const res = await authFetch<{ data: any }>(`/api/cart/items/${entry.id}`, {
          method: 'DELETE',
        })
        _apply(res.data.items)
      } catch {
        toastStore.add('Не удалось удалить товар', 'error')
      }
    } else {
      items.value = items.value.filter((e) => e.product.id !== productId)
      _saveLocal()
    }
  }

  // ── updateQty ─────────────────────────────────────────────────────────────
  async function updateQty(productId: number, delta: number) {
    const entry = items.value.find((e) => e.product.id === productId)
    if (!entry) return
    const next = entry.qty + delta

    if (authStore.isLoggedIn && entry.id !== null) {
      if (next <= 0) {
        await remove(productId)
        return
      }
      try {
        const res = await authFetch<{ data: any }>(`/api/cart/items/${entry.id}`, {
          method: 'PATCH',
          body: { quantity: next },
        })
        _apply(res.data.items)
      } catch (err: any) {
        const msg = err?.data?.error?.message
        toastStore.add(
          msg === 'Not enough product stock'
            ? 'Недостаточно товара на складе'
            : 'Не удалось обновить количество',
          'warning',
        )
      }
    } else {
      if (next <= 0) items.value = items.value.filter((e) => e.product.id !== productId)
      else entry.qty = next
      _saveLocal()
    }
  }

  // ── clear ────────────────────────────────────────────────────────────────
  async function clear() {
    if (authStore.isLoggedIn) {
      try {
        const res = await authFetch<{ data: any }>('/api/cart', { method: 'DELETE' })
        _apply(res.data.items)
      } catch {
        items.value = []
      }
    } else {
      items.value = []
      _clearLocal()
    }
  }

  // ── Инициализация ─────────────────────────────────────────────────────────
  if (process.client) {
    if (authStore.isLoggedIn) {
      fetchCart()
    } else {
      _loadLocal()
    }
  }

  // При изменении состояния авторизации
  watch(
    () => authStore.isLoggedIn,
    async (loggedIn) => {
      if (loggedIn) {
        await _syncAfterLogin()
      } else {
        items.value = []
        _clearLocal()
      }
    },
  )

  return { items, loading, count, total, add, remove, updateQty, clear, fetchCart }
})
