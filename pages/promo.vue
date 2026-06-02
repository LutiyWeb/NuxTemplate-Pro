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

// ─── View mode toggle ─────────────────────────────────────────────────────────
const viewMode = ref<'bento' | 'grid'>('bento')

// ─── Bento layout ─────────────────────────────────────────────────────────────
// size: 'sm' = 1×1 | 'tall' = 1×2 (goes beside banner) | banner = 2×2
// Pattern: [banner][tall][tall] fills 4 cols × 2 rows, then sm cards follow

type BentoSlot =
  | { type: 'product'; size: 'sm' | 'tall' }
  | { type: 'banner'; bg: string; title: string; subtitle: string; to: string }

const BENTO_LAYOUT: BentoSlot[] = [
  // Pattern A — banner left
  { type: 'banner', bg: 'rgb(79 70 229)', title: 'до -40%', subtitle: 'на смартфони та планшети', to: '/catalog' },
  { type: 'product', size: 'tall' },
  { type: 'product', size: 'tall' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  // Pattern B — banner right
  { type: 'product', size: 'tall' },
  { type: 'product', size: 'tall' },
  { type: 'banner', bg: 'rgb(30 41 59)', title: 'до -35%', subtitle: 'на ноутбуки та техніку', to: '/catalog' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  // Pattern A — banner left, third colour
  { type: 'banner', bg: 'rgb(6 182 212)', title: 'до -25%', subtitle: 'на аудіо та аксесуари', to: '/catalog' },
  { type: 'product', size: 'tall' },
  { type: 'product', size: 'tall' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
  { type: 'product', size: 'sm' },
]

// Merge layout slots with real products
const bentoItems = computed(() => {
  let productIdx = 0
  return BENTO_LAYOUT.map(slot => {
    if (slot.type === 'banner') return slot
    const product = store.products[productIdx++]
    return product ? { ...slot, product } : null
  }).filter(Boolean)
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

      <template v-else>
        <!-- Mobile: flat 2-column grid -->
        <div v-if="!isMd" class="promo-page__flat">
          <TheProductCard v-for="p in store.products" :key="p.id" :product="p" />
        </div>

        <!-- Desktop: view toggle + grid -->
        <div v-else>
          <div class="promo-page__toolbar">
            <button
              :class="['promo-page__view-btn', { 'promo-page__view-btn--active': viewMode === 'bento' }]"
              type="button"
              @click="viewMode = 'bento'"
            >
              Bento
            </button>
            <button
              :class="['promo-page__view-btn', { 'promo-page__view-btn--active': viewMode === 'grid' }]"
              type="button"
              @click="viewMode = 'grid'"
            >
              Сетка
            </button>
          </div>

          <!-- Bento -->
          <div v-if="viewMode === 'bento'" class="promo-page__bento">
            <template v-for="(item, i) in bentoItems" :key="i">
              <AppCategoryBanner
                v-if="item.type === 'banner'"
                :bg="item.bg"
                :title="item.title"
                :subtitle="item.subtitle"
                :to="item.to"
                class="promo-page__bento-banner"
              />
              <TheProductCard
                v-else-if="item.type === 'product' && item.product && item.size === 'tall'"
                :product="item.product"
                class="promo-page__bento-tall"
              />
              <AppImageCard
                v-else-if="item.type === 'product' && item.product && item.size === 'sm'"
                :product="item.product"
              />
            </template>
          </div>

          <!-- Regular grid -->
          <div v-else class="promo-page__grid">
            <TheProductCard v-for="p in store.products" :key="p.id" :product="p" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  &__flat {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  &__toolbar {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  &__view-btn {
    padding: 6px 16px;
    border-radius: $radius-md;
    border: 1px solid $color-gray-200;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-500;
    background: $color-white;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      border-color: $color-gray-300;
      color: $color-gray-700;
    }

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: $color-white;
    }
  }

  &__bento {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 220px;
    grid-auto-flow: row dense;
    gap: 12px;

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__bento-banner {
    grid-column: span 2;
    grid-row: span 2;
  }

  &__bento-tall {
    grid-row: span 2;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
}
</style>
