<script setup lang="ts">
interface Props {
  loading?: boolean
  title?: string
  description?: string
  image?: string
  badge?: string
  imageRight?: boolean
}
withDefaults(defineProps<Props>(), { loading: false, imageRight: false })
</script>

<template>
  <div :class="['card-horizontal', { 'card-horizontal--image-right': imageRight }]">
    <div class="card-horizontal__image">
      <div v-if="loading" class="card-horizontal__shimmer card-horizontal__shimmer--image" />
      <AppImage
        v-else-if="image"
        :src="image"
        :alt="title"
        :sizes="{ mobile: { w: 640, h: 300 }, desktop: { w: 280, h: 200 } }"
      />
      <div v-else class="card-horizontal__placeholder" />
    </div>
    <div class="card-horizontal__body">
      <template v-if="loading">
        <div class="card-horizontal__shimmer card-horizontal__shimmer--badge" />
        <div class="card-horizontal__shimmer card-horizontal__shimmer--title" />
        <div class="card-horizontal__shimmer card-horizontal__shimmer--desc" />
      </template>
      <template v-else>
        <span v-if="badge" class="card-horizontal__badge">{{ badge }}</span>
        <h3 v-if="title" class="card-horizontal__title">{{ title }}</h3>
        <p v-if="description" class="card-horizontal__desc">{{ description }}</p>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.card-horizontal {
  display: grid;
  grid-template-columns: 1fr;
  border-radius: $radius-xl;
  background: $color-white;
  box-shadow: $shadow-card;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition:
    box-shadow $transition-base,
    transform $transition-base;

  &:hover {
    box-shadow: $shadow-card-hover;
    transform: translateY(-2px);
  }

  @include mixins.respond-to(md) {
    grid-template-columns: 280px 1fr;
  }

  &--image-right &__body {
    order: 1;
  }

  &__image {
    min-height: 200px;
    background: $color-gray-100;
    overflow: hidden;
    --ai-height: 100%;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    background: $color-gray-100;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    padding: 24px;
  }

  &__badge {
    display: inline-block;
    width: fit-content;
    background: rgb(237 233 254);
    color: $color-primary;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: $radius-sm;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $color-gray-500;
    line-height: $line-height-relaxed;
    margin: 0;
  }

  &__shimmer {
    @include mixins.shimmer;
    border-radius: $radius-md;

    &--image {
      width: 100%;
      height: 200px;
      border-radius: 0;
    }
    &--badge {
      width: 60px;
      height: 20px;
    }
    &--title {
      width: 70%;
      height: 24px;
    }
    &--desc {
      width: 100%;
      height: 40px;
    }
  }
}
</style>
