<script setup lang="ts">
interface Props {
  title: string
  description?: string | null
  mediaUrl: string
  mediaType?: 'image' | 'video'
  linkUrl?: string | null
}

withDefaults(defineProps<Props>(), {
  mediaType: 'image',
})
</script>

<template>
  <NuxtLink :to="linkUrl ?? '/'" class="hero-banner">
    <div class="hero-banner__content">
      <h2 class="hero-banner__title">{{ title }}</h2>
      <p v-if="description" class="hero-banner__sub">{{ description }}</p>
      <span v-if="linkUrl" class="hero-banner__cta">Дивитись</span>
    </div>
    <div class="hero-banner__image">
      <video
        v-if="mediaType === 'video'"
        :src="mediaUrl"
        class="hero-banner__img"
        autoplay
        muted
        loop
        playsinline
      />
      <img
        v-else
        :src="mediaUrl"
        :alt="title"
        class="hero-banner__img"
        width="340"
        height="340"
        loading="eager"
        fetchpriority="high"
      />
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.hero-banner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 480px;
  padding: 16px 20px;
  border-radius: $radius-2xl;
  background: $color-gray-100;
  text-decoration: none;

  @include mixins.respond-to(md) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    min-height: 600px;
    padding: 40px 64px;
    gap: 48px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1 1 0;
    min-width: 0;
    text-align: center;

    @include mixins.respond-to(md) {
      align-items: flex-start;
      gap: 16px;
      text-align: left;
    }
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    margin: 0;
    color: $color-gray-900;
    line-height: 1.2;
    max-width: 520px;

    @include mixins.respond-to(md) {
      font-size: $font-size-4xl;
    }
  }

  &__sub {
    font-size: $font-size-xs;
    color: $color-gray-500;
    margin: 0;
    max-width: 440px;

    @include mixins.respond-to(md) {
      font-size: $font-size-base;
    }
  }

  &__cta {
    display: inline-flex;
    align-self: center;
    padding: 8px 16px;
    background: $color-primary;
    color: $color-white;
    border-radius: $radius-md;
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
    transition: background $transition-fast;

    @include mixins.respond-to(md) {
      align-self: flex-start;
      padding: 12px 24px;
      font-size: $font-size-base;
    }

    &:hover {
      background: $color-primary-dark;
    }
  }

  &__image {
    display: flex;
    order: -1;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @include mixins.respond-to(md) {
      order: 0;
      flex: 0 0 38%;
      max-width: 38%;
    }
  }

  &__img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    display: block;

    @include mixins.respond-to(md) {
      aspect-ratio: auto;
      max-height: 510px;
    }
  }
}
</style>
