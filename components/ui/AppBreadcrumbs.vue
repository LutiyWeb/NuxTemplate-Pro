<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

interface Crumb {
  label: string
  to?: string
}

defineProps<{ crumbs: Crumb[] }>()
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs__list">
      <li v-for="(crumb, i) in crumbs" :key="i" class="breadcrumbs__item">
        <NuxtLink v-if="crumb.to && i < crumbs.length - 1" :to="crumb.to" class="breadcrumbs__link">
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="breadcrumbs__current" :aria-current="i === crumbs.length - 1 ? 'page' : undefined">
          {{ crumb.label }}
        </span>
        <ChevronRight v-if="i < crumbs.length - 1" :size="12" class="breadcrumbs__sep" aria-hidden="true" />
      </li>
    </ol>
  </nav>
</template>

<style lang="scss">
.breadcrumbs {
  &__list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__link {
    font-size: $font-size-sm;
    color: $color-gray-500;
    transition: color $transition-fast;

    &:hover { color: $color-primary; }
  }

  &__current {
    font-size: $font-size-sm;
    color: $color-gray-900;
    font-weight: $font-weight-medium;
  }

  &__sep {
    color: $color-gray-300;
    flex-shrink: 0;
  }
}
</style>
