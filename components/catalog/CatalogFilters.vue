<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  modelValue: { categories: string[]; priceMin: number; priceMax: number }
}>()

const emit = defineEmits<{
  'update:modelValue': [{ categories: string[]; priceMin: number; priceMax: number }]
  close: []
}>()

const categoriesStore = useCategoriesStore()

const local = reactive({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(local, val)
  },
  { deep: true },
)

function emitChange() {
  emit('update:modelValue', { ...local })
}

function toggleCategory(slug: string) {
  const idx = local.categories.indexOf(slug)
  if (idx === -1) local.categories.push(slug)
  else local.categories.splice(idx, 1)
  emitChange()
}
</script>

<template>
  <aside :class="['catalog-filters', { 'catalog-filters--open': isOpen }]">
    <div class="catalog-filters__head">
      <span class="catalog-filters__title">Фильтры</span>
      <button class="catalog-filters__close" type="button" @click="$emit('close')">✕</button>
    </div>

    <div class="catalog-filters__section">
      <span class="catalog-filters__label">Категории</span>
      <label v-for="cat in categoriesStore.categories" :key="cat.id" class="catalog-filters__check">
        <input
          type="checkbox"
          :value="cat.slug"
          :checked="local.categories.includes(cat.slug)"
          @change="toggleCategory(cat.slug)"
        />
        {{ cat.name }}
      </label>
    </div>

    <div class="catalog-filters__section">
      <span class="catalog-filters__label">Цена</span>
      <div class="catalog-filters__price">
        <InputText v-model="local.priceMin" placeholder="От" type="number" @change="emitChange" />
        <InputText v-model="local.priceMax" placeholder="До" type="number" @change="emitChange" />
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
.catalog-filters {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1024px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    background: $color-white;
    z-index: $z-modal;
    padding: 24px;
    width: 280px;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform $transition-base;
    box-shadow: $shadow-xl;

    &--open {
      transform: translateX(0);
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (min-width: 1025px) {
      display: none;
    }
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }

  &__close {
    width: 32px;
    height: 32px;
    background: $color-gray-100;
    border-radius: $radius-full;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-700;
  }

  &__check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
  }

  &__price {
    display: flex;
    gap: 8px;

    > * {
      flex: 1 1 0;
      min-width: 0;
    }
  }
}
</style>
