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

const perPageModel = computed({
  get: () => props.perPage,
  set: (val) => emit('update:perPage', val),
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
    <Dropdown
      v-model="sortModel"
      :options="sortOptions"
      option-label="label"
      option-value="value"
      class="catalog-toolbar__dropdown"
    />
    <Dropdown
      v-model="perPageModel"
      :options="perPageOptions"
      option-label="label"
      option-value="value"
      class="catalog-toolbar__dropdown"
    />
  </div>
</template>

<style lang="scss">
.catalog-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;

  &__dropdown {
    font-size: $font-size-sm;
    font-family: $font-family-base;
  }
}
</style>
