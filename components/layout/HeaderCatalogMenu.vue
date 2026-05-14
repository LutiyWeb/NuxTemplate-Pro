<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const categoriesStore = useCategoriesStore()
</script>

<template>
  <Transition name="catalog-menu">
    <div v-if="open" class="catalog-menu" @click.self="$emit('close')">
      <div class="catalog-menu__inner container">
        <div
          v-for="cat in categoriesStore.categories"
          :key="cat.id"
          class="catalog-menu__row"
        >
          <NuxtLink
            :to="`/catalog?categorySlug=${cat.slug}`"
            class="catalog-menu__parent"
            @click="$emit('close')"
          >{{ cat.name }}</NuxtLink>

          <div class="catalog-menu__subs">
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

    &:hover .catalog-menu__subs {
      display: flex;
    }

    &:hover .catalog-menu__parent {
      color: $color-primary;
      background: $color-gray-50;
    }
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

    &:hover { color: $color-primary; }
  }

  &__subs {
    display: none;
    position: absolute;
    left: 220px;
    top: 0;
    flex-direction: column;
    padding: 0 16px;
    min-width: 240px;
    border-left: 1px solid $color-gray-100;
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
