<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  borderRadius?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  borderRadius: '4px',
})
</script>

<template>
  <div
    class="app-skeleton"
    :style="{ '--sk-w': width, '--sk-h': height, '--sk-r': borderRadius }"
  />
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.app-skeleton {
  width: var(--sk-w, 100%);
  height: var(--sk-h, 1rem);
  border-radius: var(--sk-r, 4px);
  background: linear-gradient(90deg, $color-gray-200 25%, $color-gray-100 50%, $color-gray-200 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  flex-shrink: 0;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
