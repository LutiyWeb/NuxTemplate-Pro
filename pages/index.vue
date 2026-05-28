<script setup lang="ts">
import { POPULAR_CARDS, ARTICLES_CARDS } from '~/data/landingCards'
import type { LandingCard } from '~/data/landingCards'
import { CARD_GAP } from '~/constants/layout'

useHead({ title: 'Nexus Commerce — Главная' })

const store = useProductsStore()
const categoriesStore = useCategoriesStore()
const { isMd } = useBreakpoints()

onMounted(() => {
  store.fetchProducts({ limit: 20 })
  categoriesStore.fetchCategories()
})

const HERO_GRADIENTS = [
  'linear-gradient(135deg, rgb(79 70 229) 0%, rgb(55 48 163) 100%)',
  'linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%)',
  'linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)',
]

const heroSlides = computed(() =>
  categoriesStore.categories.map((cat, i) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    bg: HERO_GRADIENTS[i % HERO_GRADIENTS.length],
  })),
)

const featuredProducts = computed(() => store.products.slice(0, 12))
const newProducts = computed(() => store.products.slice(12, 20))
const skeletons = Array.from({ length: 5 })
const skeletonsSmall = Array.from({ length: 8 })

const productBreakpoints = {
  0: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
}

const PROMO_BANNERS = [
  {
    gradient: 'linear-gradient(135deg, rgb(79 70 229) 0%, rgb(55 48 163) 100%)',
    title: 'до -40%',
    subtitle: 'на смартфоны и планшеты',
  },
  {
    gradient: 'linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)',
    title: 'до -35%',
    subtitle: 'на ноутбуки и технику',
  },
  {
    gradient: 'linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%)',
    title: 'до -25%',
    subtitle: 'на аудио и аксессуары',
  },
]
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="py-13">
      <div class="container">
        <AppSlider :slides="heroSlides" :loop="true" :autoplay="true" :autoplay-delay="4000">
          <template #default="slotProps">
            <NuxtLink
              v-if="slotProps?.slide"
              :to="`/catalog?categorySlug=${(slotProps.slide as any).slug}`"
              class="hero-slide"
              :style="{ background: (slotProps.slide as any).bg }"
            >
              <h1 class="hero-slide__title">{{ (slotProps.slide as any).name }}</h1>
              <p class="hero-slide__sub">Смотрите лучшие товары в этой категории</p>
              <span class="hero-slide__cta">Перейти в каталог</span>
            </NuxtLink>
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
    <section class="py-13">
      <div class="container">
        <div class="grid-col-3">
          <PromoBannerCard
            v-for="(b, i) in PROMO_BANNERS"
            :key="i"
            :gradient="b.gradient"
            :title="b.title"
            :subtitle="b.subtitle"
          />
        </div>
      </div>
    </section>

    <!-- Popular templates -->
    <section class="py-13">
      <div class="container">
        <AppSlider
          :slides="POPULAR_CARDS"
          :space-between="CARD_GAP"
          title="Популярные шаблоны"
          link-label="Смотреть все"
          link-to="/catalog"
          :link-count="POPULAR_CARDS.length"
          :breakpoints="{ 0: { slidesPerView: 1 }, 1024: { slidesPerView: 2 } }"
        >
          <template #default="slotProps">
            <TheCardHorizontal
              v-if="slotProps?.slide"
              :title="slotProps.slide.title as string"
              :description="slotProps.slide.description as string"
              :badge="slotProps.slide.badge as string"
              :image-right="slotProps.slide.imageRight as boolean"
            />
          </template>
        </AppSlider>
      </div>
    </section>

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

    <!-- Banner primary -->
    <section class="py-13">
      <div class="container">
        <TheBanner variant="primary">
          <template #eyebrow>Special Offer</template>
          <TheTitle size="l" tag="h2" style="color: inherit"
            >Получи все Pro-шаблоны по одной цене</TheTitle
          >
          <p>Доступ ко всем премиум-шаблонам и будущим обновлениям по единой лицензии.</p>
          <template #actions>
            <AppButton variant="secondary" size="lg">Смотреть цены</AppButton>
            <AppButton variant="outline" size="lg" style="border-color: white; color: white"
              >Узнать больше</AppButton
            >
          </template>
        </TheBanner>
      </div>
    </section>

    <!-- Articles -->
    <section class="py-13">
      <div class="container">
        <AppSlider
          :slides="ARTICLES_CARDS"
          :space-between="CARD_GAP"
          title="Статьи и гайды"
          link-label="Смотреть все"
          link-to="/catalog"
          :link-count="ARTICLES_CARDS.length"
          :breakpoints="{ 0: { slidesPerView: 1 }, 1024: { slidesPerView: 2 } }"
        >
          <template #default="slotProps">
            <TheCardHorizontal
              v-if="slotProps?.slide"
              :title="slotProps.slide.title as string"
              :description="slotProps.slide.description as string"
              :badge="slotProps.slide.badge as string"
              :image-right="slotProps.slide.imageRight as boolean"
            />
          </template>
        </AppSlider>
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
          title="Новинки"
        >
          <template #default="slotProps">
            <TheProductCard v-if="slotProps?.slide" :product="slotProps.slide as any" />
          </template>
        </AppSlider>
      </div>
    </section>

    <!-- Banner dark -->
    <section class="py-13">
      <div class="container">
        <TheBanner variant="dark">
          <template #eyebrow>Open Source</template>
          <TheTitle size="l" tag="h2" style="color: inherit">Присоединяйся к сообществу</TheTitle>
          <p>Вноси правки, предлагай компоненты и делись проектами.</p>
          <template #actions>
            <AppButton variant="secondary" size="lg">GitHub</AppButton>
            <AppButton variant="outline" size="lg" style="border-color: white; color: white"
              >Документация</AppButton
            >
          </template>
        </TheBanner>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.home {
  --swiper-navigation-top-offset: calc(50% - 20px);

  padding-block: 13px;
  display: flex;
  flex-direction: column;
  gap: 0;

  &__skeleton-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    @include mixins.respond-to(lg) { grid-template-columns: repeat(3, 1fr); }
    @include mixins.respond-to(xl) { grid-template-columns: repeat(4, 1fr); }
    @include mixins.respond-to(2xl) { grid-template-columns: repeat(5, 1fr); }
  }
}

.hero-slide {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  width: 100%;
  min-height: 360px;
  padding: 40px 24px;
  border-radius: $radius-2xl;
  color: $color-white;
  text-decoration: none;

  @include mixins.respond-to(md) {
    min-height: 480px;
    padding: 64px;
  }

  &__title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    margin: 0;
  }
  &__sub {
    font-size: $font-size-lg;
    opacity: 0.85;
    margin: 0;
  }
  &__cta {
    display: inline-flex;
    padding: 12px 24px;
    background: $color-white;
    color: $color-primary;
    border-radius: $radius-md;
    font-weight: $font-weight-semibold;
    font-size: $font-size-base;
  }
}
</style>
