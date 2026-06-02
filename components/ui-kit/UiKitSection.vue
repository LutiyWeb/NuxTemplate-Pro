<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <section class="uk-section">
    <div class="uk-section__header">
      <h2 class="uk-section__title">{{ title }}</h2>
      <p v-if="description" class="uk-section__desc">{{ description }}</p>
    </div>

    <div v-if="$slots.preview" class="uk-section__preview">
      <slot name="preview" />
    </div>

    <slot name="code" />
    <slot name="props" />
    <slot />
  </section>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.uk-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $color-gray-500;
    margin: 0;
  }

  &__preview {
    background: $color-white;
    border: 1px solid $color-gray-200;
    border-radius: $radius-xl;
    padding: 32px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
}
</style>
