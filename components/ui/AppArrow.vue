<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  direction: 'left' | 'right'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), { disabled: false })
defineEmits<{ click: [] }>()
</script>

<template>
  <button class="app-arrow" type="button" :disabled="disabled" @click="$emit('click')">
    <ChevronLeft v-if="direction === 'left'" :size="16" />
    <ChevronRight v-else :size="16" />
  </button>
</template>

<style lang="scss">
.app-arrow {
  width: 28px;
  height: 28px;
  border-radius: $radius-full;
  border: 1px solid $color-gray-200;
  background: $color-white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-gray-500;
  flex-shrink: 0;
  transition:
    background $transition-fast,
    border-color $transition-fast,
    color $transition-fast;

  &:not(:disabled):hover {
    background: $color-gray-900;
    border-color: $color-gray-900;
    color: $color-white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}
</style>
