<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const categoriesStore = useCategoriesStore()
const activeId      = ref<number | null>(null)
const isOverflowing = ref(false)

const rowEls:  Record<number, HTMLElement> = {}
const subsEls: Record<number, HTMLElement> = {}

function activate(id: number) {
  activeId.value = id

  const rowEl  = rowEls[id]
  const subsEl = subsEls[id]
  if (!rowEl || !subsEl) { isOverflowing.value = false; return }

  const rowRect   = rowEl.getBoundingClientRect()
  const subsHeight = subsEl.offsetHeight

  isOverflowing.value = window.innerHeight - rowRect.top < subsHeight
}
</script>

<template>
  <Transition name="catalog-menu">
    <div v-if="open" class="catalog-menu" @click.self="$emit('close')">
      <div class="catalog-menu__inner container" @mouseleave="activeId = null">
        <div
          v-for="cat in categoriesStore.categories"
          :key="cat.id"
          :ref="el => { if (el) rowEls[cat.id] = el as HTMLElement }"
          class="catalog-menu__row"
        >
          <NuxtLink
            :to="`/catalog?categorySlug=${cat.slug}`"
            :class="['catalog-menu__parent', { 'catalog-menu__parent--active': activeId === cat.id }]"
            @mouseenter="activate(cat.id)"
            @click="$emit('close')"
          >{{ cat.name }}</NuxtLink>

          <div
            v-if="cat.subcategories?.length"
            :ref="el => { if (el) subsEls[cat.id] = el as HTMLElement }"
            :class="[
              'catalog-menu__subs',
              { 'catalog-menu__subs--active': activeId === cat.id },
              { 'catalog-menu__subs--flip':   activeId === cat.id && isOverflowing },
            ]"
          >
            <NuxtLink
              v-for="sub in cat.subcategories"
              :key="sub.id"
              :to="`/catalog?categorySlug=${sub.slug}`"
              class="catalog-menu__sub"
              @click="$emit('close')"
            >{{ sub.name }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.catalog-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $color-white;
  border-top: 1px solid $color-gray-100;
  box-shadow: $shadow-lg;
  z-index: $z-dropdown;

  &__inner {
    padding-block: 8px;
  }

  &__row {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  &__parent {
    width: 220px;
    flex-shrink: 0;
    padding: 9px 16px;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-800;
    border-radius: $radius-md;
    transition: color $transition-fast, background $transition-fast;

    &:hover,
    &--active {
      color: $color-primary;
      background: $color-gray-50;
    }
  }

  &__subs {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 220px;
    top: 0;
    padding: 0 16px;
    min-width: 240px;
    border-left: 1px solid $color-gray-100;

    // скрыто по умолчанию — но остаётся в DOM для измерения высоты
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity $transition-fast;

    &--active {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }

    // если не помещается снизу — растём вверх
    &--flip {
      top: auto;
      bottom: 0;
    }
  }

  &__sub {
    width: 100%;
    padding: 9px 12px;
    font-size: $font-size-sm;
    color: $color-gray-500;
    border-radius: $radius-md;
    transition: color $transition-fast, background $transition-fast;

    &:hover { color: $color-primary; background: $color-gray-50; }
  }
}

.catalog-menu-enter-active,
.catalog-menu-leave-active { transition: opacity $transition-fast, transform $transition-fast; }
.catalog-menu-enter-from,
.catalog-menu-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
