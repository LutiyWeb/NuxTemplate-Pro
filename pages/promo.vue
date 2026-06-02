<script setup lang="ts">
import { ArrowDownRight } from 'lucide-vue-next'

useHead({ title: 'Акції — Nexus Commerce' })

const store = useProductsStore()
const { isMd } = useBreakpoints()

onMounted(() => {
  store.fetchProducts({ limit: 30 })
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
const viewMode = ref<'bento' | 'grid'>('bento')

// ─── Sections ────────────────────────────────────────────────────────────────
// Each section: 1 banner (2×2) + 2 tall cards + 7 sm cards + 1 CTA card
// bannerSide: 'left' → [banner][tall][tall], 'right' → [tall][tall][banner]

interface PromoSection {
  banner: {
    bg: string
    title: string
    subtitle: string
    to: string
    video?: string
    image?: string
  }
  bannerSide: 'left' | 'right'
  ctaTo: string
}

const SECTIONS: PromoSection[] = [
  {
    banner: {
      bg: 'rgb(79 70 229)',
      title: 'до -40%',
      subtitle: 'на смартфони та планшети',
      to: '/catalog',
      video: 'https://vjs.zencdn.net/v/oceans.mp4',
      image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&q=80',
    },
    bannerSide: 'left',
    ctaTo: '/catalog?label=sale',
  },
  {
    banner: {
      bg: 'rgb(30 41 59)',
      title: 'до -35%',
      subtitle: 'на ноутбуки та техніку',
      to: '/catalog',
      video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    },
    bannerSide: 'right',
    ctaTo: '/catalog?label=sale',
  },
  {
    banner: {
      bg: 'rgb(6 182 212)',
      title: 'до -25%',
      subtitle: 'на аудіо та аксесуари',
      to: '/catalog',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    },
    bannerSide: 'left',
    ctaTo: '/catalog?label=sale',
  },
]

// 9 products per section (2 tall + 7 sm)
const PRODUCTS_PER_SECTION = 10

const bentoSections = computed(() =>
  SECTIONS.map((section, i) => ({
    ...section,
    tall: store.products.slice(i * PRODUCTS_PER_SECTION, i * PRODUCTS_PER_SECTION + 2),
    sm: store.products.slice(i * PRODUCTS_PER_SECTION + 2, i * PRODUCTS_PER_SECTION + 9),
    ctaImage: store.products[i * PRODUCTS_PER_SECTION + 9]?.thumbnail ?? null,
  })),
)
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
        <!-- Mobile -->
        <div v-if="!isMd" class="promo-page__flat">
          <TheProductCard v-for="p in store.products" :key="p.id" :product="p" />
        </div>

        <!-- Desktop -->
        <div v-else>
          <div class="promo-page__toolbar">
            <button
              :class="[
                'promo-page__view-btn',
                { 'promo-page__view-btn--active': viewMode === 'bento' },
              ]"
              type="button"
              @click="viewMode = 'bento'"
            >
              Bento
            </button>
            <button
              :class="[
                'promo-page__view-btn',
                { 'promo-page__view-btn--active': viewMode === 'grid' },
              ]"
              type="button"
              @click="viewMode = 'grid'"
            >
              Сетка
            </button>
          </div>

          <!-- Bento: sections -->
          <div v-if="viewMode === 'bento'" class="promo-page__sections">
            <div v-for="(section, i) in bentoSections" :key="i" class="promo-section">
              <!-- Banner row: [banner][tall][tall] or [tall][tall][banner] -->
              <div class="promo-section__banner-row">
                <template v-if="section.bannerSide === 'left'">
                  <AppCategoryBanner
                    :bg="section.banner.bg"
                    :title="section.banner.title"
                    :subtitle="section.banner.subtitle"
                    :to="section.banner.to"
                    :video="section.banner.video"
                    :image="section.banner.image"
                    class="promo-section__banner"
                  />
                  <TheProductCard
                    v-for="p in section.tall"
                    :key="p.id"
                    :product="p"
                    class="promo-section__tall"
                  />
                </template>
                <template v-else>
                  <TheProductCard
                    v-for="p in section.tall"
                    :key="p.id"
                    :product="p"
                    class="promo-section__tall"
                  />
                  <AppCategoryBanner
                    :bg="section.banner.bg"
                    :title="section.banner.title"
                    :subtitle="section.banner.subtitle"
                    :to="section.banner.to"
                    :video="section.banner.video"
                    :image="section.banner.image"
                    class="promo-section__banner"
                  />
                </template>
              </div>

              <!-- SM cards row: gray bg, 7 products + 1 CTA -->
              <div class="promo-section__cards">
                <AppImageCard v-for="p in section.sm" :key="p.id" :product="p" />

                <!-- CTA card -->
                <NuxtLink :to="section.ctaTo" class="promo-section__cta">
                  <div
                    v-if="section.ctaImage"
                    class="promo-section__cta-bg"
                    :style="{ backgroundImage: `url(${section.ctaImage})` }"
                  />
                  <div class="promo-section__cta-overlay" />
                  <span class="promo-section__cta-label">
                    Смотреть всё
                    <ArrowDownRight :size="20" class="promo-section__cta-arrow" />
                  </span>
                </NuxtLink>
              </div>
            </div>
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
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

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

  &__sections {
    display: flex;
    flex-direction: column;
    gap: 48px;
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
}

// ─── Section ─────────────────────────────────────────────────────────────────
.promo-section {
  &__banner-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 220px;
    gap: 12px;
  }

  &__banner {
    grid-column: span 2;
    grid-row: span 2;
  }

  &__tall {
    grid-row: span 2;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 220px;
    gap: 12px;
    background: $color-gray-100;
    border-radius: 0;
    padding: 24px $container-padding;
    margin-inline: -#{$container-padding};

    @include mixins.respond-to(lg) {
      padding: 32px calc(#{$container-padding} * 2) 32px;
      margin-top: 48px;
      margin-inline: -#{$container-padding};
    }
  }

  &__cta {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 20px;
    border-radius: $radius-xl;
    overflow: hidden;
    text-decoration: none;
    color: $color-gray-700;
    gap: 8px;
    transition: transform $transition-base;

    &:hover {
      transform: translateY(-2px);

      .promo-section__cta-arrow {
        transform: translate(3px, 3px);
      }
    }
  }

  &__cta-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;
    transition: transform $transition-slow;

    .promo-section__cta:hover & {
      transform: scale(1.05);
    }
  }

  &__cta-overlay {
    position: absolute;
    inset: 0;
    background: rgb(255 255 255 / 75%);
    z-index: 1;
  }

  &__cta-label {
    position: relative;
    z-index: 2;
    display: flex;
    column-gap: 2px;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    line-height: 1.3;
    white-space: nowrap;
  }

  &__cta-arrow {
    position: relative;
    z-index: 2;
    color: $color-gray-600;
    flex-shrink: 0;
    transition: transform $transition-fast;
  }
}
</style>
