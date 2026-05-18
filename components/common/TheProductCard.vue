<script setup lang="ts">
import { ShoppingCart, Heart } from 'lucide-vue-next'
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

function handleCartClick(product: Product) {
  cartStore.add(product)
  toastStore.add('Товар добавлен в корзину', 'success')
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
    v-bind="!loading && product ? { to: `/product/${product.id}` } : {}"
    :class="['product-card', { 'product-card--loading': loading }]"
  >
    <div class="product-card__media">
      <div v-if="loading" class="product-card__shimmer product-card__shimmer--image" />
      <img
        v-else-if="product?.thumbnail"
        :src="product.thumbnail"
        :alt="product.title"
        loading="lazy"
      />
    </div>

    <div class="product-card__body">
      <template v-if="loading">
        <div class="product-card__shimmer product-card__shimmer--badge" />
        <div class="product-card__shimmer product-card__shimmer--title" />
        <div class="product-card__shimmer product-card__shimmer--desc" />
        <div class="product-card__shimmer product-card__shimmer--footer" />
      </template>
      <template v-else-if="product">
        <span class="product-card__category">{{ product.category }}</span>
        <h3 class="product-card__title">{{ product.title }}</h3>
        <p class="product-card__desc">{{ product.description }}</p>
        <div class="product-card__footer">
          <span class="product-card__rating">★ {{ product.rating }}</span>
          <span class="product-card__price">${{ product.price }}</span>
        </div>
      </template>
    </div>

    <!-- Fav button — always visible -->
    <button
      v-if="!loading && product"
      :class="[
        'product-card__fav-btn',
        { 'product-card__fav-btn--active': favoritesStore.has(product.id) },
      ]"
      type="button"
      @click.prevent="handleFavClick(product)"
    >
      <Heart :size="14" :fill="favoritesStore.has(product.id) ? 'currentColor' : 'none'" />
    </button>

    <div v-if="!loading && product" class="product-card__overlay">
      <div class="product-card__actions">
        <span class="product-card__cta">Подробнее</span>
        <button
          class="product-card__cart-btn"
          type="button"
          @click.prevent="handleCartClick(product)"
        >
          <ShoppingCart :size="16" />
        </button>
      </div>
    </div>
  </component>
</template>

<style lang="scss">
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1 1 0;
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
    aspect-ratio: 15 / 7;
    background: $color-gray-100;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--pc-body-gap, 8px);
    padding: var(--pc-body-padding, 16px);
  }

  &__category {
    font-size: var(--pc-category-size, #{$font-size-xs});
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-primary;
  }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: var(--pc-title-size, #{$font-size-base});
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
  }

  &__desc {
    font-size: var(--pc-desc-size, #{$font-size-sm});
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: $color-gray-500;
    margin: 0;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid $color-gray-100;
  }

  &__rating {
    font-size: var(--pc-rating-size, #{$font-size-sm});
    font-weight: $font-weight-medium;
    color: $color-warning;
  }

  &__price {
    font-size: var(--pc-price-size, #{$font-size-base});
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__fav-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
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
      background $transition-fast,
      border-color $transition-fast;
    box-shadow: 0 1px 4px rgb(0 0 0 / 8%);

    &:hover {
      color: $color-danger;
      border-color: $color-danger;
    }
    &--active {
      color: $color-danger;
      border-color: rgb(239 68 68 / 30%);
    }
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: var(--pc-body-padding, 16px);
    background: linear-gradient(to top, rgb(255 255 255 / 97%) 60%, transparent 100%);
    transform: translateY(100%);
    transition: transform $transition-base;
  }

  &:hover &__overlay {
    transform: translateY(0);
  }

  &__actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__cta {
    display: block;
    flex: 1;
    padding: 8px 16px;
    background: $color-primary;
    border-radius: $radius-md;
    color: $color-white;
    text-align: center;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    transition: background $transition-fast;

    &:hover {
      background: $color-primary-dark;
    }
  }

  &__cart-btn {
    width: 40px;
    height: 40px;
    background: $color-gray-100;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-primary;
      color: $color-white;
      border-color: $color-primary;
    }
  }

  // Shimmer elements
  &__shimmer {
    @include mixins.shimmer;
    border-radius: $radius-md;

    &--image {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
    &--badge {
      width: 80px;
      height: 12px;
    }
    &--title {
      width: 85%;
      height: 16px;
    }
    &--desc {
      width: 100%;
      height: 14px;
    }
    &--footer {
      width: 100%;
      height: 16px;
    }
  }
}
</style>
