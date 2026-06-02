<script setup lang="ts">
useHead({ title: 'О нас — Nexus Commerce' })
</script>

<template>
  <div class="about-page container">
    <TheTitle tag="h1" size="m">О нас</TheTitle>
    <p class="about-page__lead">
      Nexus Commerce — современная платформа шаблонов для e-commerce проектов на Nuxt 3.
    </p>
    <div class="about-page__grid">
      <TheBanner variant="primary">
        <template #eyebrow>Наша миссия</template>
        <p>Помогать разработчикам быстро запускать качественные проекты.</p>
      </TheBanner>
      <TheBanner variant="dark">
        <template #eyebrow>Технологии</template>
        <p>Nuxt 3, Pinia, Swiper, PrimeVue, SCSS — лучший стек для продакшена.</p>
      </TheBanner>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.about-page {
  padding-block: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__lead {
    font-size: $font-size-lg;
    color: $color-gray-600;
    max-width: 640px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    @include mixins.respond-to(md) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
