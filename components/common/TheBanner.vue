<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'dark'
}
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>

<template>
  <div :class="['the-banner', `the-banner--${variant}`]">
    <div v-if="$slots.eyebrow" class="the-banner__eyebrow">
      <slot name="eyebrow" />
    </div>
    <slot />
    <div v-if="$slots.actions" class="the-banner__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="scss">
.the-banner {
  border-radius: $radius-2xl;
  padding: 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  @include mixins.respond-to(md) {
    padding: 48px 32px;
  }

  &--primary {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: $color-white;
  }

  &--dark {
    background: linear-gradient(135deg, $color-gray-800 0%, $color-gray-900 100%);
    color: $color-white;
  }

  &__eyebrow {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.75;
  }

  &__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
