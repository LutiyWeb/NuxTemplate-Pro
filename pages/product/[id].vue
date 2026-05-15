<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Heart, ShoppingCart, Minus, Plus, Share2, Star, Package, Shield, Truck } from 'lucide-vue-next'
import type { Product } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

const config = useRuntimeConfig()

const { data: productData, pending, error } = useAsyncData(
  () => `product-${route.params.id}`,
  () => $fetch<{ data: Product }>(`${config.public.apiBase}/api/products/${route.params.id}`)
)

const product = computed(() => productData.value?.data ?? null)
const loading = computed(() => pending.value)

useSeoMeta({
  title: () => product.value ? `${product.value.title} — Nexus Commerce` : 'Товар',
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.title ?? '',
  ogDescription: () => product.value?.description ?? '',
  ogImage: () => product.value?.thumbnail ?? '',
})

const thumbsSwiper = ref<SwiperType | null>(null)
const qty = ref(1)

const allImages = computed(() => {
  const p = product.value
  if (!p) return []
  return [p.thumbnail, ...p.images].filter(Boolean) as string[]
})

const isFav = computed(() => product.value ? favoritesStore.has(product.value.id) : false)

const originalPrice = computed(() => {
  const p = product.value
  if (!p?.price || !p.discountPercentage) return null
  return Math.round(p.price / (1 - p.discountPercentage / 100))
})

const mockSpecs = computed(() => [
  { label: 'Бренд', value: product.value?.brand ?? 'Не указан' },
  { label: 'Категория', value: product.value?.category ?? '—' },
  { label: 'Рейтинг', value: String(product.value?.rating ?? '—') },
  { label: 'В наличии', value: `${product.value?.stock ?? 0} шт.` },
  { label: 'Скидка', value: product.value?.discountPercentage ? `${Math.round(product.value.discountPercentage)}%` : 'Нет' },
  { label: 'Артикул', value: product.value?.sku ?? '—' },
  { label: 'Гарантия', value: '12 месяцев' },
])

function decrement() { if (qty.value > 1) qty.value-- }
function increment() { qty.value++ }

function addToCart() {
  if (product.value) {
    cartStore.add(product.value, qty.value)
    qty.value = 1
  }
}

function toggleFav() {
  if (!authStore.isLoggedIn) { uiStore.authModalOpen = true; return }
  if (product.value) favoritesStore.toggle(product.value.id)
}

onBeforeUnmount(() => { thumbsSwiper.value = null })
</script>

<template>
  <div class="pdp container">
    <AppBreadcrumbs
      :crumbs="[
        { label: 'Главная', to: '/' },
        { label: 'Каталог', to: '/catalog' },
        { label: product?.category ?? '...', to: product?.categorySlug ? `/catalog?categorySlug=${product.categorySlug}` : '/catalog' },
        { label: product?.title ?? '...' },
      ]"
      class="pdp__breadcrumbs"
    />

    <!-- Loading -->
    <div v-if="loading" class="pdp__layout">
      <div class="pdp__media">
        <Skeleton width="100%" height="420px" border-radius="16px" />
        <div class="pdp__thumbs-skeleton">
          <Skeleton v-for="n in 4" :key="n" width="72px" height="72px" border-radius="8px" />
        </div>
      </div>
      <div class="pdp__info">
        <Skeleton width="100px" height="14px" class="pdp__skel-gap" />
        <Skeleton width="80%" height="32px" class="pdp__skel-gap" />
        <Skeleton width="100%" height="14px" class="pdp__skel-gap" />
        <Skeleton width="90%" height="14px" class="pdp__skel-gap" />
        <Skeleton width="140px" height="40px" class="pdp__skel-gap" style="margin-top: 16px" />
        <Skeleton width="100%" height="56px" border-radius="12px" style="margin-top: 24px" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error || !product" class="pdp__error">
      <p>Не удалось загрузить товар. Попробуйте <button type="button" class="pdp__error-retry" @click="() => refreshNuxtData()">обновить страницу</button>.</p>
    </div>

    <!-- Content -->
    <div v-else-if="product" class="pdp__layout">
      <!-- Media -->
      <div class="pdp__media">
        <ClientOnly>
          <Swiper
            :modules="[Thumbs, Navigation]"
            :thumbs="{ swiper: thumbsSwiper }"
            navigation
            class="pdp__main-swiper"
          >
            <SwiperSlide v-for="(img, i) in allImages" :key="i">
              <img :src="img" :alt="product.title" class="pdp__main-img" />
            </SwiperSlide>
          </Swiper>

          <Swiper
            :modules="[Thumbs]"
            slides-per-view="auto"
            :space-between="8"
            watch-slides-progress
            class="pdp__thumbs"
            @swiper="thumbsSwiper = $event"
          >
            <SwiperSlide v-for="(img, i) in allImages" :key="i" class="pdp__thumb-slide">
              <img :src="img" :alt="`thumb ${i}`" class="pdp__thumb-img" />
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>

      <!-- Info  -->
      <div class="pdp__info">
        <NuxtLink
          v-if="product.categorySlug"
          :to="`/catalog?categorySlug=${product.categorySlug}`"
          class="pdp__category"
        >{{ product.category }}</NuxtLink>

        <div class="pdp__title-row">
          <h1 class="pdp__title">{{ product.title }}</h1>
          <button
            :class="['pdp__fav-btn', { 'pdp__fav-btn--active': isFav }]"
            type="button"
            :title="isFav ? 'Убрать из избранного' : 'В избранное'"
            @click="toggleFav"
          >
            <Heart :size="20" :fill="isFav ? 'currentColor' : 'none'" />
          </button>
        </div>

        <!-- Rating & meta -->
        <div class="pdp__meta">
          <span v-if="product.rating" class="pdp__rating">
            <Star :size="14" fill="currentColor" />
            {{ product.rating }}
          </span>
          <span v-if="product.brand" class="pdp__brand">{{ product.brand }}</span>
          <span
            :class="['pdp__stock', product.stock > 0 ? 'pdp__stock--in' : 'pdp__stock--out']"
          >{{ product.stock > 0 ? 'В наличии' : 'Нет в наличии' }}</span>
        </div>

        <p class="pdp__desc">{{ product.description }}</p>

        <!-- Price -->
        <div class="pdp__price-row">
          <span class="pdp__price">${{ product.price }}</span>
          <span v-if="originalPrice" class="pdp__price-original">${{ originalPrice }}</span>
          <span v-if="product.discountPercentage" class="pdp__discount">
            -{{ Math.round(product.discountPercentage) }}%
          </span>
        </div>

        <!-- Quantity + Add to cart -->
        <div class="pdp__purchase">
          <div class="pdp__qty">
            <button class="pdp__qty-btn" type="button" :disabled="qty <= 1" @click="decrement">
              <Minus :size="14" />
            </button>
            <span class="pdp__qty-val">{{ qty }}</span>
            <button class="pdp__qty-btn" type="button" @click="increment">
              <Plus :size="14" />
            </button>
          </div>
          <AppButton variant="primary" size="lg" class="pdp__add-btn" @click="addToCart">
            <ShoppingCart :size="18" /> Добавить в корзину
          </AppButton>
        </div>

        <AppButton variant="outline" size="lg" class="pdp__fav-full-btn" @click="toggleFav">
          <Heart :size="16" :fill="isFav ? 'currentColor' : 'none'" />
          {{ isFav ? 'В избранном' : 'В избранное' }}
        </AppButton>

        <!-- Perks -->
        <div class="pdp__perks">
          <div class="pdp__perk">
            <Truck :size="16" />
            <span>Бесплатная доставка от $50</span>
          </div>
          <div class="pdp__perk">
            <Shield :size="16" />
            <span>Гарантия 12 месяцев</span>
          </div>
          <div class="pdp__perk">
            <Package :size="16" />
            <span>Возврат в течение 30 дней</span>
          </div>
        </div>

        <!-- Specs -->
        <table class="pdp__specs">
          <tbody>
            <tr v-for="spec in mockSpecs" :key="spec.label">
              <td class="pdp__spec-label">{{ spec.label }}</td>
              <td class="pdp__spec-value">{{ spec.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reviews -->
    <ProductReviews v-if="product" :product-id="product.id" />
  </div>
</template>

<style lang="scss">
.pdp {
  padding-block: 32px;

  &__breadcrumbs { margin-bottom: 24px; }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: flex-start;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  // Media
  &__media {
    min-width: 0;
    width: 100%;
  }

  &__main-swiper {
    width: 100%;
    border-radius: $radius-xl;
    overflow: hidden;
    background: $color-gray-50;
  }

  &__main-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }

  &__thumbs { margin-top: 8px; }
  &__thumb-slide { width: 72px; }

  &__thumb-img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: $radius-md;
    border: 2px solid $color-gray-200;
    cursor: pointer;
    transition: border-color $transition-fast;
    .swiper-slide-thumb-active & { border-color: $color-primary; }
  }

  &__thumbs-skeleton {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  &__skel-gap { margin-bottom: 12px; display: block; }

  // Info
  &__category {
    display: inline-block;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-primary;
    margin-bottom: 8px;
  }

  &__title-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin: 0;
    flex: 1;
    line-height: 1.2;
  }

  &__fav-btn {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-md;
    color: $color-gray-400;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast;
    &:hover { background: $color-gray-100; color: $color-danger; }
    &--active { color: $color-danger; }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  &__rating {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: $color-warning;
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
  }

  &__brand {
    color: $color-gray-500;
    font-size: $font-size-sm;
  }

  &__stock {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    &--in { color: $color-success; }
    &--out { color: $color-danger; }
  }

  &__desc {
    color: $color-gray-600;
    line-height: $line-height-relaxed;
    margin-bottom: 20px;
    font-size: $font-size-sm;
  }

  // Price
  &__price-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  &__price {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__price-original {
    font-size: $font-size-lg;
    color: $color-gray-400;
    text-decoration: line-through;
  }

  &__discount {
    background: $color-danger;
    color: $color-white;
    padding: 2px 8px;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
  }

  // Purchase row
  &__purchase {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__qty {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    overflow: hidden;
    height: 48px;
    flex-shrink: 0;
  }

  &__qty-btn {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $color-gray-600;
    transition: background $transition-fast, color $transition-fast;
    &:hover:not(:disabled) { background: $color-gray-100; color: $color-gray-900; }
    &:disabled { opacity: 0.35; cursor: not-allowed; }
  }

  &__qty-val {
    width: 40px;
    text-align: center;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    border-inline: 1px solid $color-gray-200;
    line-height: 48px;
  }

  &__add-btn { flex: 1; justify-content: center; }

  &__fav-full-btn { width: 100%; justify-content: center; margin-bottom: 24px; }

  // Perks
  &__perks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: $color-gray-50;
    border-radius: $radius-lg;
    margin-bottom: 24px;
  }

  &__perk {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: $color-gray-600;
    svg { color: $color-primary; flex-shrink: 0; }
  }

  // Specs
  &__specs { width: 100%; border-collapse: collapse; }

  &__spec-label,
  &__spec-value {
    padding: 10px 12px;
    font-size: $font-size-sm;
    border-bottom: 1px solid $color-gray-100;
  }

  &__spec-label { color: $color-gray-500; width: 40%; }
  &__spec-value { color: $color-gray-900; font-weight: $font-weight-medium; }

  &__error {
    padding: 48px 0;
    color: $color-gray-500;
    font-size: $font-size-sm;
  }

  &__error-retry {
    color: $color-primary;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
    font-size: inherit;
    padding: 0;
  }
}
</style>
