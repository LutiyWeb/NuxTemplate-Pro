import { defineStore } from 'pinia'

const STORAGE_KEY = 'nexus:search-history'
const MAX_ITEMS = 8

export const useSearchStore = defineStore('search', () => {
  const history = ref<string[]>([])

  function init() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) history.value = JSON.parse(raw)
    } catch {}
  }

  function push(query: string) {
    const q = query.trim()
    if (!q) return
    history.value = [q, ...history.value.filter(h => h !== q)].slice(0, MAX_ITEMS)
    persist()
  }

  function remove(query: string) {
    history.value = history.value.filter(h => h !== query)
    persist()
  }

  function clear() {
    history.value = []
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  function persist() {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  }

  return { history, init, push, remove, clear }
})
