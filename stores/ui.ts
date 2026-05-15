import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const authModalOpen = ref(false)
  const catalogOpen   = ref(false)
  const searchOpen    = ref(false)
  const sidebarOpen   = ref(false)

  // true whenever any overlay is visible
  const overlayVisible = computed(
    () => authModalOpen.value || catalogOpen.value || searchOpen.value || sidebarOpen.value,
  )

  // catalog sits inside the header stacking context → backdrop must be BELOW the header
  // search / auth / sidebar cover everything → backdrop must be ABOVE the header
  const overlayAboveHeader = computed(
    () => authModalOpen.value || searchOpen.value || sidebarOpen.value,
  )

  function closeAll() {
    authModalOpen.value = false
    catalogOpen.value   = false
    searchOpen.value    = false
    sidebarOpen.value   = false
  }

  return { authModalOpen, catalogOpen, searchOpen, sidebarOpen, overlayVisible, overlayAboveHeader, closeAll }
})
