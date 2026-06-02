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

watch(
  () => route.path,
  () => {
    uiStore.catalogOpen = false
    uiStore.searchOpen = false
  },
)

function onForgotPassword() {
  uiStore.authModalOpen = false
  uiStore.forgotPasswordModalOpen = true
}

function onBackToLogin() {
  uiStore.forgotPasswordModalOpen = false
  uiStore.authModalOpen = true
}
</script>

<template>
  <header class="the-header">
    <div class="the-header__inner container">
      <!-- Left: burger + catalog -->
      <div class="the-header__left">
        <button class="the-header__burger-btn" type="button" @click="uiStore.menuOpen = true">
          <Menu :size="20" />
        </button>

        <button
          :class="[
            'the-header__catalog-btn',
            { 'the-header__catalog-btn--active': uiStore.catalogOpen },
          ]"
          type="button"
          @click="toggleCatalog"
        >
          <LayoutGrid :size="16" /> Каталог
        </button>
      </div>

      <!-- Center: logo -->
      <NuxtLink to="/" class="the-header__logo">Nexus</NuxtLink>

      <!-- Right: search + actions -->
      <div class="the-header__right">
        <!-- Search input (desktop) — opens overlay on focus -->
        <div class="the-header__search" role="button" @click="uiStore.searchOpen = true">
          <Search class="the-header__search-icon" :size="16" />
          <span class="the-header__search-placeholder">Поиск товаров...</span>
        </div>

        <!-- Mobile search button -->
        <button
          class="the-header__action-btn the-header__action-btn--search-mobile"
          type="button"
          @click="uiStore.searchOpen = true"
        >
          <Search :size="20" />
        </button>

        <!-- User -->
        <button class="the-header__action-btn" type="button" @click="handleUser">
          <User :size="20" />
          <span v-if="authStore.isLoggedIn" class="the-header__action-name">
            {{ authStore.user?.firstName }}
          </span>
        </button>

        <!-- Favorites -->
        <button
          class="the-header__action-btn"
          type="button"
          @click="
            authStore.isLoggedIn
              ? router.push('/cabinet?section=favorites')
              : (uiStore.authModalOpen = true)
          "
        >
          <Heart :size="20" />
          <span v-if="favoritesStore.count" class="the-header__badge">{{
            favoritesStore.count
          }}</span>
        </button>

        <!-- Cart -->
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
  <HeaderMenuDrawer :open="uiStore.menuOpen" @close="uiStore.menuOpen = false" />
  <HeaderAuthModal v-model:open="uiStore.authModalOpen" @forgot-password="onForgotPassword" />
  <HeaderForgotPasswordModal
    v-model:open="uiStore.forgotPasswordModalOpen"
    @back-to-login="onBackToLogin"
  />
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.the-header {
  position: sticky;
  top: 0;
  z-index: $z-dropdown;
  background: $color-white;
  border-bottom: 1px solid $color-gray-100;

  &__inner {
    display: flex;
    align-items: center;
    height: 64px;
    gap: 12px;
    position: relative;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  &__logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-primary;
    text-decoration: none;
    white-space: nowrap;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: flex-end;
  }

  &__burger-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-md;
    background: none;
    border: none;
    color: $color-gray-600;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-100;
    }
  }

  &__catalog-btn {
    display: none;

    @include mixins.respond-to(md) {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      cursor: pointer;
      border: none;
      background: none;
      color: $color-gray-700;
      transition:
        background $transition-fast,
        color $transition-fast;

      &:hover,
      &--active {
        background: $color-gray-100;
        color: $color-primary;
      }
    }
  }

  &__search {
    display: none;

    @include mixins.respond-to(md) {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      max-width: 280px;
      height: 36px;
      padding: 0 12px;
      border: 1px solid $color-gray-200;
      border-radius: $radius-md;
      background: $color-gray-50;
      cursor: text;
      transition:
        border-color $transition-fast,
        background $transition-fast;

      &:focus-within {
        border-color: $color-primary;
        background: $color-white;
      }
    }
  }

  &__search-icon {
    color: $color-gray-400;
    flex-shrink: 0;
  }

  &__search-placeholder {
    flex: 1;
    font-size: $font-size-sm;
    color: $color-gray-400;
    user-select: none;
  }

  &__action-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: $radius-md;
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
    color: $color-gray-700;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-100;
    }

    &--search-mobile {
      @include mixins.respond-to(md) {
        display: none;
      }
    }
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
