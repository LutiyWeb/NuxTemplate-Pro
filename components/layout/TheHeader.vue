<script setup lang="ts">
import { Menu, MapPin, Phone, ShoppingBag, ChevronDown } from 'lucide-vue-next'
import LogoMacaron from '~/assets/icons/logo-macaron.svg'
import IconTg from '~/assets/icons/tg.svg'
import IconVk from '~/assets/icons/vk.svg'
import IconOk from '~/assets/icons/ok.svg'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()

// Top info-bar links (mapped to existing pages where they exist)
const topLinks = [
  { label: 'Гарантия свежести', to: '/about' },
  { label: 'Доставка и оплата', to: '/payment-delivery' },
  { label: 'Оптовые поставки', to: '/contacts' },
  { label: 'Контакты', to: '/contacts' },
]

const socials = [
  { icon: IconTg, label: 'Telegram', href: '#' },
  { icon: IconVk, label: 'VK', href: '#' },
  { icon: IconOk, label: 'Одноклассники', href: '#' },
]

// Russian plural: 1 товар / 2 товара / 5 товаров
function pluralItems(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'товар'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товара'
  return 'товаров'
}

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
    <!-- ── Top info-bar ───────────────────────────────────────────── -->
    <div class="the-header__topbar">
      <div class="the-header__topbar-inner container">
        <nav class="the-header__toplinks">
          <NuxtLink
            v-for="link in topLinks"
            :key="link.label"
            :to="link.to"
            class="the-header__toplink"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="the-header__topinfo">
          <button class="the-header__city" type="button">
            <MapPin :size="18" />
            <span>Санкт-Петербург</span>
            <ChevronDown :size="14" />
          </button>

          <a class="the-header__phone" href="tel:88123098288">
            <Phone :size="18" />
            <span>8 812 309-82-88</span>
          </a>

          <NuxtLink class="the-header__cart-link" to="/cart">
            <span class="the-header__cart-icon">
              <ShoppingBag :size="18" />
              <span v-if="cartStore.count" class="the-header__cart-count">{{
                cartStore.count
              }}</span>
            </span>
            <span>В корзине ({{ cartStore.count }} {{ pluralItems(cartStore.count) }})</span>
          </NuxtLink>

          <div class="the-header__socials">
            <a
              v-for="s in socials"
              :key="s.label"
              class="the-header__social"
              :href="s.href"
              :aria-label="s.label"
            >
              <component :is="s.icon" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Main nav bar ───────────────────────────────────────────── -->
    <div class="the-header__main">
      <div class="the-header__main-inner container">
        <!-- Mobile burger -->
        <button
          class="the-header__burger"
          type="button"
          aria-label="Меню"
          @click="uiStore.menuOpen = true; uiStore.catalogOpen = false"
        >
          <Menu :size="22" />
        </button>

        <nav class="the-header__nav the-header__nav--left">
          <NuxtLink to="/promo" class="the-header__nav-link">
            Сладкие дни
            <span class="the-header__sale-badge">%</span>
          </NuxtLink>
          <button type="button" class="the-header__nav-link the-header__nav-link--caret">
            Подарочные наборы
            <ChevronDown :size="14" />
          </button>
          <NuxtLink to="/catalog" class="the-header__nav-link">Собрать набор</NuxtLink>
        </nav>

        <NuxtLink to="/" class="the-header__logo" aria-label="Macaron shop — на главную">
          <LogoMacaron class="the-header__logo-img" />
        </NuxtLink>

        <nav class="the-header__nav the-header__nav--right">
          <NuxtLink to="/promo" class="the-header__nav-link">Создать дизайн</NuxtLink>
          <button type="button" class="the-header__nav-link the-header__nav-link--caret">
            Компаниям
            <ChevronDown :size="14" />
          </button>
          <button
            type="button"
            :class="[
              'the-header__nav-link',
              'the-header__nav-link--caret',
              { 'the-header__nav-link--active': uiStore.catalogOpen },
            ]"
            @click="toggleCatalog"
          >
            Весь каталог
            <ChevronDown :size="14" />
          </button>
        </nav>

        <!-- Mobile cart -->
        <NuxtLink class="the-header__mobile-cart" to="/cart" aria-label="Корзина">
          <ShoppingBag :size="22" />
          <span v-if="cartStore.count" class="the-header__cart-count">{{ cartStore.count }}</span>
        </NuxtLink>
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

  // ── Top info-bar ──────────────────────────────────────────────
  &__topbar {
    display: none;
    background: $color-header-top-bg;

    @include mixins.respond-to(lg) {
      display: block;
    }
  }

  &__topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-6;
    min-height: 48px;
    padding-top: $spacing-2;
    padding-bottom: $spacing-2;
  }

  &__toplinks {
    display: flex;
    align-items: center;
    gap: $spacing-5;
  }

  &__toplink {
    font-size: $font-size-sm;
    color: $color-top-link;
    text-decoration: none;
    white-space: nowrap;
    transition: color $transition-fast;

    &:hover {
      color: $color-accent;
    }
  }

  &__topinfo {
    display: flex;
    align-items: center;
    gap: $spacing-6;
  }

  &__city,
  &__phone,
  &__cart-link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    font-size: $font-size-sm;
    color: $color-top-contact;
    background: none;
    border: none;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: color $transition-fast;

    svg {
      flex-shrink: 0;
      color: $color-ink;
    }

    &:hover {
      color: $color-accent;

      svg {
        color: $color-accent;
      }
    }
  }

  &__cart-icon {
    position: relative;
    display: inline-flex;
  }

  &__cart-count {
    position: absolute;
    top: -6px;
    right: -7px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-accent;
    color: $color-white;
    border-radius: $radius-full;
    font-size: 10px;
    font-weight: $font-weight-bold;
    line-height: 1;
  }

  &__socials {
    display: flex;
    align-items: center;
    gap: $spacing-3;
  }

  &__social {
    display: inline-flex;
    color: $color-ink;
    transition: color $transition-fast;

    &:hover {
      color: $color-accent;
    }

    svg {
      width: 22px;
      height: 22px;
    }
  }

  // ── Main nav bar ──────────────────────────────────────────────
  &__main {
    border-bottom: 1px solid $color-gray-100;
  }

  &__main-inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-4;
    min-height: 64px;

    @include mixins.respond-to(lg) {
      min-height: 150px;
    }
  }

  &__nav {
    display: none;
    align-items: center;
    gap: $spacing-6;

    @include mixins.respond-to(lg) {
      display: flex;
    }
  }

  &__nav-link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-1;
    font-family: $font-family-base;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: $color-heading;
    background: none;
    border: none;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: color $transition-fast;

    svg {
      flex-shrink: 0;
      transition: transform $transition-fast;
    }

    &:hover,
    &--active {
      color: $color-accent;
    }

    &--active svg {
      transform: rotate(180deg);
    }
  }

  &__sale-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-left: $spacing-1;
    background: $color-accent;
    color: $color-white;
    border-radius: $radius-full;
    font-size: 13px;
    font-weight: $font-weight-semibold;
    line-height: 1;
  }

  // Centered logo (absolute so flanking navs stay balanced)
  &__logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: block;
    line-height: 0;
  }

  &__logo-img {
    width: 56px;
    height: auto;
    display: block;

    @include mixins.respond-to(lg) {
      width: 116px;
    }
  }

  // Mobile-only controls
  &__burger,
  &__mobile-cart {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    border: none;
    background: none;
    color: $color-heading;
    cursor: pointer;
    text-decoration: none;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-100;
    }

    @include mixins.respond-to(lg) {
      display: none;
    }
  }
}
</style>
