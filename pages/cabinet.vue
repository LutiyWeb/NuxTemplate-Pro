<script setup lang="ts">
import { User, MapPin, ShoppingBag, Heart, LogOut } from 'lucide-vue-next'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Личный кабинет — Nexus Commerce' })

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const activeSection = ref((route.query.section as string) || 'profile')

watch(() => route.query.section, (val) => {
  if (val) activeSection.value = val as string
})

const sections = [
  { key: 'profile',   label: 'Личные данные',    icon: User },
  { key: 'addresses', label: 'Адреса доставки',   icon: MapPin },
  { key: 'orders',    label: 'История заказов',   icon: ShoppingBag },
  { key: 'favorites', label: 'Избранное',          icon: Heart },
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
            <p class="cabinet__name">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
            <p class="cabinet__email">{{ authStore.user?.email }}</p>
          </div>
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
      </aside>

      <!-- Content -->
      <main class="cabinet__main">
        <CabinetProfile   v-if="activeSection === 'profile'" />
        <CabinetAddresses v-else-if="activeSection === 'addresses'" />
        <CabinetOrders    v-else-if="activeSection === 'orders'" />
        <CabinetFavorites v-else-if="activeSection === 'favorites'" />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
.cabinet {
  padding-block: 40px;

  &__layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 24px;
    align-items: flex-start;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  &__sidebar {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    overflow: hidden;
    position: sticky;
    top: 80px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
    border-bottom: 1px solid $color-gray-100;
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

  &__user-info { min-width: 0; }
  &__name { font-weight: $font-weight-semibold; font-size: $font-size-sm; color: $color-gray-900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__email { color: $color-gray-400; font-size: $font-size-xs; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  &__nav {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
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
    transition: background $transition-fast, color $transition-fast;

    &:hover { background: $color-gray-100; color: $color-gray-900; }
    &--active { background: $color-primary; color: $color-white; }
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 20px;
    border-top: 1px solid $color-gray-100;
    font-size: $font-size-sm;
    color: $color-danger;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover { background: rgb(239 68 68 / 5%); }
  }

  &__main {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 28px;
    min-height: 400px;
  }
}
</style>
