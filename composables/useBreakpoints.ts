export function useBreakpoints() {
  const width = ref(0)

  const update = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    width.value = window.innerWidth
    window.addEventListener('resize', update)
  })
  onUnmounted(() => window.removeEventListener('resize', update))

  return {
    isSm: computed(() => width.value >= 640),
    isMd: computed(() => width.value >= 768),
    isLg: computed(() => width.value >= 1024),
    isXl: computed(() => width.value >= 1280),
  }
}
