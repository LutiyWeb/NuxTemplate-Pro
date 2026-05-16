<script setup lang="ts">
definePageMeta({ middleware: ['dev-only'] })
useSeoMeta({ title: 'UI Kit — Nexus Dev' })

const route = useRoute()

const SECTIONS = [
  { slug: 'buttons',    label: 'Кнопки' },
  { slug: 'forms',      label: 'Формы' },
  { slug: 'modals',     label: 'Модалки' },
  { slug: 'cards',      label: 'Карточки' },
  { slug: 'icons',      label: 'Иконки' },
  { slug: 'navigation', label: 'Навигация' },
  { slug: 'toasts',     label: 'Тосты' },
]

const COMPONENTS: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  buttons:    defineAsyncComponent(() => import('~/components/ui-kit/UiKitButtons.vue')),
  forms:      defineAsyncComponent(() => import('~/components/ui-kit/UiKitForms.vue')),
  modals:     defineAsyncComponent(() => import('~/components/ui-kit/UiKitModals.vue')),
  cards:      defineAsyncComponent(() => import('~/components/ui-kit/UiKitCards.vue')),
  icons:      defineAsyncComponent(() => import('~/components/ui-kit/UiKitIcons.vue')),
  navigation: defineAsyncComponent(() => import('~/components/ui-kit/UiKitNavigation.vue')),
  toasts:     defineAsyncComponent(() => import('~/components/ui-kit/UiKitToasts.vue')),
}

const current = computed(() => String(route.params.component))
const currentLabel = computed(() => SECTIONS.find(s => s.slug === current.value)?.label ?? '')
const CurrentComponent = computed(() => COMPONENTS[current.value] ?? null)
</script>

<template>
  <div class="uikit">
    <!-- Sidebar -->
    <aside class="uikit__sidebar">
      <div class="uikit__sidebar-logo">
        <span class="uikit__sidebar-badge">DEV</span>
        UI Kit
      </div>
      <nav class="uikit__nav">
        <NuxtLink
          v-for="s in SECTIONS"
          :key="s.slug"
          :to="`/ui/${s.slug}`"
          :class="['uikit__nav-item', { 'uikit__nav-item--active': current === s.slug }]"
        >
          {{ s.label }}
        </NuxtLink>
      </nav>
      <div class="uikit__sidebar-footer">
        <NuxtLink to="/" class="uikit__back-link">← На сайт</NuxtLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="uikit__main">
      <div class="uikit__main-header">
        <h1 class="uikit__main-title">{{ currentLabel }}</h1>
      </div>

      <div class="uikit__content">
        <component :is="CurrentComponent" v-if="CurrentComponent" />
        <div v-else class="uikit__empty">
          <p>Выберите компонент в сайдбаре</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.uikit {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
  background: #f8f9fb;

  // ── Sidebar ──────────────────────────────────────────────────────────────
  &__sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    background: $color-white;
    border-right: 1px solid $color-gray-100;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &__sidebar-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 20px 16px;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    border-bottom: 1px solid $color-gray-100;
  }

  &__sidebar-badge {
    font-size: 10px;
    font-weight: $font-weight-bold;
    background: $color-primary;
    color: $color-white;
    padding: 2px 6px;
    border-radius: $radius-sm;
    letter-spacing: 0.05em;
  }

  &__nav {
    flex: 1;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__nav-item {
    display: block;
    padding: 9px 12px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-600;
    text-decoration: none;
    transition: background $transition-fast, color $transition-fast;

    &:hover { background: $color-gray-50; color: $color-gray-900; }

    &--active {
      background: rgb(99 102 241 / 8%);
      color: $color-primary;
      font-weight: $font-weight-semibold;
    }
  }

  &__sidebar-footer {
    padding: 16px;
    border-top: 1px solid $color-gray-100;
  }

  &__back-link {
    font-size: $font-size-xs;
    color: $color-gray-400;
    text-decoration: none;
    &:hover { color: $color-primary; }
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  &__main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  &__main-header {
    padding: 24px 32px 0;
    border-bottom: 1px solid $color-gray-100;
    background: $color-white;
  }

  &__main-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    padding-bottom: 20px;
  }

  &__content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__empty {
    padding: 80px;
    text-align: center;
    color: $color-gray-400;
  }
}
</style>
