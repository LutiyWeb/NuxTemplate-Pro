<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import type { Product } from '~/types/product'

useSeoMeta({ title: 'Избранное — Nexus Commerce' })

const wishlistsStore = useWishlistsStore()
const config = useRuntimeConfig()
const BASE = config.public.apiBase

const products = ref<Product[]>([])
const loading = ref(false)

async function loadProducts() {
  const ids = wishlistsStore.guestIds
  if (!ids.length) return
  loading.value = true
  try {
    const results = await Promise.all(
      ids.map((id) => $fetch<{ data: Product }>(`${BASE}/api/products/${id}`).then((r) => r.data)),
    )
    products.value = results
  } finally {
    loading.value = false
  }
}

onMounted(loadProducts)

watch(() => wishlistsStore.guestIds.length, loadProducts)
</script>

<template>
  <div class="wishlist-page container">
    <div class="wishlist-page__title-row">
      <h1 class="wishlist-page__heading">
        Избранное
        <span v-if="wishlistsStore.count" class="wishlist-page__count">{{
          wishlistsStore.count
        }}</span>
      </h1>
      <AppBreadcrumbs :crumbs="[{ label: 'Главная', to: '/' }, { label: 'Избранное' }]" />
    </div>

    <!-- Empty -->
    <AppEmpty
      v-if="!loading && !products.length"
      title="Избранное пусто"
      description="Добавляйте понравившиеся товары, нажимая на сердечко"
    >
      <template #icon>
        <Heart :size="56" :stroke-width="1.2" />
      </template>
      <template #action>
        <AppButton variant="primary" size="md" @click="navigateTo('/catalog')">
          Перейти в каталог
        </AppButton>
      </template>
    </AppEmpty>

    <!-- Grid -->
    <div v-else-if="products.length" class="wishlist-page__grid">
      <TheProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <!-- Skeleton -->
    <div v-else-if="loading" class="wishlist-page__grid">
      <TheProductCard v-for="n in wishlistsStore.guestIds.length" :key="n" :loading="true" />
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.wishlist-page {
  padding-block: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__heading {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__count {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-gray-400;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @include mixins.respond-to(sm) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(4, 1fr);
    }

    @include mixins.respond-to(xl) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
}
</style>
