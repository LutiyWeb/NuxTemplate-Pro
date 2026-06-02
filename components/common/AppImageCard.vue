<script setup lang="ts">
import { Heart, ShoppingCart } from 'lucide-vue-next'
import type { Product } from '~/types/product'

interface Props {
  product?: Product
  loading?: boolean
}
withDefaults(defineProps<Props>(), { loading: false })

const NuxtLink = resolveComponent('NuxtLink')

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const uiStore = useUiStore()
const toastStore = useToastStore()

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
  if (!authStore.isLoggedIn) {
    uiStore.authModalOpen = true
    return
  }
  favoritesStore.toggle(product.id)
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
    :class="['image-card', { 'image-card--loading': loading }]"
  >
    <!-- Shimmer -->
    <div v-if="loading" class="image-card__shimmer" />

    <template v-else-if="product">
      <!-- Background image -->
      <div
        class="image-card__bg"
        :class="{ 'image-card__bg--oos': isOutOfStock(product) }"
        :style="product.thumbnail ? { backgroundImage: `url(${product.thumbnail})` } : {}"
      />

      <!-- Hover image swap -->
      <div
        v-if="getHoverImage(product) && !isOutOfStock(product)"
        class="image-card__hover-img"
        :style="{ backgroundImage: `url(${getHoverImage(product)})` }"
      />

      <!-- Labels -->
      <div v-if="product.labels?.length" class="image-card__labels">
        <span
          v-for="label in product.labels"
          :key="label"
          :class="['image-card__label', `image-card__label--${label}`]"
        >
          {{ { new: 'Новинка', sale: 'Акція', hit: 'Хіт' }[label] ?? label }}
        </span>
      </div>

      <!-- Fav button — always visible -->
      <button
        :class="['image-card__fav', { 'image-card__fav--active': favoritesStore.has(product.id) }]"
        type="button"
        @click.prevent="handleFavClick(product)"
      >
        <Heart :size="14" :fill="favoritesStore.has(product.id) ? 'currentColor' : 'none'" />
      </button>

      <!-- Info panel — slides up on hover -->
      <div class="image-card__info">
        <span v-if="product.category" class="image-card__category">{{ product.category }}</span>
        <h3 class="image-card__title">{{ product.title }}</h3>
        <div class="image-card__price-row">
          <span
            :class="[
              'image-card__price',
              { 'image-card__price--discounted': product.compareAtPrice },
            ]"
          >
            ${{ product.price }}
          </span>
          <span v-if="product.compareAtPrice" class="image-card__compare">
            ${{ product.compareAtPrice }}
          </span>
        </div>
        <button
          v-if="!isOutOfStock(product)"
          class="image-card__cart"
          type="button"
          @click.prevent="handleCartClick(product)"
        >
          <ShoppingCart :size="14" />
          Додати до кошика
        </button>
        <span v-else class="image-card__oos">Немає в наявності</span>
      </div>
    </template>
  </component>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.image-card {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 200px;
  border-radius: $radius-xl;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  background: $color-gray-100;
  box-shadow: $shadow-card;
  transition:
    box-shadow $transition-base,
    transform $transition-base;

  &:hover {
    box-shadow: $shadow-card-hover;
    transform: translateY(-3px);
  }

  &__shimmer {
    position: absolute;
    inset: 0;
    @include mixins.shimmer;
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform $transition-slow;

    &--oos {
      filter: grayscale(60%);
    }
  }

  &:hover &__bg {
    transform: scale(1.05);
  }

  &__hover-img {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transform: scale(1.05);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
    z-index: 1;
  }

  &:hover &__hover-img {
    opacity: 1;
    transform: scale(1);
  }

  &__labels {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 3;
  }

  &__label {
    display: inline-block;
    padding: 3px 8px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.03em;
    background: $color-white;
    color: $color-gray-700;

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

  &__fav {
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
    z-index: 3;
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

  &__info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 16px;
    background: $color-white;
    border-radius: 0 0 $radius-xl $radius-xl;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transform: translateY(100%);
    transition: transform $transition-base;
  }

  &:hover &__info {
    transform: translateY(0);
  }

  &__category {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-primary;
  }

  &__title {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__price {
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-gray-900;

    &--discounted {
      color: $color-primary;
    }
  }

  &__compare {
    font-size: $font-size-sm;
    color: $color-gray-400;
    text-decoration: line-through;
  }

  &__cart {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    background: $color-gray-900;
    color: $color-white;
    border: none;
    border-radius: $radius-md;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-700;
    }
  }

  &__oos {
    font-size: $font-size-xs;
    color: $color-gray-400;
    margin-top: 4px;
  }
}
</style>
