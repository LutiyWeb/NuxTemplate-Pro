<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  tag?: 'button' | 'a' | 'span'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  disabled: false,
  loading: false,
})
</script>

<template>
  <component
    :is="tag"
    :class="['app-btn', `app-btn--${variant}`, `app-btn--${size}`]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="app-btn__spinner" />
    <slot />
  </component>
</template>

<style lang="scss">
.app-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: $radius-md;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  border: none;
  font-family: $font-family-base;
  transition: background $transition-fast, color $transition-fast, border-color $transition-fast, box-shadow $transition-fast;

  &:disabled { opacity: 0.55; cursor: not-allowed; }

  // Sizes
  &--sm { padding: 6px 12px; font-size: $font-size-sm; }
  &--md { padding: 10px 20px; font-size: 15px; }
  &--lg { padding: 12px 24px; font-size: $font-size-base; }

  // Variants
  &--primary {
    background: $color-primary;
    color: $color-white;
    &:not(:disabled):hover { background: $color-primary-dark; }
  }

  &--secondary {
    background: $color-white;
    color: $color-primary;
    border: 1px solid $color-white;
    &:not(:disabled):hover { background: $color-gray-100; box-shadow: $shadow-sm; }
  }

  &--outline {
    background: transparent;
    color: $color-gray-700;
    border: 1px solid $color-gray-200;
    &:not(:disabled):hover { border-color: $color-primary; color: $color-primary; background: rgb(79 70 229 / 4%); }
  }

  &--ghost {
    background: transparent;
    color: $color-gray-600;
    &:not(:disabled):hover { background: $color-gray-100; }
  }

  &--danger {
    background: $color-danger;
    color: $color-white;
    &:not(:disabled):hover { background: rgb(220 38 38); }
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
