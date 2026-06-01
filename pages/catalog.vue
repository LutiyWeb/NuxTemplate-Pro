<script setup lang="ts">
import { LayoutGrid, LayoutList } from 'lucide-vue-next'
import type { Filters, PricePreset } from '~/components/catalog/CatalogFilters.vue'
import type { Chip } from '~/components/catalog/CatalogChips.vue'

useHead({ title: 'Каталог — Nexus Commerce' })

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const brandsStore = useBrandsStore()
const { isLg } = useBreakpoints()
const isMobileFiltersOpen = ref(false)
const isMobileSortOpen = ref(false)
const mobileGridCols = ref<1 | 2>(2)

useScrollLock(computed(() => isMobileFiltersOpen.value || isMobileSortOpen.value))

const sortOptions = [
  { label: 'Новинки', value: 'newest' },
  { label: 'Ціна: від дешевих', value: 'price_asc' },
  { label: 'Ціна: від дорогих', value: 'price_desc' },
  { label: 'За рейтингом', value: 'rating' },
]
const perPageOptions = [20, 40, 60]

// ─── URL → state ──────────────────────────────────────────────────────────────
const selectedCategories = computed<string[]>(() => {
  const cats = route.query.categories
  const legacy = route.query.categorySlug as string | undefined
  const arr: string[] = cats
    ? Array.isArray(cats)
      ? [...(cats as string[])]
      : [cats as string]
    : []
  if (legacy && !arr.includes(legacy)) arr.push(legacy)
  return arr
})

const selectedBrands = computed<string[]>(() => {
  const b = route.query.brands
  return b ? (Array.isArray(b) ? [...(b as string[])] : [b as string]) : []
})

const currentPage = computed(() => Number(route.query.page ?? 1))
const perPage = computed(() => Number(route.query.limit ?? 20))
const sortKey = computed(() => (route.query.sortBy as string) ?? 'newest')

const activeFilters = computed<Filters>(() => ({
  categories: selectedCategories.value,
  brands: selectedBrands.value,
  priceMin: route.query.priceMin ? Number(route.query.priceMin) : 0,
  priceMax: route.query.priceMax ? Number(route.query.priceMax) : 999999,
}))

// ─── Fetch on URL change ──────────────────────────────────────────────────────
watch(
  () => route.query,
  () => {
    productsStore.fetchProducts({
      page: currentPage.value,
      limit: perPage.value,
      categories: selectedCategories.value.length ? selectedCategories.value : undefined,
      brands: selectedBrands.value.length ? selectedBrands.value : undefined,
      priceMin: activeFilters.value.priceMin > 0 ? activeFilters.value.priceMin : undefined,
      priceMax: activeFilters.value.priceMax < 999999 ? activeFilters.value.priceMax : undefined,
      sortBy: sortKey.value,
    })
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  categoriesStore.fetchCategories()
})

// ─── Price presets ────────────────────────────────────────────────────────────
const PRICE_PRESETS: PricePreset[] = [
  { label: 'До $50', priceMin: 0, priceMax: 50 },
  { label: '$50 – $100', priceMin: 50, priceMax: 100 },
  { label: '$100 – $500', priceMin: 100, priceMax: 500 },
  { label: 'От $500', priceMin: 500, priceMax: 999999 },
]

// ─── Active chips ─────────────────────────────────────────────────────────────
const activeChips = computed<Chip[]>(() => {
  const chips: Chip[] = []

  for (const slug of selectedCategories.value) {
    const cat = categoriesStore.categories.find((c) => c.slug === slug)
    chips.push({ key: `cat:${slug}`, label: cat?.name ?? slug })
  }

  for (const slug of selectedBrands.value) {
    const brand = brandsStore.brands.find((b) => b.slug === slug)
    chips.push({ key: `brand:${slug}`, label: brand?.name ?? slug })
  }

  const { priceMin, priceMax } = activeFilters.value
  if (priceMin > 0 || priceMax < 999999) {
    const preset = PRICE_PRESETS.find((p) => p.priceMin === priceMin && p.priceMax === priceMax)
    const label = preset?.label ?? `$${priceMin}–$${priceMax}`
    chips.push({ key: 'price', label: `Цена: ${label}` })
  }

  return chips
})

// ─── Filter actions ───────────────────────────────────────────────────────────
function onFiltersUpdate(filters: Filters) {
  const query: Record<string, string | string[]> = {
    ...(route.query as Record<string, string>),
  }
  delete query.categorySlug
  delete query.page

  if (filters.categories.length) query.categories = filters.categories
  else delete query.categories

  if (filters.brands.length) query.brands = filters.brands
  else delete query.brands

  if (filters.priceMin > 0) query.priceMin = String(filters.priceMin)
  else delete query.priceMin

  if (filters.priceMax < 999999) query.priceMax = String(filters.priceMax)
  else delete query.priceMax

  router.push({ query })
}

function removeChip(key: string) {
  const query: Record<string, string | string[]> = {
    ...(route.query as Record<string, string>),
  }
  delete query.page

  if (key.startsWith('cat:')) {
    const slug = key.slice(4)
    const cats = selectedCategories.value.filter((c) => c !== slug)
    if (cats.length) query.categories = cats
    else {
      delete query.categories
      delete query.categorySlug
    }
  } else if (key.startsWith('brand:')) {
    const slug = key.slice(6)
    const brands = selectedBrands.value.filter((b) => b !== slug)
    if (brands.length) query.brands = brands
    else delete query.brands
  } else if (key === 'price') {
    delete query.priceMin
    delete query.priceMax
  }

  router.push({ query })
}

function clearAllFilters() {
  router.push({ query: {} })
}

function onSortUpdate(sort: string) {
  router.push({ query: { ...route.query, sortBy: sort, page: '1' } })
}

function onPerPageUpdate(limit: number) {
  router.push({ query: { ...route.query, limit: String(limit), page: '1' } })
}

function onPageUpdate(page: number) {
  router.push({ query: { ...route.query, page: String(page) } })
}

// ─── Page title & breadcrumbs ─────────────────────────────────────────────────
const activeCategory = computed(() =>
  selectedCategories.value.length === 1
    ? (categoriesStore.categories.find((c) => c.slug === selectedCategories.value[0]) ?? null)
    : null,
)

const pageTitle = computed(() => activeCategory.value?.name ?? 'Каталог')

const breadcrumbs = computed(() => {
  const crumbs: { label: string; to?: string }[] = [{ label: 'Головна', to: '/' }]
  if (activeCategory.value) {
    crumbs.push({ label: 'Каталог', to: '/catalog' })
    crumbs.push({ label: activeCategory.value.name })
  } else {
    crumbs.push({ label: 'Каталог' })
  }
  return crumbs
})
</script>

<template>
  <div class="catalog container">
    <div class="catalog__head">
      <AppBreadcrumbs :crumbs="breadcrumbs" class="catalog__breadcrumbs" />
      <TheTitle tag="h1">{{ pageTitle }}</TheTitle>
      <div class="catalog__mobile-actions">
        <button class="catalog__action-btn" type="button" @click="isMobileFiltersOpen = true">
          Фільтри
        </button>
        <button class="catalog__action-btn" type="button" @click="isMobileSortOpen = true">
          Сортування
        </button>
        <div class="catalog__grid-toggle">
          <button
            :class="['catalog__grid-btn', { 'catalog__grid-btn--active': mobileGridCols === 2 }]"
            type="button"
            @click="mobileGridCols = 2"
          >
            <LayoutGrid :size="16" />
          </button>
          <button
            :class="['catalog__grid-btn', { 'catalog__grid-btn--active': mobileGridCols === 1 }]"
            type="button"
            @click="mobileGridCols = 1"
          >
            <LayoutList :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isMobileFiltersOpen || isMobileSortOpen"
        class="catalog__backdrop"
        @click="isMobileFiltersOpen = false; isMobileSortOpen = false"
      />
    </Transition>

    <!-- Mobile sort drawer -->
    <Transition name="slide-up">
      <div v-if="isMobileSortOpen" class="catalog__sort-drawer">
        <div class="catalog__sort-drawer-head">
          <span class="catalog__sort-drawer-title">Сортування</span>
          <button
            class="catalog__sort-drawer-close"
            type="button"
            @click="isMobileSortOpen = false"
          >
            ✕
          </button>
        </div>
        <div class="catalog__sort-options">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            :class="[
              'catalog__sort-option',
              { 'catalog__sort-option--active': sortKey === opt.value },
            ]"
            type="button"
            @click="
              onSortUpdate(opt.value)
              isMobileSortOpen = false
            "
          >
            {{ opt.label }}
          </button>
        </div>
        <div class="catalog__sort-perpage">
          <span class="catalog__sort-perpage-label">На сторінці</span>
          <div class="catalog__sort-perpage-options">
            <button
              v-for="n in perPageOptions"
              :key="n"
              :class="[
                'catalog__sort-perpage-btn',
                { 'catalog__sort-perpage-btn--active': perPage === n },
              ]"
              type="button"
              @click="
                onPerPageUpdate(n)
                isMobileSortOpen = false
              "
            >
              {{ n }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="catalog__layout">
      <CatalogFilters
        :model-value="activeFilters"
        :is-open="isMobileFiltersOpen"
        :price-presets="PRICE_PRESETS"
        @update:model-value="onFiltersUpdate"
        @close="isMobileFiltersOpen = false"
      >
        <template #chips>
          <CatalogChips
            v-if="!isLg && activeChips.length"
            :chips="activeChips"
            @remove="removeChip"
            @clear-all="clearAllFilters"
          />
        </template>
      </CatalogFilters>

      <div class="catalog__main">
        <div v-if="isLg" class="catalog__toolbar-row">
          <CatalogChips :chips="activeChips" @remove="removeChip" @clear-all="clearAllFilters" />
          <CatalogToolbar
            :sort="sortKey"
            :per-page="perPage"
            @update:sort="onSortUpdate"
            @update:per-page="onPerPageUpdate"
          />
        </div>

        <div
          v-if="productsStore.loading"
          :class="['catalog__grid', { 'catalog__grid--single': !isLg && mobileGridCols === 1 }]"
        >
          <TheProductCard v-for="n in perPage" :key="n" :loading="true" />
        </div>

        <div
          v-else-if="productsStore.products.length"
          :class="['catalog__grid', { 'catalog__grid--single': !isLg && mobileGridCols === 1 }]"
        >
          <TheProductCard
            v-for="product in productsStore.products"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-else class="catalog__empty">
          <p>Товары не найдены. Попробуйте изменить фильтры.</p>
        </div>

        <CatalogPagination
          v-if="productsStore.meta.totalPages > 1"
          :page="currentPage"
          :total-pages="productsStore.meta.totalPages"
          @update:page="onPageUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.catalog {
  padding-block: 32px;

  /* &__breadcrumbs {
    margin-bottom: 16px;
  } */

  &__head {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__mobile-actions {
    display: flex;
    gap: 8px;
    align-items: center;

    @include mixins.respond-to(lg) {
      display: none;
    }
  }

  &__action-btn {
    flex: 1;
    padding: 10px 16px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
    background: $color-white;
    cursor: pointer;
    transition:
      background $transition-fast,
      border-color $transition-fast;

    &:hover {
      background: $color-gray-50;
      border-color: $color-gray-300;
    }
  }

  &__grid-toggle {
    display: flex;
    gap: 4px;
    margin-left: auto;
    flex-shrink: 0;
  }

  &__grid-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    background: $color-white;
    color: $color-gray-400;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    &:hover {
      background: $color-gray-50;
      color: $color-gray-700;
    }

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: $color-white;
    }
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 40%);
    z-index: calc(#{$z-modal} - 1);
  }

  &__layout {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    &--single {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    @include mixins.respond-to(md) {
      gap: 16px;
      grid-template-columns: repeat(3, 1fr);
    }

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__empty {
    padding: 48px;
    text-align: center;
    color: $color-gray-400;
    font-size: $font-size-lg;
  }

  &__sort-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: $color-white;
    z-index: $z-modal;
    border-radius: $radius-xl $radius-xl 0 0;
    padding: 24px;
    box-shadow: $shadow-xl;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @include mixins.respond-to(lg) {
      display: none;
    }
  }

  &__sort-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__sort-drawer-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__sort-drawer-close {
    width: 32px;
    height: 32px;
    background: $color-gray-100;
    border-radius: $radius-full;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-sm;
  }

  &__sort-options {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__sort-option {
    padding: 10px 12px;
    text-align: left;
    font-size: $font-size-sm;
    color: $color-gray-700;
    border-radius: $radius-md;
    cursor: pointer;
    background: none;
    border: none;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-gray-100;
    }
    &--active {
      background: $color-primary;
      color: $color-white;
    }
  }

  &__sort-perpage {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid $color-gray-100;
  }

  &__sort-perpage-label {
    font-size: $font-size-sm;
    color: $color-gray-500;
  }

  &__sort-perpage-options {
    display: flex;
    gap: 8px;
  }

  &__sort-perpage-btn {
    width: 44px;
    height: 36px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-700;
    cursor: pointer;
    background: $color-white;
    transition:
      background $transition-fast,
      border-color $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-gray-100;
    }
    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: $color-white;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform $transition-base;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
