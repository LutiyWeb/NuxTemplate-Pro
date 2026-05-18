<script setup lang="ts">
const props = defineProps<{ sort: string; perPage: number }>()
const emit = defineEmits<{
  'update:sort': [string]
  'update:perPage': [number]
}>()

const sortOptions = [
  { label: 'Новинки', value: 'newest' },
  { label: 'Цена: по возрастанию', value: 'price_asc' },
  { label: 'Цена: по убыванию', value: 'price_desc' },
  { label: 'По рейтингу', value: 'rating' },
]

const perPageOptions = [20, 40, 60]
</script>

<template>
  <div class="catalog-toolbar">
    <select
      :value="sort"
      class="catalog-toolbar__select"
      @change="emit('update:sort', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <select
      :value="perPage"
      class="catalog-toolbar__select"
      @change="emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="n in perPageOptions" :key="n" :value="n">{{ n }} на странице</option>
    </select>
  </div>
</template>

<style lang="scss">
.catalog-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;

  &__select {
    padding: 8px 12px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-family: $font-family-base;
    color: $color-gray-700;
    cursor: pointer;
    outline: none;
    transition: border-color $transition-fast;

    &:focus {
      border-color: $color-primary;
    }
  }
}
</style>
