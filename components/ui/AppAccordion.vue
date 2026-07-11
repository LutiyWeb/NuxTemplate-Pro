<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), { defaultOpen: false })
const open = ref(props.defaultOpen)
</script>

<template>
  <div class="app-accordion">
    <button class="app-accordion__trigger" type="button" @click="open = !open">
      {{ title }}
      <ChevronDown
        :class="['app-accordion__icon', { 'app-accordion__icon--open': open }]"
        :size="18"
      />
    </button>
    <div :class="['app-accordion__body', { 'app-accordion__body--open': open }]">
      <div class="app-accordion__body-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;

.app-accordion {
  border-bottom: 1px solid $color-gray-200;

  &:first-child {
    border-top: 1px solid $color-gray-200;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding: 20px 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    text-align: left;
    transition: color $transition-base;

    &:hover {
      color: $color-primary;
    }
  }

  &__icon {
    flex-shrink: 0;
    color: $color-gray-400;
    transition: transform $transition-base;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows $transition-base;

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__body-inner {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 0;
    transition: padding-bottom $transition-base;

    .app-accordion__body--open & {
      padding-bottom: 20px;
    }
  }
}
</style>
