import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const authModalOpen = ref(false)
  return { authModalOpen }
})
