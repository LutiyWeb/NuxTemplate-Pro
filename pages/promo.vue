<script setup lang="ts">
useHead({ title: 'Акції — Nexus Commerce' })

const store = useProductsStore()
const { isMd } = useBreakpoints()

onMounted(() => {
  store.fetchProducts({ limit: 40 })
})

const PROMO_BANNERS = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg, rgb(79 70 229) 0%, rgb(55 48 163) 100%)',
    title: 'до -40%',
    subtitle: 'на смартфони і планшети',
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)',
    title: 'до -35%',
    subtitle: 'на ноутбуки і техніку',
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%)',
    title: 'до -25%',
    subtitle: 'на аудіо та аксесуари',
  },
]

const promoNeedsSlider = computed(() => !isMd.value || PROMO_BANNERS.length > 3)

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
      <TheTitle tag="h1" size="m" class="promo-page__title">Акції та знижки</TheTitle>

      <AppSlider
        v-if="promoNeedsSlider"
        :slides="PROMO_BANNERS"
        :space-between="16"
        :breakpoints="{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 3 } }"
        class="promo-page__slider"
      >
        <template #default="slotProps">
          <PromoBannerCard
            v-if="slotProps?.slide"
            :gradient="(slotProps.slide as any).gradient"
            :title="(slotProps.slide as any).title"
            :subtitle="(slotProps.slide as any).subtitle"
          />
        </template>
      </AppSlider>

      <div v-else class="promo-page__banners grid-col-3">
        <PromoBannerCard
          v-for="b in PROMO_BANNERS"
          :key="b.id"
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

  &__title {
    margin-bottom: 32px;
  }

  &__banners {
    margin-bottom: 48px;
  }

  &__skeleton {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__row {
    display: grid;
    gap: 12px;

    &--a,
    &--b {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mixins.respond-to(sm) {
      &--a {
        grid-template-columns: repeat(3, 1fr);
      }
      &--b {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @include mixins.respond-to(lg) {
      &--a {
        grid-template-columns: repeat(5, 1fr);
      }
      &--b {
        grid-template-columns: repeat(5, 1fr);
      }
    }
  }

  &__featured {
    display: block;

    @include mixins.respond-to(lg) {
      grid-column: span 2;
    }

    .card-horizontal {
      height: 100%;
    }
  }
}
</style>
