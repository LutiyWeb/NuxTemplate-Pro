<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import type { Brand } from '~/stores/brands'

export interface Filters {
  categories: string[]
  brands: string[]
  priceMin: number
  priceMax: number
}

export interface PricePreset {
  label: string
  priceMin: number
  priceMax: number
}

const props = defineProps<{
  isOpen: boolean
  modelValue: Filters
  pricePresets: PricePreset[]
}>()

const emit = defineEmits<{
  'update:modelValue': [Filters]
  close: []
}>()

const categoriesStore = useCategoriesStore()
const brandsStore = useBrandsStore()

const local = reactive<Filters>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => Object.assign(local, val),
  { deep: true },
)

function emitChange() {
  emit('update:modelValue', { ...local })
}

// ─── Categories ───────────────────────────────────────────────────────────────
function toggleCategory(slug: string) {
  const idx = local.categories.indexOf(slug)
  if (idx === -1) local.categories.push(slug)
  else local.categories.splice(idx, 1)
  emitChange()
}

// ─── Price Presets ────────────────────────────────────────────────────────────
const activePreset = computed(
  () =>
    props.pricePresets.find(
      (p) => p.priceMin === local.priceMin && p.priceMax === local.priceMax,
    ) ?? null,
)

function togglePreset(preset: PricePreset) {
  if (activePreset.value === preset) {
    local.priceMin = 0
    local.priceMax = 999999
  } else {
    local.priceMin = preset.priceMin
    local.priceMax = preset.priceMax
  }
  emitChange()
}

// ─── Brands ───────────────────────────────────────────────────────────────────
const brandSearch = ref('')
const brandSearchDebounced = ref('')

let brandTimer: ReturnType<typeof setTimeout>
watch(brandSearch, (val) => {
  clearTimeout(brandTimer)
  brandTimer = setTimeout(() => {
    brandSearchDebounced.value = val.trim()
  }, 300)
})

watch(brandSearchDebounced, (val) => {
  if (val.length === 0 || val.length >= 2) {
    brandsStore.fetchBrands(val.length >= 2 ? val : undefined)
  }
})

function toggleBrand(slug: string) {
  const idx = local.brands.indexOf(slug)
  if (idx === -1) local.brands.push(slug)
  else local.brands.splice(idx, 1)
  emitChange()
}

onMounted(() => brandsStore.fetchBrands())
onBeforeUnmount(() => clearTimeout(brandTimer))
</script>

<template>
  <aside :class="['catalog-filters', { 'catalog-filters--open': isOpen }]">
    <div class="catalog-filters__head">
      <span class="catalog-filters__title">Фільтри</span>
      <button class="catalog-filters__close" type="button" @click="$emit('close')">✕</button>
    </div>

    <slot name="chips" />

    <!-- Categories -->
    <div class="catalog-filters__section">
      <span class="catalog-filters__label">Категории</span>
      <label v-for="cat in categoriesStore.categories" :key="cat.id" class="catalog-filters__check">
        <input
          type="checkbox"
          :checked="local.categories.includes(cat.slug)"
          @change="toggleCategory(cat.slug)"
        />
        {{ cat.name }}
      </label>
    </div>

    <!-- Price presets -->
    <div class="catalog-filters__section">
      <span class="catalog-filters__label">Цена</span>
      <label v-for="preset in pricePresets" :key="preset.label" class="catalog-filters__check">
        <input type="checkbox" :checked="activePreset === preset" @change="togglePreset(preset)" />
        {{ preset.label }}
      </label>
    </div>

    <!-- Brands -->
    <div class="catalog-filters__section">
      <span class="catalog-filters__label">Бренды</span>

      <div class="catalog-filters__search">
        <Search :size="14" class="catalog-filters__search-icon" />
        <input
          v-model="brandSearch"
          class="catalog-filters__search-input"
          type="text"
          placeholder="Поиск бренда..."
        />
      </div>

      <div class="catalog-filters__brand-list">
        <div v-if="brandsStore.loading" class="catalog-filters__brand-loading">
          <div v-for="n in 4" :key="n" class="catalog-filters__brand-shimmer" />
        </div>
        <template v-else>
          <label
            v-for="brand in brandsStore.brands"
            :key="brand.slug"
            class="catalog-filters__check"
          >
            <input
              type="checkbox"
              :checked="local.brands.includes(brand.slug)"
              @change="toggleBrand(brand.slug)"
            />
            <span class="catalog-filters__brand-name">{{ brand.name }}</span>
            <span class="catalog-filters__brand-count">({{ brand.count }})</span>
          </label>
          <p v-if="!brandsStore.brands.length" class="catalog-filters__no-results">
            Ничего не найдено
          </p>
        </template>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
.catalog-filters {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: $color-white;
  z-index: $z-modal;
  padding: 24px;
  width: 300px;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform $transition-base;
  box-shadow: $shadow-xl;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &--open {
    transform: translateX(0);
  }

  @include mixins.respond-to(lg) {
    position: static;
    width: 240px;
    background: none;
    z-index: auto;
    padding: 0;
    overflow-y: visible;
    transform: none;
    transition: none;
    box-shadow: none;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include mixins.respond-to(lg) {
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
    margin-bottom: 4px;
  }

  &__check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
    line-height: 1.4;

    input[type='checkbox'] {
      flex-shrink: 0;
      accent-color: $color-primary;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
  }

  &__search {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__search-icon {
    position: absolute;
    left: 10px;
    color: $color-gray-400;
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 8px 10px 8px 32px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-900;
    outline: none;
    transition: border-color $transition-fast;

    &::placeholder {
      color: $color-gray-400;
    }

    &:focus {
      border-color: $color-primary;
    }
  }

  &__brand-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 220px;
    overflow-y: auto;
  }

  &__brand-name {
    flex: 1;
  }

  &__brand-count {
    color: $color-gray-400;
    font-size: $font-size-xs;
    flex-shrink: 0;
  }

  &__brand-loading {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__brand-shimmer {
    height: 18px;
    border-radius: $radius-sm;
    background: linear-gradient(
      90deg,
      $color-gray-100 25%,
      $color-gray-50 50%,
      $color-gray-100 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
  }

  &__no-results {
    font-size: $font-size-xs;
    color: $color-gray-400;
    margin: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
