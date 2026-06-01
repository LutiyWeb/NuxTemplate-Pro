<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import type { Product } from '~/types/product'

const { authFetch } = useAuthFetch()
const favoritesStore = useFavoritesStore()

interface FavoriteEntry {
  id: number
  productId: number
  product: Product
}

const favorites = ref<FavoriteEntry[]>([])
const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await authFetch<{ data: FavoriteEntry[] }>('/api/favorites')
    favorites.value = res.data
    favoritesStore.ids = favorites.value.map((f) => f.productId)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function remove(productId: number) {
  try {
    await authFetch(`/api/favorites/${productId}`, { method: 'DELETE' })
    favorites.value = favorites.value.filter((f) => f.productId !== productId)
    favoritesStore.ids = favorites.value.map((f) => f.productId)
  } catch {}
}

onMounted(load)
</script>

<template>
  <div class="cab-fav">
    <h2 class="cab-fav__title">Избранное</h2>

    <div v-if="loading" class="cab-fav__grid">
      <Skeleton v-for="n in 6" :key="n" width="100%" height="260px" border-radius="12px" />
    </div>

    <div v-else-if="error" class="cab-fav__empty">
      <p>Не удалось загрузить избранное.</p>
      <AppButton variant="outline" size="sm" @click="load">Повторить</AppButton>
    </div>

    <div v-else-if="!favorites.length" class="cab-fav__empty">
      <Heart :size="48" class="cab-fav__empty-icon" />
      <p class="cab-fav__empty-title">Список избранного пуст</p>
      <p class="cab-fav__empty-desc">Добавляйте товары в избранное, чтобы не потерять их</p>
      <AppButton variant="primary" size="md" @click="navigateTo('/catalog')"
        >Перейти в каталог</AppButton
      >
    </div>

    <div v-else class="cab-fav__grid">
      <div v-for="fav in favorites" :key="fav.id" class="cab-fav__card">
        <NuxtLink :to="`/product/${fav.productId}`" class="cab-fav__img-wrap">
          <img
            v-if="fav.product.thumbnail"
            :src="fav.product.thumbnail"
            :alt="fav.product.title"
            class="cab-fav__img"
          />
        </NuxtLink>
        <div class="cab-fav__body">
          <NuxtLink :to="`/product/${fav.productId}`" class="cab-fav__name">{{
            fav.product.title
          }}</NuxtLink>
          <div class="cab-fav__footer">
            <span class="cab-fav__price">${{ fav.product.price }}</span>
            <button
              class="cab-fav__remove"
              type="button"
              title="Убрать из избранного"
              @click="remove(fav.productId)"
            >
              <Heart :size="16" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cab-fav {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    @include mixins.respond-to(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__card {
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    overflow: hidden;
    transition: box-shadow $transition-fast;
    &:hover {
      box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
    }
  }

  &__img-wrap {
    display: block;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: $color-gray-50;
  }
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-base;
  }
  &__card:hover &__img {
    transform: scale(1.04);
  }

  &__body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    &:hover {
      color: $color-primary;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__price {
    font-weight: $font-weight-bold;
    font-size: $font-size-sm;
  }

  &__remove {
    color: $color-danger;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity $transition-fast;
    &:hover {
      opacity: 1;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 0;
    text-align: center;
  }

  &__empty-icon {
    color: $color-gray-200;
  }
  &__empty-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-700;
  }
  &__empty-desc {
    font-size: $font-size-sm;
    color: $color-gray-400;
  }
}
</style>
