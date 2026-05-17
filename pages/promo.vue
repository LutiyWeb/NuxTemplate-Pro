<script setup lang="ts">
useHead({ title: 'Акции — Nexus Commerce' })

const store = useProductsStore()

onMounted(() => { store.fetchProducts({ limit: 40 }) })

const PROMO_BANNERS = [
  { gradient: 'linear-gradient(135deg, rgb(79 70 229) 0%, rgb(55 48 163) 100%)', title: 'до -40%', subtitle: 'на смартфоны и планшеты' },
  { gradient: 'linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)', title: 'до -35%', subtitle: 'на ноутбуки и технику' },
  { gradient: 'linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%)', title: 'до -25%', subtitle: 'на аудио и аксессуары' },
]

// Row A = 5 cards | Row B = horizontal span-2 + 3 cards, alternating left/right
const rows = computed(() => {
  const products = store.products
  const result: Array<{ type: 'A' | 'B'; items: typeof products; bIndex?: number }> = []
  let i = 0
  let rowIndex = 0
  let bIndex = 0
  while (i < products.length) {
    if (rowIndex % 2 === 0) {
      result.push({ type: 'A', items: products.slice(i, i + 5) })
      i += 5
    } else {
      result.push({ type: 'B', items: products.slice(i, i + 4), bIndex: bIndex++ })
      i += 4
    }
    rowIndex++
  }
  return result
})
</script>

<template>
  <div class="promo-page">
    <div class="container">
      <TheTitle tag="h1" size="l" class="promo-page__title">Акции и скидки</TheTitle>

      <div class="promo-page__banners grid-col-3">
        <PromoBannerCard
          v-for="(b, i) in PROMO_BANNERS"
          :key="i"
          :gradient="b.gradient"
          :title="b.title"
          :subtitle="b.subtitle"
        />
      </div>

      <div v-if="store.loading" class="promo-page__skeleton">
        <TheProductCard v-for="n in 10" :key="n" :loading="true" />
      </div>

      <div v-else class="promo-page__grid">
        <template v-for="(row, ri) in rows" :key="ri">
          <div v-if="row.type === 'A'" class="promo-page__row promo-page__row--a">
            <TheProductCard v-for="p in row.items" :key="p.id" :product="p" />
          </div>
          <div v-else class="promo-page__row promo-page__row--b">
            <!-- Even bIndex: featured LEFT -->
            <template v-if="row.bIndex! % 2 === 0">
              <NuxtLink :to="`/product/${row.items[0].id}`" class="promo-page__featured">
                <TheCardHorizontal
                  :image="row.items[0].thumbnail ?? undefined"
                  :title="row.items[0].title"
                  :description="row.items[0].description"
                  :badge="row.items[0].category ?? undefined"
                />
              </NuxtLink>
              <TheProductCard v-for="p in row.items.slice(1)" :key="p.id" :product="p" />
            </template>
            <!-- Odd bIndex: featured RIGHT, image mirrored -->
            <template v-else>
              <TheProductCard v-for="p in row.items.slice(1)" :key="p.id" :product="p" />
              <NuxtLink :to="`/product/${row.items[0].id}`" class="promo-page__featured">
                <TheCardHorizontal
                  :image="row.items[0].thumbnail ?? undefined"
                  :title="row.items[0].title"
                  :description="row.items[0].description"
                  :badge="row.items[0].category ?? undefined"
                  image-right
                />
              </NuxtLink>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.promo-page {
  padding-block: 32px;

  &__title { margin-bottom: 32px; }

  &__banners {
    margin-bottom: 48px;
  }

  &__skeleton {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  &__grid { display: flex; flex-direction: column; gap: 12px; }

  &__row {
    display: grid;
    gap: 12px;

    &--a { grid-template-columns: repeat(5, 1fr); }
    &--b { grid-template-columns: repeat(5, 1fr); }

    @media (max-width: 1024px) {
      &--a { grid-template-columns: repeat(3, 1fr); }
      &--b { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 640px) {
      &--a, &--b { grid-template-columns: repeat(2, 1fr); }
    }
  }

  &__featured {
    grid-column: span 2;
    display: block;

    .card-horizontal { height: 100%; }

    @media (max-width: 640px) { grid-column: span 2; }
  }
}
</style>
