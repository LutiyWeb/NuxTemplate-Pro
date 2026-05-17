<script setup lang="ts">
useHead({ title: 'Каталог — Nexus Commerce' })

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const isMobileFiltersOpen = ref(false)

// Нормализуем categories из URL (поддерживаем и ?categorySlug= для навигации из риббона)
const selectedCategories = computed<string[]>(() => {
  const cats = route.query.categories
  const legacy = route.query.categorySlug as string | undefined
  const arr: string[] = cats ? (Array.isArray(cats) ? [...cats as string[]] : [cats as string]) : []
  if (legacy && !arr.includes(legacy)) arr.push(legacy)
  return arr
})

const currentPage = computed(() => Number(route.query.page ?? 1))
const perPage = computed(() => Number(route.query.limit ?? 20))
const sortKey = computed(() => (route.query.sortBy as string) ?? 'newest')

const activeFilters = computed(() => ({
  categories: selectedCategories.value,
  priceMin: route.query.priceMin ? Number(route.query.priceMin) : 0,
  priceMax: route.query.priceMax ? Number(route.query.priceMax) : 999999,
}))

watch(
  () => route.query,
  () => {
    productsStore.fetchProducts({
      page: currentPage.value,
      limit: perPage.value,
      categories: selectedCategories.value.length ? selectedCategories.value : undefined,
      priceMin: activeFilters.value.priceMin > 0 ? activeFilters.value.priceMin : undefined,
      priceMax: activeFilters.value.priceMax < 999999 ? activeFilters.value.priceMax : undefined,
      sortBy: sortKey.value,
    })
  },
  { immediate: true, deep: true },
)

onMounted(() => { categoriesStore.fetchCategories() })

function onFiltersUpdate(filters: { categories: string[]; priceMin: number; priceMax: number }) {
  const query: Record<string, string | string[]> = { ...route.query as Record<string, string> }
  delete query.categorySlug
  delete query.page
  if (filters.categories.length) query.categories = filters.categories
  else delete query.categories
  if (filters.priceMin > 0) query.priceMin = String(filters.priceMin)
  else delete query.priceMin
  if (filters.priceMax < 999999) query.priceMax = String(filters.priceMax)
  else delete query.priceMax
  router.push({ query })
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

const pageTitle = computed(() => {
  if (!selectedCategories.value.length) return 'Каталог'
  if (selectedCategories.value.length === 1) {
    const cat = categoriesStore.categories.find((c) => c.slug === selectedCategories.value[0])
    return cat ? cat.name : 'Каталог'
  }
  return 'Каталог'
})
</script>

<template>
  <div class="catalog-page container">
    <div class="catalog-page__head">
      <TheTitle tag="h1">{{ pageTitle }}</TheTitle>
      <button
        class="catalog-page__filter-btn"
        type="button"
        @click="isMobileFiltersOpen = true"
      >⚙ Фильтры</button>
    </div>

    <div class="catalog-page__layout">
      <CatalogFilters
        :model-value="activeFilters"
        :is-open="isMobileFiltersOpen"
        @update:model-value="onFiltersUpdate"
        @close="isMobileFiltersOpen = false"
      />

      <div class="catalog-page__main">
        <CatalogToolbar
          :sort="sortKey"
          :per-page="perPage"
          @update:sort="onSortUpdate"
          @update:per-page="onPerPageUpdate"
        />

        <div v-if="productsStore.loading" class="catalog-page__grid">
          <TheProductCard v-for="n in perPage" :key="n" :loading="true" />
        </div>

        <div v-else-if="productsStore.products.length" class="catalog-page__grid">
          <TheProductCard
            v-for="product in productsStore.products"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-else class="catalog-page__empty">
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
.catalog-page {
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

    &:hover { background: $color-gray-100; }

    @media (max-width: 1024px) { display: flex; }
  }

  &__layout {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  &__main { flex: 1; min-width: 0; }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
    @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
  }

  &__empty {
    padding: 48px;
    text-align: center;
    color: $color-gray-400;
    font-size: $font-size-lg;
  }
}
</style>
