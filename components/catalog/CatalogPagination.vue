<script setup lang="ts">
const props = defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{ 'update:page': [number] }>()

const pages = computed(() => {
  const total = props.totalPages
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const cur = props.page
  const set = new Set([1, 2, cur - 1, cur, cur + 1, total - 1, total])
  return [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
})
</script>

<template>
  <div class="catalog-pagination">
    <button
      class="catalog-pagination__btn"
      :disabled="page <= 1"
      type="button"
      @click="emit('update:page', page - 1)"
    >
      ‹
    </button>

    <template v-for="(p, i) in pages" :key="p">
      <span v-if="i > 0 && p - pages[i - 1] > 1" class="catalog-pagination__dots">…</span>
      <button
        :class="['catalog-pagination__btn', { 'catalog-pagination__btn--active': p === page }]"
        type="button"
        @click="emit('update:page', p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      class="catalog-pagination__btn"
      :disabled="page >= totalPages"
      type="button"
      @click="emit('update:page', page + 1)"
    >
      ›
    </button>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.catalog-pagination {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin-top: 32px;

  &__btn {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    border-radius: $radius-md;
    border: 1px solid $color-gray-200;
    background: $color-white;
    font-size: $font-size-sm;
    cursor: pointer;
    transition:
      background $transition-fast,
      border-color $transition-fast,
      color $transition-fast;

    &:not(:disabled):hover {
      border-color: $color-primary;
      color: $color-primary;
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: $color-white;
    }
  }

  &__dots {
    padding: 0 4px;
    color: $color-gray-400;
  }
}
</style>
