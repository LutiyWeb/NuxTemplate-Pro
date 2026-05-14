<script setup lang="ts">
import { Smartphone, Laptop, Headphones, Gamepad2, Tablet, Watch, Tv, Home, Camera, Briefcase, Package } from 'lucide-vue-next'
import type { Component } from 'vue'

const categoriesStore = useCategoriesStore()

const CATEGORY_ICONS: Record<string, Component> = {
  smartphones: Smartphone,
  laptops: Laptop,
  audio: Headphones,
  gaming: Gamepad2,
  tablets: Tablet,
  accessories: Watch,
  tv: Tv,
  'smart-home': Home,
  'photo-video': Camera,
  office: Briefcase,
}

function getIcon(slug: string): Component {
  return CATEGORY_ICONS[slug] ?? Package
}

const scrollEl = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateArrows() {
  const el = scrollEl.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function scrollLeft() { scrollEl.value?.scrollBy({ left: -200, behavior: 'smooth' }) }
function scrollRight() { scrollEl.value?.scrollBy({ left: 200, behavior: 'smooth' }) }

onMounted(() => {
  updateArrows()
  scrollEl.value?.addEventListener('scroll', updateArrows)
  window.addEventListener('resize', updateArrows)
})
onUnmounted(() => {
  scrollEl.value?.removeEventListener('scroll', updateArrows)
  window.removeEventListener('resize', updateArrows)
})
</script>

<template>
  <div class="category-ribbon">
    <AppArrow v-show="canScrollLeft" direction="left" class="category-ribbon__arrow category-ribbon__arrow--left" @click="scrollLeft" />

    <div ref="scrollEl" class="category-ribbon__track">
      <template v-if="categoriesStore.loading">
        <div v-for="n in 8" :key="n" class="category-ribbon__skeleton" />
      </template>
      <NuxtLink
        v-for="cat in categoriesStore.categories"
        :key="cat.id"
        :to="`/catalog?categorySlug=${cat.slug}`"
        class="category-ribbon__item"
      >
        <component :is="getIcon(cat.slug)" :size="16" class="category-ribbon__icon" />
        <span class="category-ribbon__label">{{ cat.name }}</span>
      </NuxtLink>
    </div>

    <AppArrow v-show="canScrollRight" direction="right" class="category-ribbon__arrow category-ribbon__arrow--right" @click="scrollRight" />
  </div>
</template>

<style lang="scss">
.category-ribbon {
  position: relative;
  height: 45px;
  display: flex;
  align-items: center;

  &__track {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    height: 100%;
    width: 100%;

    &::-webkit-scrollbar { display: none; }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    padding: 0 12px;
    height: 100%;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
    border-radius: $radius-md;
    transition: background $transition-fast, color $transition-fast;
    flex-shrink: 0;

    &:hover { background: $color-gray-100; color: $color-primary; }
  }

  &__icon { display: flex; flex-shrink: 0; }
  &__label { font-size: $font-size-sm; }

  &__arrow {
    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: $shadow-sm;
    opacity: 0;
    transition: opacity $transition-fast;

    &--left { left: 0; }
    &--right { right: 0; }
  }

  &:hover &__arrow { opacity: 1; }

  &__skeleton {
    @include mixins.shimmer;
    flex-shrink: 0;
    width: 90px;
    height: 32px;
    border-radius: $radius-md;
  }
}
</style>
