<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="app-empty">
    <div class="app-empty__icon">
      <slot name="icon" />
    </div>
    <p class="app-empty__title">{{ title }}</p>
    <p v-if="description" class="app-empty__desc">{{ description }}</p>
    <div v-if="$slots.action" class="app-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style lang="scss">
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  gap: 12px;

  &__icon {
    color: $color-gray-300;
    margin-bottom: 8px;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-gray-700;
    margin: 0;
  }

  &__desc {
    font-size: $font-size-base;
    color: $color-gray-400;
    margin: 0;
    max-width: 320px;
  }

  &__action {
    margin-top: 8px;
  }
}
</style>
