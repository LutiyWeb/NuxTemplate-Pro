<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
interface Props {
  title: string
  subtitle: string
  gradient: string
  tag?: string
}
withDefaults(defineProps<Props>(), { tag: 'Акция' })
</script>

<template>
  <NuxtLink to="/promo" class="promo-card" :style="{ background: gradient }">
    <span class="promo-card__tag">{{ tag }}</span>
    <h3 class="promo-card__title">{{ title }}</h3>
    <p class="promo-card__subtitle">{{ subtitle }}</p>
    <span class="promo-card__cta">Смотреть <ArrowRight :size="14" /></span>
  </NuxtLink>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.promo-card {
  display: flex;
  flex-direction: column;
  border-radius: $radius-xl;
  padding: 32px;
  color: $color-white;
  min-height: 160px;
  position: relative;
  overflow: hidden;
  transition: transform $transition-base;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
  }

  &__tag {
    display: inline-block;
    width: fit-content;
    background: rgb(255 255 255 / 20%);
    border-radius: $radius-full;
    font-size: 11px;
    font-weight: $font-weight-semibold;
    padding: 4px 10px;
  }

  &__title {
    font-size: 28px;
    font-weight: $font-weight-bold;
    margin: 8px 0 4px;
  }

  &__subtitle {
    font-size: $font-size-sm;
    opacity: 0.85;
    margin: 0;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: $font-weight-semibold;
    opacity: 0.9;
    margin-top: 12px;
  }
}
</style>
