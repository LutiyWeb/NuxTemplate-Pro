<script setup lang="ts">
import { X, Flame, ChevronRight, ArrowLeft } from 'lucide-vue-next'
import type { Category } from '~/types/product'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const categoriesStore = useCategoriesStore()
const activeCategory = ref<Category | null>(null)
const direction = ref<'forward' | 'back'>('forward')

watch(
  () => props.open,
  (val) => {
    if (!val) activeCategory.value = null
  },
)

function selectCategory(cat: Category) {
  if (cat.subcategories?.length) {
    direction.value = 'forward'
    activeCategory.value = cat
  }
}

function goBack() {
  direction.value = 'back'
  activeCategory.value = null
}

function close() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sidebar">
      <div v-if="open" class="header-sidebar">
        <div class="header-sidebar__backdrop" @click="close" />
        <div class="header-sidebar__panel">
          <Transition
            :name="direction === 'forward' ? 'slide-forward' : 'slide-back'"
            mode="out-in"
          >
            <!-- Level 1: Categories -->
            <div v-if="!activeCategory" key="level1" class="header-sidebar__level">
              <div class="header-sidebar__head">
                <span class="header-sidebar__title">Каталог</span>
                <button class="header-sidebar__close" type="button" @click="close">
                  <X :size="14" />
                </button>
              </div>

              <nav class="header-sidebar__nav">
                <button
                  v-for="cat in categoriesStore.categories"
                  :key="cat.id"
                  class="header-sidebar__cat-btn"
                  type="button"
                  @click="selectCategory(cat)"
                >
                  {{ cat.name }}
                  <ChevronRight
                    v-if="cat.subcategories?.length"
                    :size="16"
                    class="header-sidebar__chevron"
                  />
                </button>
              </nav>

              <NuxtLink to="/promo" class="header-sidebar__promo" @click="close">
                <Flame :size="16" /> Акції та знижки
              </NuxtLink>
            </div>

            <!-- Level 2: Subcategories -->
            <div v-else key="level2" class="header-sidebar__level">
              <div class="header-sidebar__head">
                <button class="header-sidebar__back" type="button" @click="goBack">
                  <ArrowLeft :size="16" />
                  Назад
                </button>
                <button class="header-sidebar__close" type="button" @click="close">
                  <X :size="14" />
                </button>
              </div>

              <nav class="header-sidebar__nav">
                <NuxtLink
                  :to="`/catalog?categorySlug=${activeCategory.slug}`"
                  class="header-sidebar__all-link"
                  @click="close"
                >
                  Всі {{ activeCategory.name }}
                </NuxtLink>

                <NuxtLink
                  v-for="sub in activeCategory.subcategories"
                  :key="sub.id"
                  :to="`/catalog?categorySlug=${sub.slug}`"
                  class="header-sidebar__cat-btn header-sidebar__cat-btn--sub"
                  @click="close"
                >
                  {{ sub.name }}
                </NuxtLink>
              </nav>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
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
    overflow: hidden;
  }

  &__level {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    overflow-y: auto;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid $color-gray-100;
    flex-shrink: 0;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }

  &__back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-600;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 0;
    transition: color $transition-fast;

    &:hover {
      color: $color-gray-900;
    }
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
    flex-shrink: 0;

    &:hover {
      background: $color-gray-200;
    }
  }

  &__nav {
    flex: 1;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__cat-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 12px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: $color-gray-100;
      color: $color-primary;
    }

    &--sub {
      font-weight: $font-weight-normal;
      color: $color-gray-600;
    }
  }

  &__chevron {
    color: $color-gray-400;
    flex-shrink: 0;
  }

  &__all-link {
    display: block;
    padding: 10px 12px;
    margin-bottom: 4px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-primary;
    border-bottom: 1px solid $color-gray-100;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-50;
    }
  }

  &__promo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 16px;
    padding: 12px 16px;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: $color-white;
    border-radius: $radius-lg;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    flex-shrink: 0;
  }
}

// Sidebar open/close
.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity $transition-base;

  .header-sidebar__panel {
    transition: transform $transition-base;
  }
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;

  .header-sidebar__panel {
    transform: translateX(-100%);
  }
}

// Level transitions
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition:
    transform $transition-base,
    opacity $transition-fast;
}

.slide-forward-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-forward-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-back-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-back-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
