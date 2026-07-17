<script setup lang="ts">
import { ShoppingCart, Heart, Bell } from 'lucide-vue-next'
import type { Product } from '~/types/product'

interface Props {
  product?: Product
  loading?: boolean
}
withDefaults(defineProps<Props>(), { loading: false })

const NuxtLink = resolveComponent('NuxtLink')

const cartStore = useCartStore()
const wishlistsStore = useWishlistsStore()
const toastStore = useToastStore()

const LABEL_MAP: Record<string, string> = {
  new: 'Новинка',
  sale: 'Акція',
  hit: 'Хіт',
}

const isOutOfStock = (product: Product) => product.stock === 0

function getHoverImage(product: Product): string | null {
  if (!product.images?.length) return null
  return product.images.find((img) => img !== product.thumbnail) ?? null
}

function handleCartClick(product: Product) {
  cartStore.add(product)
  toastStore.add('Товар додано до кошика', 'success')
}

function handleFavClick(product: Product) {
  wishlistsStore.toggle(product.id)
}

function handleNotifyClick(e: Event) {
  e.preventDefault()
  toastStore.add("Ми повідомимо вас, коли товар з'явиться в наявності", 'success')
}
</script>

<template>
  <component
    :is="!loading && product ? NuxtLink : 'article'"
    v-bind="
      !loading && product
        ? { to: isOutOfStock(product) ? `/product/${product.id}?oos=1` : `/product/${product.id}` }
        : {}
    "
    :class="['product-card', { 'product-card--loading': loading }]"
  >
    <div
      :class="[
        'product-card__media',
        { 'product-card__media--oos': !loading && product && isOutOfStock(product) },
      ]"
    >
      <div v-if="loading" class="product-card__shimmer product-card__shimmer--image" />
      <AppImage
        v-else-if="product?.thumbnail"
        :src="product.thumbnail"
        :alt="product.title"
        :sizes="{ mobile: { w: 240, h: 360 }, desktop: { w: 320, h: 480 } }"
      />

      <div
        v-if="!loading && product && getHoverImage(product) && !isOutOfStock(product)"
        class="product-card__hover-img"
        :style="{ backgroundImage: `url(${getHoverImage(product)})` }"
      />

      <div v-if="!loading && product && isOutOfStock(product)" class="product-card__oos">
        <span class="product-card__oos-badge">Немає в наявності</span>
      </div>

      <div v-if="!loading && product" class="product-card__labels">
        <span
          v-for="label in product.labels"
          :key="label"
          :class="['product-card__label', `product-card__label--${label}`]"
        >
          {{ LABEL_MAP[label] ?? label }}
        </span>
        <span v-if="product.category" class="product-card__category-badge">
          {{ product.category }}
        </span>
      </div>

      <button
        v-if="!loading && product"
        :class="[
          'product-card__fav-btn',
          { 'product-card__fav-btn--active': wishlistsStore.has(product.id) },
        ]"
        type="button"
        @click.prevent="handleFavClick(product)"
      >
        <Heart :size="14" :fill="wishlistsStore.has(product.id) ? 'currentColor' : 'none'" />
      </button>

      <button
        v-if="!loading && product && !isOutOfStock(product)"
        class="product-card__cart-btn"
        type="button"
        @click.prevent="handleCartClick(product)"
      >
        <ShoppingCart :size="15" />
        Додати до кошика
      </button>
    </div>

    <div class="product-card__body">
      <template v-if="loading">
        <div class="product-card__shimmer product-card__shimmer--badge" />
        <div class="product-card__shimmer product-card__shimmer--title" />
        <div class="product-card__shimmer product-card__shimmer--price" />
      </template>
      <template v-else-if="product">
        <h3 class="product-card__title">{{ product.title }}</h3>
        <div class="product-card__price-row">
          <div class="product-card__prices">
            <span v-if="product.compareAtPrice" class="product-card__compare-price">
              ${{ product.compareAtPrice }}
            </span>
            <span
              :class="[
                'product-card__price',
                { 'product-card__price--discounted': product.compareAtPrice },
              ]"
            >
              ${{ product.price }}
            </span>
          </div>
          <span v-if="product.category" class="product-card__category">{{ product.category }}</span>
          <button
            v-if="!isOutOfStock(product)"
            class="product-card__cart-icon-btn"
            type="button"
            @click.prevent="handleCartClick(product)"
          >
            <ShoppingCart :size="16" />
          </button>
          <button
            v-else
            class="product-card__notify-icon-btn"
            type="button"
            @click="handleNotifyClick"
          >
            <Bell :size="14" />
            Повідомте про наявність
          </button>
        </div>
      </template>
    </div>
  </component>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: $radius-xl;
  background: $color-white;
  box-shadow: $shadow-card;
  overflow: hidden;
  cursor: pointer;
  transition:
    box-shadow $transition-base,
    transform $transition-base;
  text-decoration: none;
  color: inherit;

  &:hover:not(&--loading) {
    box-shadow: $shadow-card-hover;
    transform: translateY(-3px);
  }

  &__media {
    position: relative;
    aspect-ratio: 5 / 5.1;
    background: $color-gray-100;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    --ai-height: 100%;
  }

  &__hover-img {
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: scale(1.05);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
    z-index: 1;
    background-size: cover;
    background-position: center;
  }

  &:hover &__hover-img {
    opacity: 1;
    transform: scale(1);
  }

  &__media--oos {
    filter: grayscale(60%);
  }

  &__oos {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 28%);
    z-index: 3;
  }

  &__oos-badge {
    padding: 6px 14px;
    background: $color-white;
    color: $color-gray-700;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    border-radius: $radius-full;
    letter-spacing: 0.03em;
  }

  &__labels {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 2;
  }

  &__label {
    display: inline-block;
    padding: 3px 8px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.03em;
    background: $color-gray-200;
    color: $color-gray-600;

    &--new {
      background: #dbeafe;
      color: #2563eb;
    }
    &--sale {
      background: #fee2e2;
      color: #c0392b;
    }
    &--hit {
      background: #fef3c7;
      color: #b45309;
    }
  }

  &__fav-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 30px;
    height: 30px;
    border-radius: $radius-full;
    background: $color-white;
    border: 1px solid $color-gray-100;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $color-gray-400;
    z-index: 2;
    transition:
      color $transition-fast,
      border-color $transition-fast;
    box-shadow: 0 1px 4px rgb(0 0 0 / 10%);

    &:hover {
      color: $color-danger;
      border-color: $color-danger;
    }
    &--active {
      color: $color-danger;
      border-color: rgb(239 68 68 / 30%);
    }
  }

  &__cart-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: $color-gray-900;
    color: $color-white;
    border: none;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition:
      transform $transition-base,
      background $transition-fast;
    z-index: 2;

    &:hover {
      background: $color-gray-700;
    }

    @include mixins.respond-to(md) {
      display: flex;
      font-size: $font-size-sm;
      transform: translateY(100%);
    }
  }

  &:hover &__cart-btn {
    @include mixins.respond-to(md) {
      transform: translateY(0);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 6px;
    padding: 12px 14px 14px;
  }

  &__category {
    display: none;

    @include mixins.respond-to(md) {
      display: block;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      color: $color-gray-400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 45%;
    }
  }

  &__category-badge {
    display: inline-block;
    padding: 3px 8px;
    background: $color-white;
    color: $color-gray-600;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    border-radius: $radius-sm;
    box-shadow: 0 1px 4px rgb(0 0 0 / 10%);

    @include mixins.respond-to(md) {
      display: none;
    }
  }

  &__notify-icon-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    height: 37px;
    border-radius: $radius-sm;
    background: $color-primary;
    color: $color-white;
    border: none;
    cursor: pointer;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
    transition: background $transition-fast;

    &:hover {
      background: $color-primary-dark;
    }

    @include mixins.respond-to(md) {
      display: none;
    }
  }

  &__cart-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    background: $color-primary;
    color: $color-white;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: background $transition-fast;

    &:hover {
      background: $color-primary-dark;
    }

    @include mixins.respond-to(md) {
      display: none;
    }
  }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
    line-height: 1.4;
  }

  &__price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 6px;
    margin-top: auto;
    padding-top: 8px;
    border-top: 1px solid $color-gray-200;
  }

  &__prices {
    display: flex;
    flex-direction: column;
    align-items: baseline;

    @include mixins.respond-to(xl) {
      flex-direction: row-reverse;
      gap: 6px;
    }
  }

  &__price {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-gray-900;

    &--discounted {
      color: $color-primary;
    }
  }

  &__compare-price {
    font-size: $font-size-sm;
    color: $color-gray-400;
    text-decoration: line-through;
  }

  // Shimmer
  &__shimmer {
    @include mixins.shimmer;
    border-radius: $radius-md;

    &--image {
      position: absolute;
      inset: 0;
      border-radius: 0;
    }
    &--badge {
      width: 64px;
      height: 12px;
    }
    &--title {
      width: 85%;
      height: 32px;
    }
    &--price {
      width: 60px;
      height: 16px;
    }
  }
}
</style>
