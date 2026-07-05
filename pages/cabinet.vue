<script setup lang="ts">
import { User, MapPin, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Личный кабинет — Nexus Commerce' })

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const activeSection = ref((route.query.section as string) || 'profile')
const isMobileNavOpen = ref(false)
useScrollLock(isMobileNavOpen)

function selectAndClose(key: string) {
  select(key)
  isMobileNavOpen.value = false
}

watch(
  () => route.query.section,
  (val) => {
    if (val) activeSection.value = val as string
  },
)

const sections = [
  { key: 'profile', label: 'Личные данные', icon: User },
  { key: 'addresses', label: 'Адреса доставки', icon: MapPin },
  { key: 'orders', label: 'История заказов', icon: ShoppingBag },
  { key: 'favorites', label: 'Избранное', icon: Heart },
]

function select(key: string) {
  activeSection.value = key
  router.replace({ query: { section: key } })
}

function logout() {
  authStore.logout()
  navigateTo('/')
}
</script>

<template>
  <div class="cabinet container">
    <div class="cabinet__layout">
      <!-- Sidebar -->
      <aside class="cabinet__sidebar">
        <div class="cabinet__user">
          <div class="cabinet__avatar">
            {{ authStore.user?.firstName?.[0]?.toUpperCase() }}
          </div>
          <div class="cabinet__user-info">
            <p class="cabinet__name">
              {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
            </p>
            <p class="cabinet__email">{{ authStore.user?.email }}</p>
          </div>
          <button class="cabinet__nav-toggle" type="button" @click="isMobileNavOpen = true">
            <ChevronDown :size="18" />
          </button>
        </div>

        <nav class="cabinet__nav">
          <button
            v-for="s in sections"
            :key="s.key"
            :class="['cabinet__nav-item', { 'cabinet__nav-item--active': activeSection === s.key }]"
            type="button"
            @click="select(s.key)"
          >
            <component :is="s.icon" :size="16" />
            {{ s.label }}
          </button>
        </nav>

        <button class="cabinet__logout" type="button" @click="logout">
          <LogOut :size="16" /> Выйти
        </button>

        <!-- Mobile nav drawer -->
        <Teleport to="body">
          <Transition name="fade">
            <div
              v-if="isMobileNavOpen"
              class="cabinet__drawer-backdrop"
              @click="isMobileNavOpen = false"
            />
          </Transition>
          <Transition name="slide-up">
            <div v-if="isMobileNavOpen" class="cabinet__drawer">
              <div class="cabinet__drawer-head">
                <span class="cabinet__drawer-title">Навігація</span>
                <button
                  class="cabinet__drawer-close"
                  type="button"
                  @click="isMobileNavOpen = false"
                >
                  ✕
                </button>
              </div>
              <nav class="cabinet__drawer-nav">
                <button
                  v-for="s in sections"
                  :key="s.key"
                  :class="[
                    'cabinet__drawer-item',
                    { 'cabinet__drawer-item--active': activeSection === s.key },
                  ]"
                  type="button"
                  @click="selectAndClose(s.key)"
                >
                  <component :is="s.icon" :size="16" />
                  {{ s.label }}
                </button>
              </nav>
              <button class="cabinet__drawer-logout" type="button" @click="logout">
                <LogOut :size="16" /> Выйти
              </button>
            </div>
          </Transition>
        </Teleport>
      </aside>

      <!-- Content -->
      <main class="cabinet__main">
        <CabinetProfile v-if="activeSection === 'profile'" />
        <CabinetAddresses v-else-if="activeSection === 'addresses'" />
        <CabinetOrders v-else-if="activeSection === 'orders'" />
        <CabinetFavorites v-else-if="activeSection === 'favorites'" />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.cabinet {
  padding-block: 40px;

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: flex-start;
    @include mixins.respond-to(md) {
      grid-template-columns: 240px 1fr;
    }
  }

  &__sidebar {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    overflow: hidden;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__nav-toggle {
    margin-left: auto;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $color-gray-100;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-gray-500;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-200;
    }

    @include mixins.respond-to(md) {
      display: none;
    }
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: $radius-full;
    background: $color-primary;
    color: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    flex-shrink: 0;
  }

  &__user-info {
    min-width: 0;
  }
  &__name {
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
    color: $color-gray-900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__email {
    color: $color-gray-400;
    font-size: $font-size-xs;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__nav {
    padding: 8px;
    display: none;
    flex-direction: column;
    gap: 2px;

    @include mixins.respond-to(md) {
      display: flex;
    }
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-gray-100;
      color: $color-gray-900;
    }
    &--active {
      background: $color-primary;
      color: $color-white;
    }
  }

  &__logout {
    display: none;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 20px;
    border-top: 1px solid $color-gray-100;
    font-size: $font-size-sm;
    color: $color-danger;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: rgb(239 68 68 / 5%);
    }

    @include mixins.respond-to(md) {
      display: flex;
    }
  }

  // Mobile drawer
  &__drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 40%);
    z-index: calc(#{$z-modal} - 1);
  }

  &__drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: $color-white;
    border-radius: $radius-xl $radius-xl 0 0;
    z-index: $z-modal;
    box-shadow: $shadow-xl;
  }

  &__drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__drawer-title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__drawer-close {
    width: 32px;
    height: 32px;
    background: $color-gray-100;
    border-radius: $radius-full;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-sm;
  }

  &__drawer-nav {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__drawer-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
    padding: 12px 14px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-gray-100;
      color: $color-gray-900;
    }
    &--active {
      background: $color-primary;
      color: $color-white;
    }
  }

  &__drawer-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 20px;
    margin-top: 4px;
    border-top: 1px solid $color-gray-100;
    font-size: $font-size-sm;
    color: $color-danger;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: rgb(239 68 68 / 5%);
    }
  }

  &__main {
    min-height: 400px;
  }
}
</style>
