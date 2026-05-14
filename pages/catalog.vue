<script setup lang="ts">
useHead({ title: 'Каталог — Nexus Commerce' })

const route = useRoute()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const currentPage = ref(1)
const perPage = ref(20)
const sortKey = ref('newest')
const activeFilters = ref({ categories: [] as string[], priceMin: 0, priceMax: 999999 })
const isMobileFiltersOpen = ref(false)

const categorySlug = computed(() => route.query.categorySlug as string | undefined)

watch([categorySlug, perPage], () => { currentPage.value = 1 })

watch([categorySlug, currentPage, perPage], () => {
  productsStore.fetchProducts({
    page: currentPage.value,
    limit: perPage.value,
    categorySlug: categorySlug.value,
  })
}, { immediate: true })

onMounted(() => { categoriesStore.fetchCategories() })

const displayedProducts = computed(() => {
  let list = [...productsStore.products]
  if (activeFilters.value.categories.length) {
    list = list.filter((p) => p.categorySlug && activeFilters.value.categories.includes(p.categorySlug))
  }
  list = list.filter((p) => {
    const price = p.price ?? 0
    return price >= activeFilters.value.priceMin && price <= activeFilters.value.priceMax
  })
  if (sortKey.value === 'price_asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
  if (sortKey.value === 'price_desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
  if (sortKey.value === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return list
})

const pageTitle = computed(() => {
  if (!categorySlug.value) return 'Каталог'
  const cat = categoriesStore.categories.find((c) => c.slug === categorySlug.value)
  return cat ? cat.name : 'Каталог'
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
        v-model="activeFilters"
        :is-open="isMobileFiltersOpen"
        @close="isMobileFiltersOpen = false"
      />

      <div class="catalog-page__main">
        <CatalogToolbar
          v-model:sort="sortKey"
          v-model:per-page="perPage"
        />

        <div v-if="productsStore.loading" class="catalog-page__grid">
          <TheProductCard v-for="n in perPage" :key="n" :loading="true" />
        </div>

        <div v-else-if="displayedProducts.length" class="catalog-page__grid">
          <TheProductCard
            v-for="product in displayedProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-else class="catalog-page__empty">
          <p>Товары не найдены. Попробуйте изменить фильтры.</p>
        </div>

        <CatalogPagination
          v-if="productsStore.meta.totalPages > 1"
          v-model:page="currentPage"
          :total-pages="productsStore.meta.totalPages"
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
