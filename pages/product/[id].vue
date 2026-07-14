<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Heart, ShoppingCart, Minus, Plus, Star, Package, Shield, Truck, X } from 'lucide-vue-next'
import type { Product } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const wishlistsStore = useWishlistsStore()

const config = useRuntimeConfig()

const {
  data: productData,
  pending,
  error,
} = useAsyncData(
  () => `product-${route.params.id}`,
  () => $fetch<{ data: Product }>(`${config.public.apiBase}/api/products/${route.params.id}`),
)

const product = computed(() => productData.value?.data ?? null)
const loading = computed(() => pending.value)

useSeoMeta({
  title: () => (product.value ? `${product.value.title} — Nexus Commerce` : 'Товар'),
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.title ?? '',
  ogDescription: () => product.value?.description ?? '',
  ogImage: () => product.value?.thumbnail ?? '',
})

const { isMd } = useBreakpoints()
const thumbsSwiper = ref<SwiperType | null>(null)
const qty = ref(1)

const lightboxOpen = ref(false)
const lightboxActiveIndex = ref(0)
const lightboxThumbsSwiper = ref<SwiperType | null>(null)

function openLightbox(index: number) {
  lightboxActiveIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
  lightboxThumbsSwiper.value = null
}

function handleLightboxKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

watch(lightboxOpen, (open) => {
  if (open) window.addEventListener('keydown', handleLightboxKey)
  else window.removeEventListener('keydown', handleLightboxKey)
})

const allImages = computed(() => {
  const p = product.value
  if (!p) return []
  return [p.thumbnail, ...p.images].filter(Boolean) as string[]
})

const isFav = computed(() => (product.value ? wishlistsStore.has(product.value.id) : false))

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
  {
    label: 'Скидка',
    value: product.value?.discountPercentage
      ? `${Math.round(product.value.discountPercentage)}%`
      : 'Нет',
  },
  { label: 'Артикул', value: product.value?.sku ?? '—' },
  { label: 'Гарантия', value: '12 месяцев' },
])

const tabs = [
  { key: 'specs', label: 'Характеристики' },
  { key: 'reviews', label: 'Відгуки' },
  { key: 'qa', label: 'Питання та відповіді' },
]
const activeTab = ref('specs')

// TODO: remove route.query.oos check — test only, backend will send real stock
const isOutOfStock = computed(() => (product.value?.stock ?? 0) === 0 || route.query.oos === '1')

function decrement() {
  if (qty.value > 1) qty.value--
}
function increment() {
  qty.value++
}

function addToCart() {
  if (product.value) {
    cartStore.add(product.value, qty.value)
    qty.value = 1
  }
}

const toastStore = useToastStore()

function notifyWhenAvailable() {
  if (!authStore.isLoggedIn) {
    uiStore.authModalOpen = true
    return
  }
  toastStore.add("Ми повідомимо вас, коли товар з'явиться в наявності", 'success')
}

function toggleFav() {
  if (product.value) wishlistsStore.toggle(product.value.id)
}

onBeforeUnmount(() => {
  thumbsSwiper.value = null
  window.removeEventListener('keydown', handleLightboxKey)
})
</script>

<template>
  <div class="product-detail container">
    <AppBreadcrumbs
      :crumbs="[
        { label: 'Главная', to: '/' },
        { label: 'Каталог', to: '/catalog' },
        {
          label: product?.category ?? '...',
          to: product?.categorySlug ? `/catalog?categorySlug=${product.categorySlug}` : '/catalog',
        },
        { label: product?.title ?? '...' },
      ]"
      class="product-detail__breadcrumbs"
    />

    <!-- Loading -->
    <div v-if="loading" class="product-detail__layout">
      <div class="product-detail__media">
        <AppSkeleton width="100%" height="420px" border-radius="16px" />
        <div class="product-detail__thumbs-skeleton">
          <AppSkeleton v-for="n in 4" :key="n" width="72px" height="72px" border-radius="8px" />
        </div>
      </div>
      <div class="product-detail__info">
        <AppSkeleton width="100px" height="14px" class="product-detail__skel-gap" />
        <AppSkeleton width="80%" height="32px" class="product-detail__skel-gap" />
        <AppSkeleton width="100%" height="14px" class="product-detail__skel-gap" />
        <AppSkeleton width="90%" height="14px" class="product-detail__skel-gap" />
        <AppSkeleton
          width="140px"
          height="40px"
          class="product-detail__skel-gap"
          style="margin-top: 16px"
        />
        <AppSkeleton width="100%" height="56px" border-radius="12px" style="margin-top: 24px" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error || !product" class="product-detail__error">
      <p>
        Не удалось загрузить товар. Попробуйте
        <button type="button" class="product-detail__error-retry" @click="() => refreshNuxtData()">
          обновить страницу</button
        >.
      </p>
    </div>

    <!-- Content -->
    <div v-else-if="product" class="product-detail__layout">
      <!-- Media -->
      <div class="product-detail__media">
        <div v-if="isOutOfStock" class="product-detail__media-oos">
          <span class="product-detail__media-oos-badge">Немає в наявності</span>
        </div>
        <ClientOnly>
          <Swiper
            :modules="[Thumbs, Navigation]"
            :thumbs="isMd ? { swiper: thumbsSwiper } : undefined"
            navigation
            class="product-detail__main-swiper swiper-nav-bg swiper-nav-image"
          >
            <SwiperSlide
              v-for="(img, i) in allImages"
              :key="i"
              class="product-detail__main-slide"
              @click="openLightbox(i)"
            >
              <AppImage
                :src="img"
                :alt="product.title"
                :lazy="i !== 0"
                :sizes="{ mobile: { w: 600, h: 450 }, desktop: { w: 800, h: 600 } }"
              />
            </SwiperSlide>
          </Swiper>

          <Swiper
            v-if="isMd"
            :modules="[Thumbs]"
            slides-per-view="auto"
            :space-between="8"
            watch-slides-progress
            class="product-detail__thumbs"
            @swiper="thumbsSwiper = $event"
          >
            <SwiperSlide v-for="(img, i) in allImages" :key="i" class="product-detail__thumb-slide">
              <AppImage
                :src="img"
                :alt="`thumb ${i}`"
                img-class="product-detail__thumb-img"
                :sizes="{ mobile: { w: 72, h: 72 }, desktop: { w: 72, h: 72 } }"
              />
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>

      <!-- Info  -->
      <div class="product-detail__info">
        <NuxtLink
          v-if="product.categorySlug"
          :to="`/catalog?categorySlug=${product.categorySlug}`"
          class="product-detail__category"
          >{{ product.category }}</NuxtLink
        >

        <div class="product-detail__title-row">
          <h1 class="product-detail__title">{{ product.title }}</h1>
          <button
            :class="['product-detail__fav-btn', { 'product-detail__fav-btn--active': isFav }]"
            type="button"
            :title="isFav ? 'Убрать из избранного' : 'В избранное'"
            @click="toggleFav"
          >
            <Heart :size="20" :fill="isFav ? 'currentColor' : 'none'" />
          </button>
        </div>

        <!-- Rating & meta -->
        <div class="product-detail__meta">
          <span v-if="product.rating" class="product-detail__rating">
            <Star :size="14" fill="currentColor" />
            {{ product.rating }}
          </span>
          <span v-if="product.brand" class="product-detail__brand">{{ product.brand }}</span>
          <span
            :class="[
              'product-detail__stock',
              !isOutOfStock ? 'product-detail__stock--in' : 'product-detail__stock--out',
            ]"
            >{{ !isOutOfStock ? 'В наявності' : 'Немає в наявності' }}</span
          >
        </div>

        <p class="product-detail__desc">{{ product.description }}</p>

        <!-- Price -->
        <div class="product-detail__price-row">
          <span class="product-detail__price">${{ product.price }}</span>
          <span v-if="originalPrice" class="product-detail__price-original"
            >${{ originalPrice }}</span
          >
          <span v-if="product.discountPercentage" class="product-detail__discount">
            -{{ Math.round(product.discountPercentage) }}%
          </span>
          <AppButton
            variant="outline"
            size="lg"
            class="product-detail__fav-full-btn"
            @click="toggleFav"
          >
            <Heart :size="16" :fill="isFav ? 'currentColor' : 'none'" />
            {{ isFav ? 'В обраному' : 'В обране' }}
          </AppButton>
        </div>

        <!-- Quantity + Add to cart / Out of stock -->
        <template v-if="!isOutOfStock">
          <div class="product-detail__purchase">
            <div class="product-detail__qty">
              <button
                class="product-detail__qty-btn"
                type="button"
                :disabled="qty <= 1"
                @click="decrement"
              >
                <Minus :size="14" />
              </button>
              <span class="product-detail__qty-val">{{ qty }}</span>
              <button class="product-detail__qty-btn" type="button" @click="increment">
                <Plus :size="14" />
              </button>
            </div>
            <AppButton
              variant="primary"
              size="lg"
              class="product-detail__add-btn"
              @click="addToCart"
            >
              <ShoppingCart :size="18" /> Додати до кошика
            </AppButton>
          </div>
        </template>

        <template v-else>
          <div class="product-detail__oos-banner">
            <span class="product-detail__oos-label">Немає в наявності</span>
            <p class="product-detail__oos-hint">
              Залиште заявку — ми повідомимо, коли товар з'явиться
            </p>
          </div>
          <AppButton
            variant="outline"
            size="lg"
            class="product-detail__notify-btn"
            @click="notifyWhenAvailable"
          >
            Повідомити про наявність
          </AppButton>
        </template>

        <!-- Perks -->
        <div class="product-detail__perks">
          <div class="product-detail__perk">
            <Truck :size="16" />
            <span>Бесплатная доставка от $50</span>
          </div>
          <div class="product-detail__perk">
            <Shield :size="16" />
            <span>Гарантия 12 месяцев</span>
          </div>
          <div class="product-detail__perk">
            <Package :size="16" />
            <span>Возврат в течение 30 дней</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="product" class="product-detail__tabs">
      <div class="product-detail__tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'product-detail__tab-btn',
            { 'product-detail__tab-btn--active': activeTab === tab.key },
          ]"
          type="button"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="product-detail__tab-content">
        <div v-if="activeTab === 'specs'">
          <table class="product-detail__specs">
            <tbody>
              <tr v-for="spec in mockSpecs" :key="spec.label">
                <td class="product-detail__spec-label">{{ spec.label }}</td>
                <td class="product-detail__spec-value">{{ spec.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="activeTab === 'reviews'">
          <ProductReviews :product-id="product.id" />
        </div>

        <div v-else-if="activeTab === 'qa'" class="product-detail__qa-empty">
          <p>Питань поки немає. Будьте першим, хто задасть питання!</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Fullscreen gallery lightbox -->
  <Teleport to="body">
    <div v-if="lightboxOpen" class="product-lightbox">
      <button class="product-lightbox__close" type="button" @click="closeLightbox">
        <X :size="20" />
      </button>
      <div class="product-lightbox__main">
        <Swiper
          :modules="[Thumbs, Navigation]"
          :initial-slide="lightboxActiveIndex"
          :thumbs="{ swiper: lightboxThumbsSwiper }"
          navigation
          class="product-lightbox__swiper swiper-nav-image"
        >
          <SwiperSlide v-for="(img, i) in allImages" :key="i">
            <img :src="img" :alt="product?.title" class="product-lightbox__img" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="product-lightbox__thumb-strip">
        <Swiper
          :modules="[Thumbs]"
          slides-per-view="auto"
          :space-between="8"
          watch-slides-progress
          class="product-lightbox__thumb-swiper"
          @swiper="lightboxThumbsSwiper = $event"
        >
          <SwiperSlide v-for="(img, i) in allImages" :key="i" class="product-lightbox__thumb-slide">
            <img :src="img" class="product-lightbox__thumb-img" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.product-detail {
  padding-block: 24px;

  &__breadcrumbs {
    margin-bottom: 16px;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: flex-start;

    @include mixins.respond-to(md) {
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
  }

  // Media
  &__media {
    min-width: 0;
    width: 100%;
    position: relative;
  }

  &__media-oos {
    position: absolute;
    inset: 0;
    z-index: 10;
    border-radius: $radius-xl;
    background: rgb(0 0 0 / 35%);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  &__media-oos-badge {
    padding: 8px 20px;
    background: $color-white;
    color: $color-gray-700;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    border-radius: $radius-full;
    letter-spacing: 0.03em;
  }

  &__main-swiper {
    --swiper-theme-color: $color-primary;
    --swiper-navigation-size: 20px;

    width: 100%;
    border-radius: $radius-xl;
    overflow: hidden;
    background: $color-gray-50;
    --ai-ratio: 4/3;

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
      // width: 36px;
      // height: 36px;
      // border-radius: $radius-md;
      // background: rgb(255 255 255 / 82%);
      // backdrop-filter: blur(4px);
      // color: $color-gray-600;
      // transition: color $transition-fast;

      // &::after {
      //   font-size: 13px;
      // }

      // &:hover {
      //   color: $color-gray-800;
      // }
    }
  }

  &__main-slide {
    cursor: zoom-in;
  }

  &__thumbs {
    margin-top: 8px;
  }

  &__thumb-slide {
    width: 72px;
  }

  &__thumb-img {
    // width: 72px;
    // height: 72px;
    object-fit: cover;
    border-radius: $radius-md;
    border: 2px solid $color-gray-200;
    cursor: pointer;
    transition: border-color $transition-fast;
    .swiper-slide-thumb-active & {
      border-color: $color-primary;
    }
  }

  &__thumbs-skeleton {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  &__skel-gap {
    margin-bottom: 12px;
    display: block;
  }

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
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    margin: 0;
    flex: 1;
    line-height: 1.2;

    @include mixins.respond-to(2xl) {
      font-size: $font-size-2xl;
    }
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
    transition:
      background $transition-fast,
      color $transition-fast;
    &:hover {
      background: $color-gray-100;
      color: $color-danger;
    }
    &--active {
      color: $color-danger;
    }
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
    &--in {
      color: $color-success;
    }
    &--out {
      color: $color-danger;
    }
  }

  &__desc {
    color: $color-gray-600;
    line-height: $line-height-relaxed;
    margin-bottom: 20px;
    font-size: $font-size-sm;
  }

  // Price
  &__price-row {
    display: grid;
    grid-template-columns: 122px 1fr;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
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
    display: grid;
    grid-template-columns: 122px 1fr;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__qty {
    display: flex;
    align-items: center;
    gap: 0;
    height: 100%;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    overflow: hidden;
  }

  &__qty-btn {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $color-gray-600;
    transition:
      background $transition-fast,
      color $transition-fast;
    &:hover:not(:disabled) {
      background: $color-gray-100;
      color: $color-gray-900;
    }
    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__qty-val {
    width: 40px;
    text-align: center;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    border-inline: 1px solid $color-gray-200;
  }

  &__add-btn {
    white-space: nowrap;
    justify-content: center;
  }

  &__fav-full-btn {
    width: 100%;
    justify-content: center;
  }

  &__oos-banner {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    background: $color-gray-50;
    border: 1px solid $color-gray-200;
    border-radius: $radius-lg;
    margin-bottom: 12px;
  }

  &__oos-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-500;
  }

  &__oos-hint {
    font-size: $font-size-sm;
    color: $color-gray-400;
    margin: 0;
  }

  &__notify-btn {
    width: 100%;
    justify-content: center;
    margin-bottom: 24px;
  }

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
    svg {
      color: $color-primary;
      flex-shrink: 0;
    }
  }

  // Tabs

  &__tabs-nav {
    display: flex;
    border-bottom: 2px solid $color-gray-100;
    gap: 4px;
  }

  &__tab-btn {
    padding: 12px 8px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-500;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition:
      color $transition-fast,
      border-color $transition-fast;

    &:hover {
      color: $color-gray-900;
    }

    &--active {
      color: $color-primary;
      border-bottom-color: $color-primary;
    }
  }

  // Specs
  &__specs {
    width: 100%;
    max-width: 640px;
    border-collapse: collapse;
  }

  &__spec-label,
  &__spec-value {
    padding: 10px 12px;
    font-size: $font-size-sm;
    border-bottom: 1px solid $color-gray-100;
  }

  &__spec-label {
    color: $color-gray-500;
    width: 40%;
  }
  &__spec-value {
    color: $color-gray-900;
    font-weight: $font-weight-medium;
  }

  // Q&A
  &__qa-empty {
    padding: 12px 0;
    color: $color-gray-400;
    font-size: $font-size-sm;
  }

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

.product-lightbox {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgb(0 0 0 / 93%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 56px 24px 24px;

  &__close {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-full;
    background: rgb(255 255 255 / 12%);
    color: $color-white;
    cursor: pointer;
    transition: background $transition-fast;
    z-index: 1;

    &:hover {
      background: rgb(255 255 255 / 25%);
    }
  }

  &__main {
    flex: 1;
    min-height: 0;
  }

  &__swiper {
    width: 100%;
    height: 100%;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &__thumb-strip {
    flex-shrink: 0;
  }

  &__thumb-slide {
    width: 72px !important;
    height: 72px;
  }

  &__thumb-img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: $radius-md;
    border: 2px solid rgb(255 255 255 / 20%);
    cursor: pointer;
    display: block;
    transition: border-color $transition-fast;

    .swiper-slide-thumb-active & {
      border-color: $color-white;
    }
  }
}
</style>
