<script setup lang="ts">
import type { Filters, PricePreset } from '~/components/catalog/CatalogFilters.vue'
import type { Chip } from '~/components/catalog/CatalogChips.vue'

useHead({ title: 'Каталог — Nexus Commerce' })

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const brandsStore = useBrandsStore()
const isMobileFiltersOpen = ref(false)

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
    else { delete query.categories; delete query.categorySlug }
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

// ─── Page title ───────────────────────────────────────────────────────────────
const pageTitle = computed(() => {
  if (selectedCategories.value.length === 1) {
    const cat = categoriesStore.categories.find((c) => c.slug === selectedCategories.value[0])
    return cat?.name ?? 'Каталог'
  }
  return 'Каталог'
})
</script>

<template>
  <div class="catalog container">
    <div class="catalog__head">
      <TheTitle tag="h1">{{ pageTitle }}</TheTitle>
      <button class="catalog__filter-btn" type="button" @click="isMobileFiltersOpen = true">
        ⚙ Фильтры
      </button>
    </div>

    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div
        v-if="isMobileFiltersOpen"
        class="catalog__backdrop"
        @click="isMobileFiltersOpen = false"
      />
    </Transition>

    <div class="catalog__layout">
      <CatalogFilters
        :model-value="activeFilters"
        :is-open="isMobileFiltersOpen"
        :price-presets="PRICE_PRESETS"
        @update:model-value="onFiltersUpdate"
        @close="isMobileFiltersOpen = false"
      />

      <div class="catalog__main">
        <div class="catalog__toolbar-row">
          <CatalogChips :chips="activeChips" @remove="removeChip" @clear-all="clearAllFilters" />
          <CatalogToolbar
            :sort="sortKey"
            :per-page="perPage"
            @update:sort="onSortUpdate"
            @update:per-page="onPerPageUpdate"
          />
        </div>

        <div v-if="productsStore.loading" class="catalog__grid">
          <TheProductCard v-for="n in perPage" :key="n" :loading="true" />
        </div>

        <div v-else-if="productsStore.products.length" class="catalog__grid">
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

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  &__filter-btn {
    display: none;
    padding: 8px 16px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-100;
    }

    @media (max-width: 1024px) {
      display: flex;
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
    gap: 16px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__empty {
    padding: 48px;
    text-align: center;
    color: $color-gray-400;
    font-size: $font-size-lg;
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
</style>
