<script setup lang="ts">
interface Props {
  loading?: boolean
  title?: string
  description?: string
  image?: string
  badge?: string
}
withDefaults(defineProps<Props>(), { loading: false })
</script>

<template>
  <div class="card-vertical">
    <div class="card-vertical__image">
      <div v-if="loading" class="card-vertical__shimmer card-vertical__shimmer--image" />
      <img v-else-if="image" :src="image" :alt="title" />
      <span v-if="!loading && badge" class="card-vertical__badge">{{ badge }}</span>
    </div>
    <div class="card-vertical__body">
      <template v-if="loading">
        <div class="card-vertical__shimmer card-vertical__shimmer--title" />
        <div class="card-vertical__shimmer card-vertical__shimmer--desc" />
      </template>
      <template v-else>
        <h3 v-if="title" class="card-vertical__title">{{ title }}</h3>
        <p v-if="description" class="card-vertical__desc">{{ description }}</p>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.card-vertical {
  border-radius: $radius-xl;
  background: $color-white;
  box-shadow: $shadow-md;
  overflow: hidden;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: 0 16px 20px -4px rgb(0 0 0 / 0.1), 0 6px 8px -5px rgb(0 0 0 / 0.1);
    transform: translateY(-2px);
  }

  &__image {
    position: relative;
    aspect-ratio: 4 / 3;
    background: $color-gray-100;
    overflow: hidden;

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  &__badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgb(237 233 254);
    color: $color-primary;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: $radius-sm;
  }

  &__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $color-gray-500;
    margin: 0;
  }

  &__shimmer {
    @include mixins.shimmer;
    border-radius: $radius-md;

    &--image { width: 100%; aspect-ratio: 4/3; border-radius: 0; }
    &--title { width: 75%; height: 20px; }
    &--desc { width: 100%; height: 32px; }
  }
}
</style>
