<script setup lang="ts">
import { CARD_GAP } from '~/constants/layout'

useHead({ title: 'Nexus Commerce — Главная' })

interface MainBanner {
  id: number
  title: string
  description: string | null
  media_url: string
  media_type: 'image' | 'video'
  link_url: string | null
  sort_order: number
}

interface SpecialBanner {
  title: string
  description?: string
  image_url: string
  link_url: string | null
}

interface BannersResponse {
  data: {
    main_banner: MainBanner[]
    special_banners: {
      special_1: SpecialBanner | null
      special_2: SpecialBanner | null
    }
  }
}

const config = useRuntimeConfig()
const store = useProductsStore()
const categoriesStore = useCategoriesStore()
const { isMd } = useBreakpoints()

const { data: bannersData } = useFetch<BannersResponse>('/api/banners', {
  baseURL: config.public.apiBase,
})

onMounted(() => {
  store.fetchProducts({ limit: 20 })
  categoriesStore.fetchCategories()
})

const FALLBACK_MAIN: MainBanner[] = [
  {
    id: 1,
    title: 'Beats Studio Pro',
    description: 'Преміальний звук та активне шумоподавлення. Бездротова свобода до 40 годин.',
    media_url: '/banners/test-headphones.png',
    media_type: 'image',
    link_url: '/catalog',
    sort_order: 1,
  },
]

const FALLBACK_SPECIAL_1: SpecialBanner = {
  title: 'Навушники тижня',
  description: 'Бездротовий звук преміум-класу з активним шумоподавленням та до 40 годин автономності.',
  image_url: '/banners/test-headphones.png',
  link_url: '/catalog',
}

const FALLBACK_SPECIAL_2: SpecialBanner = {
  title: 'Хіт сезону',
  description: 'Найпопулярніша модель серед наших покупців. Обмежена кількість за спеціальною ціною.',
  image_url: '/banners/test-headphones.png',
  link_url: '/catalog',
}

const heroSlides = computed(() => {
  const fromApi = bannersData.value?.data?.main_banner ?? []
  return fromApi.length ? fromApi : FALLBACK_MAIN
})
const special1 = computed(
  () => bannersData.value?.data?.special_banners?.special_1 ?? FALLBACK_SPECIAL_1,
)
const special2 = computed(
  () => bannersData.value?.data?.special_banners?.special_2 ?? FALLBACK_SPECIAL_2,
)

const featuredProducts = computed(() => {
  const products = store.products.slice(0, 12)
  // TODO: remove — test out-of-stock state
  if (products.length) return [{ ...products[0], stock: 0 }, ...products.slice(1)]
  return products
})
const popularProducts = computed(() => store.products.slice(0, 10))
const newProducts = computed(() => store.products.slice(12, 20))
const skeletons = Array.from({ length: 5 })
const skeletonsSmall = Array.from({ length: 8 })

const productBreakpoints = {
  0: { slidesPerView: 1.5 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
}

const PROMO_BANNERS = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg, rgb(79 70 229) 0%, rgb(55 48 163) 100%)',
    title: 'до -40%',
    subtitle: 'на смартфоны и планшеты',
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)',
    title: 'до -35%',
    subtitle: 'на ноутбуки и технику',
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%)',
    title: 'до -25%',
    subtitle: 'на аудио и аксессуары',
  },
]

const promoBannerBreakpoints = {
  0: { slidesPerView: 1 },
  768: { slidesPerView: 3 },
}

const promoNeedsSlider = computed(() => !isMd.value || PROMO_BANNERS.length > 3)

const PROMO_TILES_CONFIG = [
  {
    id: 1,
    label: "Комп'ютери",
    gradient: 'linear-gradient(135deg, rgb(79 70 229) 0%, rgb(55 48 163) 100%)',
    to: '/catalog',
  },
  {
    id: 2,
    label: 'Ноутбуки',
    gradient: 'linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%)',
    to: '/catalog',
  },
  {
    id: 3,
    label: 'Навушники',
    gradient: 'linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)',
    to: '/catalog',
  },
  {
    id: 4,
    label: 'Смартфони',
    gradient: 'linear-gradient(135deg, rgb(124 58 237) 0%, rgb(91 33 182) 100%)',
    to: '/catalog',
  },
  {
    id: 5,
    label: 'Аксесуари',
    gradient: 'linear-gradient(135deg, rgb(5 150 105) 0%, rgb(4 120 87) 100%)',
    to: '/catalog',
  },
]

const promoTiles = computed(() =>
  PROMO_TILES_CONFIG.map((tile, i) => ({
    ...tile,
    image: store.products[5 + i]?.thumbnail ?? '',
  })),
)
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="py-13">
      <div class="container">
        <AppSlider
          :slides="heroSlides"
          :loop="true"
          swiper-class="swiper-nav-image"
        >
          <template #default="slotProps">
            <HeroBanner
              v-if="slotProps?.slide"
              :title="(slotProps.slide as MainBanner).title"
              :description="(slotProps.slide as MainBanner).description"
              :media-url="(slotProps.slide as MainBanner).media_url"
              :media-type="(slotProps.slide as MainBanner).media_type"
              :link-url="(slotProps.slide as MainBanner).link_url"
            />
          </template>
        </AppSlider>
      </div>
    </section>

    <!-- Category Ribbon -->
    <section class="py-13">
      <div class="container">
        <CategoryRibbon />
      </div>
    </section>

    <!-- Promo banners -->
    <!-- <section class="py-13">
      <div class="container">
        <AppSlider
          v-if="promoNeedsSlider"
          :slides="PROMO_BANNERS"
          :space-between="CARD_GAP"
          :breakpoints="promoBannerBreakpoints"
          title="Акції"
          link-label="Всі акції"
          link-to="/promo"
          :link-count="PROMO_BANNERS.length"
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

        <template v-else>
          <div class="home__promo-header">
            <h2 class="home__promo-title">Акції</h2>
            <NuxtLink to="/promo" class="home__promo-link">
              Всі акції ({{ PROMO_BANNERS.length }})
            </NuxtLink>
          </div>
          <div class="grid-col-3">
            <PromoBannerCard
              v-for="b in PROMO_BANNERS"
              :key="b.id"
              :gradient="b.gradient"
              :title="b.title"
              :subtitle="b.subtitle"
            />
          </div>
        </template>
      </div>
    </section> -->

    <!-- All products -->
    <section class="py-13">
      <div class="container">
        <div v-if="store.loading" class="home__skeleton-row">
          <TheProductCard v-for="(_, i) in skeletons" :key="i" :loading="true" />
        </div>
        <AppSlider
          v-else
          :slides="featuredProducts"
          :space-between="CARD_GAP"
          :breakpoints="productBreakpoints"
          :peek="true"
          title="Все продукты"
          link-label="Смотреть все"
          link-to="/catalog"
          :link-count="store.meta.total"
        >
          <template #default="slotProps">
            <TheProductCard v-if="slotProps?.slide" :product="slotProps.slide as any" />
          </template>
        </AppSlider>
      </div>
    </section>

    <!-- Promo image tiles -->
    <section class="py-13">
      <div class="container">
        <div class="home__tiles-header">
          <h2 class="home__tiles-title">Гарячі пропозиції</h2>
        </div>
        <div v-if="store.loading" class="home__tiles-grid">
          <AppSkeleton
            v-for="n in 5"
            :key="n"
            height="100%"
            border-radius="12px"
            class="home__tile-skeleton"
          />
        </div>
        <div v-else class="home__tiles-grid">
          <PromoImageTile
            v-for="tile in promoTiles"
            :key="tile.id"
            :image="tile.image"
            :label="tile.label"
            :gradient="tile.gradient"
            :to="tile.to"
          />
        </div>
      </div>
    </section>

    <!-- Popular products -->
    <section class="py-13">
      <div class="container">
        <div v-if="store.loading" class="home__skeleton-row">
          <TheProductCard v-for="(_, i) in skeletons" :key="i" :loading="true" />
        </div>
        <AppSlider
          v-else
          :slides="popularProducts"
          :space-between="CARD_GAP"
          :breakpoints="productBreakpoints"
          :peek="true"
          title="Хіти продажів"
          link-label="Дивитись всі"
          link-to="/catalog"
          :link-count="store.meta.total"
        >
          <template #default="slotProps">
            <TheProductCard v-if="slotProps?.slide" :product="slotProps.slide as any" />
          </template>
        </AppSlider>
      </div>
    </section>

    <!-- Banner special_1 -->
    <section v-if="special1" class="py-13">
      <div class="container">
        <SpecialBanner
          :title="special1.title"
          :description="special1.description"
          :image-url="special1.image_url"
          :link-url="special1.link_url"
        />
      </div>
    </section>

    <!-- New products -->
    <section class="py-13">
      <div class="container">
        <div v-if="store.loading" class="home__skeleton-row">
          <TheProductCard v-for="(_, i) in skeletonsSmall" :key="i" :loading="true" />
        </div>
        <AppSlider
          v-else
          :slides="newProducts"
          :space-between="CARD_GAP"
          :breakpoints="productBreakpoints"
          :peek="true"
          title="Новинки"
        >
          <template #default="slotProps">
            <TheProductCard v-if="slotProps?.slide" :product="slotProps.slide as any" />
          </template>
        </AppSlider>
      </div>
    </section>

    <!-- Banner special_2 -->
    <section v-if="special2" class="py-13">
      <div class="container">
        <SpecialBanner
          :title="special2.title"
          :description="special2.description"
          :image-url="special2.image_url"
          :link-url="special2.link_url"
          :reverse="true"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.swiper:not(.swiper-initialized) .swiper-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  border: 3px solid red;
}

.swiper:not(.swiper-initialized) .swiper-slide {
  flex-shrink: 0;
  width: 85%;
}
.home {
  --swiper-navigation-top-offset: calc(50% - 20px);

  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;

  &__promo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__promo-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__promo-link {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-primary;
    transition: color $transition-fast;

    &:hover {
      color: $color-primary-dark;
    }
  }

  &__tiles-header {
    margin-bottom: 12px;
  }

  &__tiles-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;

    @include mixins.respond-to(md) {
      font-size: $font-size-2xl;
    }
  }

  &__tiles-grid {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-block: 12px;
    margin-block: -12px;

    &::-webkit-scrollbar {
      display: none;
    }

    > * {
      flex: 0 0 260px;

      @include mixins.respond-to(md) {
        flex: 0 0 300px;
      }
    }

    @include mixins.respond-to(xl) {
      overflow: visible;

      > * {
        flex: 1 1 0;
      }
    }
  }

  &__tile-skeleton {
    aspect-ratio: 4 / 2;
  }

  &__skeleton-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(3, 1fr);
    }
    @include mixins.respond-to(xl) {
      grid-template-columns: repeat(4, 1fr);
    }
    @include mixins.respond-to(2xl) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
}

</style>
