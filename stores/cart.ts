import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

export interface CartEntry { product: Product; qty: number }

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartEntry[]>([])
  const count = computed(() => items.value.reduce((sum, e) => sum + e.qty, 0))
  const total = computed(() => items.value.reduce((sum, e) => sum + e.product.price * e.qty, 0))

  if (process.client) {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try { items.value = JSON.parse(saved) } catch {}
    }
  }

  watch(items, (val) => {
    if (process.client) localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })

  function add(product: Product, qty = 1) {
    const existing = items.value.find((e) => e.product.id === product.id)
    if (existing) existing.qty += qty
    else items.value.push({ product, qty })
  }

  function remove(id: number) {
    const idx = items.value.findIndex((e) => e.product.id === id)
    if (idx >= 0) items.value.splice(idx, 1)
  }

  function updateQty(id: number, delta: number) {
    const entry = items.value.find((e) => e.product.id === id)
    if (!entry) return
    const next = entry.qty + delta
    if (next <= 0) remove(id)
    else entry.qty = next
  }

  function clear() { items.value = [] }

  return { items, count, total, add, remove, updateQty, clear }
})
