<script setup lang="ts">
import { Menu, Search, LayoutGrid, User, Heart, ShoppingCart } from 'lucide-vue-next'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)
const isCatalogOpen = ref(false)
const isSearchOpen = ref(false)
const isCartOpen = ref(false)

function openCart() {
  if (!process.client) return
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.paddingRight = `${scrollbarWidth}px`
  document.body.style.overflow = 'hidden'
  isCartOpen.value = true
}

function closeCart() {
  document.body.style.paddingRight = ''
  document.body.style.overflow = ''
  isCartOpen.value = false
}

function handleCart() {
  openCart()
}

function handleUser() {
  if (authStore.isLoggedIn) router.push('/cabinet')
  else uiStore.authModalOpen = true
}

function toggleCatalog() {
  isCatalogOpen.value = !isCatalogOpen.value
  if (isCatalogOpen.value) isSearchOpen.value = false
}

function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) isCatalogOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isCatalogOpen.value = false
    isSearchOpen.value = false
    isSidebarOpen.value = false
    closeCart()
  }
}

watch(() => route.path, () => {
  isCatalogOpen.value = false
  isSearchOpen.value = false
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="the-header">
    <div class="the-header__inner container">
      <!-- Mobile burger -->
      <button class="the-header__burger" type="button" @click="isSidebarOpen = true">
        <Menu :size="22" />
      </button>

      <!-- Logo -->
      <NuxtLink to="/" class="the-header__logo">Nexus</NuxtLink>

      <!-- Desktop nav -->
      <div class="the-header__nav">
        <button
          :class="['the-header__catalog-btn', { 'the-header__catalog-btn--active': isCatalogOpen }]"
          type="button"
          @click="toggleCatalog"
        >
          <LayoutGrid :size="16" /> Каталог
        </button>

        <button class="the-header__search-btn" type="button" @click="toggleSearch">
          <Search :size="16" /> Поиск
        </button>
      </div>

      <!-- Actions -->
      <div class="the-header__actions">
        <button class="the-header__action-btn" type="button" @click="handleUser">
          <User :size="20" />
          <span v-if="authStore.isLoggedIn" class="the-header__action-name">
            {{ authStore.user?.firstName }}
          </span>
        </button>

        <button class="the-header__action-btn" type="button" @click="handleUser">
          <Heart :size="20" />
          <span v-if="favoritesStore.count" class="the-header__badge">{{ favoritesStore.count }}</span>
        </button>

        <button class="the-header__action-btn" type="button" @click="handleCart">
          <ShoppingCart :size="20" />
          <span v-if="cartStore.count" class="the-header__badge">{{ cartStore.count }}</span>
        </button>
      </div>
    </div>

    <HeaderCatalogMenu :open="isCatalogOpen" @close="isCatalogOpen = false" />
  </header>

  <div v-if="isCatalogOpen" class="catalog-backdrop" @click="isCatalogOpen = false" />

  <HeaderSearchOverlay :open="isSearchOpen" @close="isSearchOpen = false" />
  <HeaderSidebar :open="isSidebarOpen" @close="isSidebarOpen = false" />
  <HeaderAuthModal v-model:open="uiStore.authModalOpen" />
  <CartModal v-model:open="isCartOpen" @update:open="(v) => { if (!v) closeCart() }" />
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

.catalog-backdrop {
  position: fixed;
  inset: 0;
  z-index: calc(#{$z-dropdown} - 1);
  background: rgb(0 0 0 / 50%);
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
