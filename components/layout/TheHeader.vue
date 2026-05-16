<script setup lang="ts">
import { Menu, Search, LayoutGrid, User, Heart, ShoppingCart } from 'lucide-vue-next'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()

function handleCart() {
  navigateTo('/cart')
}

function handleUser() {
  if (authStore.isLoggedIn) router.push('/cabinet')
  else uiStore.authModalOpen = true
}

function toggleCatalog() {
  uiStore.catalogOpen = !uiStore.catalogOpen
  if (uiStore.catalogOpen) uiStore.searchOpen = false
}

function toggleSearch() {
  uiStore.searchOpen = !uiStore.searchOpen
  if (uiStore.searchOpen) uiStore.catalogOpen = false
}

watch(() => route.path, () => {
  uiStore.catalogOpen = false
  uiStore.searchOpen  = false
})

</script>

<template>
  <header class="the-header">
    <div class="the-header__inner container">
      <!-- Mobile burger -->
      <button class="the-header__burger" type="button" @click="uiStore.sidebarOpen = true">
        <Menu :size="22" />
      </button>

      <!-- Logo -->
      <NuxtLink to="/" class="the-header__logo">Nexus</NuxtLink>

      <!-- Desktop nav -->
      <div class="the-header__nav">
        <button
          :class="['the-header__catalog-btn', { 'the-header__catalog-btn--active': uiStore.catalogOpen }]"
          type="button"
          @click="toggleCatalog"
        >
          <LayoutGrid :size="16" /> Каталог
        </button>

        <button class="the-header__search-btn" type="button" @click="toggleSearch">
          <Search :size="16" /> Поиск
        </button>

        <NuxtLink v-if="$config.public.isDev" to="/ui" class="the-header__dev-link">
          Dev: UI Kit
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="the-header__actions">
        <button class="the-header__action-btn" type="button" @click="handleUser">
          <User :size="20" />
          <span v-if="authStore.isLoggedIn" class="the-header__action-name">
            {{ authStore.user?.firstName }}
          </span>
        </button>

        <button class="the-header__action-btn" type="button" @click="authStore.isLoggedIn ? router.push('/cabinet?section=favorites') : uiStore.authModalOpen = true">
          <Heart :size="20" />
          <span v-if="favoritesStore.count" class="the-header__badge">{{ favoritesStore.count }}</span>
        </button>

        <button class="the-header__action-btn" type="button" @click="handleCart">
          <ShoppingCart :size="20" />
          <span v-if="cartStore.count" class="the-header__badge">{{ cartStore.count }}</span>
        </button>
      </div>
    </div>

    <HeaderCatalogMenu :open="uiStore.catalogOpen" @close="uiStore.catalogOpen = false" />
  </header>

  <HeaderSearchOverlay :open="uiStore.searchOpen" @close="uiStore.searchOpen = false" />
  <HeaderSidebar :open="uiStore.sidebarOpen" @close="uiStore.sidebarOpen = false" />
  <HeaderAuthModal v-model:open="uiStore.authModalOpen" />
</template>

<style lang="scss">
.the-header {
  position: sticky;
  top: 0;
  z-index: $z-dropdown;
  background: $color-white;
  border-bottom: 1px solid $color-gray-100;

  &__inner {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 64px;
  }

  &__burger {
    display: none;
    font-size: 22px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;

    @media (max-width: 768px) { display: flex; }
  }

  &__logo {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-primary;
    flex-shrink: 0;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    @media (max-width: 768px) { display: none; }
  }

  &__catalog-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast;

    &:hover, &--active { background: $color-gray-100; color: $color-primary; }
  }

  &__search-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-500;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover { background: $color-gray-100; }
  }

  &__dev-link {
    font-size: 11px;
    font-weight: $font-weight-semibold;
    color: $color-white;
    background: $color-primary;
    padding: 4px 10px;
    border-radius: $radius-sm;
    text-decoration: none;
    opacity: 0.75;
    letter-spacing: 0.02em;
    transition: opacity $transition-fast;

    &:hover { opacity: 1; }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
  }

  &__action-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: $radius-md;
    font-size: 18px;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover { background: $color-gray-100; }
  }

  &__action-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
  }

  &__badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    background: $color-primary;
    color: $color-white;
    border-radius: $radius-full;
    font-size: 10px;
    font-weight: $font-weight-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }
}

</style>
