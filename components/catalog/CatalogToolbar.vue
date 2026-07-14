<script setup lang="ts">
const props = defineProps<{ sort: string; perPage: number }>()
const emit = defineEmits<{
  'update:sort': [string]
  'update:perPage': [number]
}>()

const sortModel = computed({
  get: () => props.sort,
  set: (val) => emit('update:sort', val),
})

const sortOptions = [
  { label: 'Новинки', value: 'newest' },
  { label: 'Ціна: від дешевих', value: 'price_asc' },
  { label: 'Ціна: від дорогих', value: 'price_desc' },
  { label: 'За рейтингом', value: 'rating' },
]

const perPageOptions = [
  { label: '20 на сторінці', value: 20 },
  { label: '40 на сторінці', value: 40 },
  { label: '60 на сторінці', value: 60 },
]
</script>

<template>
  <div class="catalog-toolbar">
    <select v-model="sortModel" class="catalog-toolbar__select">
      <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <select
      :value="perPage"
      class="catalog-toolbar__select"
      @change="emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="opt in perPageOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.catalog-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;

  &__select {
    height: 40px;
    padding: 0 36px 0 12px;
    border: 1px solid $color-gray-300;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-family: $font-family-base;
    color: $color-gray-700;
    background-color: $color-white;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color $transition-base;

    &:focus {
      border-color: $color-primary;
    }
  }
}
</style>
