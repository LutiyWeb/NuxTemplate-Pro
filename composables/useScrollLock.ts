export function useScrollLock(locked: Ref<boolean> | ComputedRef<boolean>) {
  watch(locked, (val) => {
    if (!process.client) return
    document.body.style.overflow = val ? 'hidden' : ''
  })

  onUnmounted(() => {
    if (process.client) document.body.style.overflow = ''
  })
}
