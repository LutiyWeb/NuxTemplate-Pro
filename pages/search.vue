<script setup lang="ts">
import type { Product } from '~/types/product'

useHead({ title: 'Поиск — Nexus Commerce' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const LIMIT = 20

const q = computed(() => (route.query.q as string) || '')
const page = computed(() => Number(route.query.page) || 1)

const products = ref<Product[]>([])
const meta = ref({ page: 1, limit: LIMIT, total: 0, totalPages: 1 })
const loading = ref(false)

async function fetchResults() {
  if (!q.value) return
  loading.value = true
  try {
    const res = await $fetch<{ data: Product[]; meta: typeof meta.value }>(
      `${config.public.apiBase}/api/search`,
      { query: { q: q.value, page: page.value, limit: LIMIT } },
    )
    products.value = res.data
    meta.value = res.meta
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

watch([q, page], fetchResults, { immediate: true })

function onPageChange(p: number) {
  router.push({ query: { ...route.query, page: p } })
}
</script>

<template>
  <div class="search-page container">
    <TheTitle tag="h1" size="m">
      {{ q ? `Результаты: "${q}"` : 'Поиск' }}
    </TheTitle>

    <p v-if="q && !loading" class="search-page__count">
      Найдено: {{ meta.total }} товаров
    </p>

    <div v-if="loading" class="search-page__grid">
      <TheProductCard v-for="n in LIMIT" :key="n" :loading="true" />
    </div>

    <template v-else-if="products.length">
      <div class="search-page__grid">
        <TheProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>

      <CatalogPagination
        v-if="meta.totalPages > 1"
        :page="meta.page"
        :total-pages="meta.totalPages"
        @update:page="onPageChange"
      />
    </template>

    <p v-else-if="q" class="search-page__empty">Ничего не найдено. Попробуйте другой запрос.</p>
  </div>
</template>

<style lang="scss">
.search-page {
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__count {
    color: $color-gray-500;
    font-size: $font-size-sm;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
    @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
  }

  &__empty {
    color: $color-gray-400;
    font-size: $font-size-lg;
  }
}
</style>
