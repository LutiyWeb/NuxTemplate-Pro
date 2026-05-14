<script setup lang="ts">
useHead({ title: 'Поиск — Nexus Commerce' })

const route = useRoute()
const store = useProductsStore()
const query = computed(() => route.query.q as string || '')

watch(query, async (q) => {
  if (q) await store.fetchProducts({ limit: 40 })
}, { immediate: true })

const results = computed(() => {
  if (!query.value) return []
  const q = query.value.toLowerCase()
  return store.products.filter((p) =>
    p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
  )
})
</script>

<template>
  <div class="search-page container">
    <TheTitle tag="h1" size="m">
      {{ query ? `Результаты: "${query}"` : 'Поиск' }}
    </TheTitle>

    <p v-if="query" class="search-page__count">
      Найдено: {{ results.length }} товаров
    </p>

    <div v-if="store.loading" class="search-page__grid">
      <TheProductCard v-for="n in 8" :key="n" :loading="true" />
    </div>

    <div v-else-if="results.length" class="search-page__grid">
      <TheProductCard v-for="p in results" :key="p.id" :product="p" />
    </div>

    <p v-else-if="query" class="search-page__empty">Ничего не найдено. Попробуйте другой запрос.</p>
  </div>
</template>

<style lang="scss">
.search-page {
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__count { color: $color-gray-500; font-size: $font-size-sm; margin: 0; }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
    @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
  }

  &__empty { color: $color-gray-400; font-size: $font-size-lg; }
}
</style>
