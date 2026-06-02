<script setup lang="ts">
import { Star } from 'lucide-vue-next'

interface Props {
  rating: number
  interactive?: boolean
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  size: 16,
})

const emit = defineEmits<{ 'update:rating': [number] }>()

const hovered = ref(0)

const displayed = computed(() =>
  props.interactive && hovered.value ? hovered.value : props.rating,
)

function pick(n: number) {
  if (props.interactive) emit('update:rating', n)
}
</script>

<template>
  <div :class="['review-stars', { 'review-stars--interactive': interactive }]">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="review-stars__star"
      :aria-label="`${n} звезд`"
      @click="pick(n)"
      @mouseenter="interactive && (hovered = n)"
      @mouseleave="interactive && (hovered = 0)"
    >
      <Star
        :size="size"
        :fill="n <= displayed ? 'currentColor' : 'none'"
        :class="[
          'review-stars__icon',
          n <= displayed ? 'review-stars__icon--filled' : 'review-stars__icon--empty',
        ]"
      />
    </button>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.review-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;

  &__star {
    display: flex;
    padding: 0;
    background: none;
    border: none;
    line-height: 0;
  }

  &__icon {
    transition:
      color $transition-fast,
      transform $transition-fast;
    &--filled {
      color: $color-warning;
    }
    &--empty {
      color: $color-gray-300;
    }
  }

  &--interactive &__star {
    cursor: pointer;
    &:hover .review-stars__icon {
      transform: scale(1.15);
    }
  }
}
</style>
