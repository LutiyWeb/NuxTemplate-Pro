import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let counter = 0

  function add(message: string, type: ToastType = 'success') {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), 3500)
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx >= 0) toasts.value.splice(idx, 1)
  }

  return { toasts, add, remove }
})
