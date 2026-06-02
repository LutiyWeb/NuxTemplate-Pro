<script setup lang="ts">
import { X } from 'lucide-vue-next'

export interface Chip {
  key: string
  label: string
}

const props = defineProps<{ chips: Chip[] }>()
const emit = defineEmits<{ remove: [key: string]; clearAll: [] }>()
</script>

<template>
  <div v-if="chips.length" class="catalog-chips">
    <TransitionGroup name="chip" tag="div" class="catalog-chips__list">
      <span v-for="chip in chips" :key="chip.key" class="catalog-chips__item">
        {{ chip.label }}
        <button
          class="catalog-chips__remove"
          type="button"
          :aria-label="`Убрать фильтр: ${chip.label}`"
          @click="emit('remove', chip.key)"
        >
          <X :size="16" />
        </button>
      </span>
    </TransitionGroup>

    <button
      v-if="chips.length > 1"
      class="catalog-chips__clear"
      type="button"
      @click="emit('clearAll')"
    >
      Сбросить всё
    </button>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.catalog-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: $color-primary;
    color: $color-white;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
  }

  &__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: $radius-full;
    cursor: pointer;
    transition: color $transition-fast;
    flex-shrink: 0;
    color: $color-white;

    &:hover {
      color: rgb(255 255 255 / 40%);
    }
  }

  &__clear {
    font-size: $font-size-xs;
    color: $color-gray-500;
    cursor: pointer;
    text-decoration: underline;
    transition: color $transition-fast;
    white-space: nowrap;

    &:hover {
      color: $color-gray-900;
    }
  }
}

.chip-enter-active,
.chip-leave-active {
  transition: all $transition-fast;
}

.chip-enter-from,
.chip-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
