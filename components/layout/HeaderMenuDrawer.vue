<script setup lang="ts">
import {
  X,
  MessageCircle,
  LayoutGrid,
  Tag,
  Info,
  Phone,
  User,
  Package,
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
} from 'lucide-vue-next'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

function handleFeedback() {
  router.push('/contacts')
}

function handleAuth() {
  uiStore.menuOpen = false
  if (!authStore.isLoggedIn) uiStore.authModalOpen = true
  else router.push('/cabinet')
}

const NAV = [
  { label: 'Каталог', to: '/catalog', icon: LayoutGrid },
  { label: 'Акції', to: '/promo', icon: Tag },
  { label: 'Про нас', to: '/about', icon: Info },
  { label: 'Контакти', to: '/contacts', icon: Phone },
]

const CABINET = [
  { label: 'Профіль', to: '/cabinet', icon: User },
  { label: 'Замовлення', to: '/cabinet?section=orders', icon: Package },
  { label: 'Обрані', to: '/cabinet?section=favorites', icon: Heart },
  { label: 'Кошик', to: '/cart', icon: ShoppingCart },
]

const EXTRA = [
  { label: 'Оплата і доставка', to: '/payment-delivery', icon: Truck },
  { label: 'Повернення та обмін', to: '/returns-exchanges', icon: RotateCcw },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-drawer">
      <div v-if="open" class="menu-drawer">
        <!-- Header -->
        <div class="menu-drawer__header">
          <button class="menu-drawer__feedback" type="button" @click="handleFeedback">
            <MessageCircle :size="15" />
            Зворотній зв'язок
          </button>
          <button class="menu-drawer__close" type="button" @click="$emit('close')">
            <X :size="20" />
          </button>
        </div>

        <!-- Body -->
        <div class="menu-drawer__body">
          <!-- Main nav -->
          <nav class="menu-drawer__section">
            <NuxtLink
              v-for="item in NAV"
              :key="item.to"
              :to="item.to"
              class="menu-drawer__link"
              @click="$emit('close')"
            >
              <component :is="item.icon" :size="17" class="menu-drawer__link-icon" />
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="menu-drawer__divider" />

          <!-- Cabinet -->
          <div class="menu-drawer__section">
            <p class="menu-drawer__section-title">Кабінет</p>
            <NuxtLink
              v-for="item in CABINET"
              :key="item.to"
              :to="item.to"
              class="menu-drawer__link"
              @click="$emit('close')"
            >
              <component :is="item.icon" :size="17" class="menu-drawer__link-icon" />
              {{ item.label }}
            </NuxtLink>
          </div>

          <div class="menu-drawer__divider" />

          <!-- Extra -->
          <div class="menu-drawer__section">
            <p class="menu-drawer__section-title">Покупцям</p>
            <NuxtLink
              v-for="item in EXTRA"
              :key="item.to"
              :to="item.to"
              class="menu-drawer__link"
              @click="$emit('close')"
            >
              <component :is="item.icon" :size="17" class="menu-drawer__link-icon" />
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Footer -->
        <div class="menu-drawer__footer">
          <button class="menu-drawer__auth-btn" type="button" @click="handleAuth">
            <User :size="16" />
            {{ authStore.isLoggedIn ? (authStore.user?.firstName ?? 'Кабінет') : 'Увійти' }}
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="open" class="menu-drawer__backdrop" @click="$emit('close')" />
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.menu-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100dvh;
  background: $color-white;
  z-index: $z-modal;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-xl;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid $color-gray-100;
    height: 64px;
    flex-shrink: 0;
    gap: 8px;
  }

  &__feedback {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: $radius-full;
    border: 1px solid $color-primary;
    background: none;
    color: $color-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-primary;
      color: $color-white;
    }
  }

  &__close {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-md;
    background: none;
    border: none;
    color: $color-gray-500;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-100;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  &__section {
    padding: 8px 0;
  }

  &__section-title {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $color-gray-400;
    padding: 8px 20px 4px;
    margin: 0;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 20px;
    font-size: $font-size-base;
    color: $color-gray-700;
    text-decoration: none;
    transition:
      background $transition-fast,
      color $transition-fast;
    border-radius: 0;

    &:hover {
      background: $color-gray-50;
      color: $color-primary;

      .menu-drawer__link-icon {
        color: $color-primary;
      }
    }

    &.router-link-active {
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }

  &__link-icon {
    color: $color-gray-400;
    flex-shrink: 0;
    transition: color $transition-fast;
  }

  &__divider {
    height: 1px;
    background: $color-gray-100;
    margin: 4px 0;
  }

  &__footer {
    padding: 16px;
    border-top: 1px solid $color-gray-100;
    flex-shrink: 0;
  }

  &__auth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px;
    border-radius: $radius-md;
    border: 1px solid $color-gray-200;
    background: $color-gray-50;
    color: $color-gray-700;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition:
      background $transition-fast,
      border-color $transition-fast;

    &:hover {
      background: $color-gray-100;
      border-color: $color-gray-300;
    }
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 40%);
    z-index: calc(#{$z-modal} - 1);
  }
}

.menu-drawer-enter-active,
.menu-drawer-leave-active {
  transition: transform $transition-base;
}

.menu-drawer-enter-from,
.menu-drawer-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
