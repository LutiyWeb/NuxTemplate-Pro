<script setup lang="ts">
import { X, Flame } from 'lucide-vue-next'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const categoriesStore = useCategoriesStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="sidebar">
      <div v-if="open" class="header-sidebar">
        <div class="header-sidebar__backdrop" @click="$emit('close')" />
        <div class="header-sidebar__panel">
          <div class="header-sidebar__head">
            <span class="header-sidebar__title">Каталог</span>
            <button class="header-sidebar__close" type="button" @click="$emit('close')">
              <X :size="14" />
            </button>
          </div>

          <nav class="header-sidebar__nav">
            <div
              v-for="cat in categoriesStore.categories"
              :key="cat.id"
              class="header-sidebar__group"
            >
              <NuxtLink
                :to="`/catalog?categorySlug=${cat.slug}`"
                class="header-sidebar__parent"
                @click="$emit('close')"
                >{{ cat.name }}</NuxtLink
              >
            </div>
          </nav>

          <NuxtLink to="/promo" class="header-sidebar__promo" @click="$emit('close')">
            <Flame :size="16" /> Акции и скидки
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.header-sidebar {
  position: fixed;
  inset: 0;
  z-index: $z-modal;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 50%);
  }

  &__panel {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    background: $color-white;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }

  &__close {
    width: 32px;
    height: 32px;
    background: $color-gray-100;
    border-radius: $radius-full;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-200;
    }
  }

  &__nav {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__parent {
    display: block;
    padding: 10px 12px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-gray-100;
      color: $color-primary;
    }
  }

  &__promo {
    display: block;
    margin: 16px;
    padding: 12px 16px;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: $color-white;
    border-radius: $radius-lg;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    text-align: center;
  }
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity $transition-base;
}
.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}
.sidebar-enter-active .header-sidebar__panel,
.sidebar-leave-active .header-sidebar__panel {
  transition: transform $transition-base;
}
.sidebar-enter-from .header-sidebar__panel,
.sidebar-leave-to .header-sidebar__panel {
  transform: translateX(-100%);
}
</style>
