<script setup lang="ts">
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 's' | 'm' | 'l'
}

withDefaults(defineProps<Props>(), { tag: 'h2', size: 'm' })
</script>

<template>
  <component :is="tag" :class="['the-title', `the-title--${size}`]">
    <slot />
  </component>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.the-title {
  font-weight: $font-weight-bold;
  color: $color-gray-900;
  line-height: $line-height-tight;

  &--s {
    font-size: $title-size-s;
  }
  &--m {
    font-size: $title-size-m;
  }
  &--l {
    font-size: $title-size-l;
  }
}
</style>
