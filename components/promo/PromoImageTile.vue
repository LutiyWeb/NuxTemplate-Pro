<script setup lang="ts">
interface Props {
  image: string
  label: string
  gradient: string
  to?: string
}

withDefaults(defineProps<Props>(), {
  to: '/',
})
</script>

<template>
  <NuxtLink :to="to" class="promo-tile">
    <div class="promo-tile__bg" :style="{ backgroundImage: `url(${image})` }" />
    <div class="promo-tile__overlay" :style="{ background: gradient }" />
    <div class="promo-tile__content">
      <h3 class="promo-tile__title">{{ label }}</h3>
    </div>
  </NuxtLink>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.promo-tile {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $radius-md;
  overflow: hidden;
  aspect-ratio: 4 / 2;
  text-decoration: none;
  color: $color-white;
  cursor: pointer;
  transition: transform $transition-base;

  &:hover {
    transform: translateY(-2px);
  }

  &:hover &__bg {
    transform: scale(1.05);
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;
    transition: transform 0.5s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.8;
    backdrop-filter: blur(2px);
  }

  &__content {
    position: relative;
    z-index: 2;
    padding: 8px 12px;
  }

  &__title {
    text-align: center;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0;
    line-height: 1.2;

    @include mixins.respond-to(lg) {
      font-size: $font-size-3xl;
    }
  }
}
</style>
