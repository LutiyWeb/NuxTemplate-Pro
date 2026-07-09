<script setup lang="ts">
import type { Review } from '~/types/review'

defineProps<{ review: Review }>()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <article class="review-card">
    <div class="review-card__head">
      <div class="review-card__avatar">{{ review.initials }}</div>
      <div class="review-card__meta">
        <span class="review-card__author">{{ review.author }}</span>
        <span class="review-card__date">{{ formatDate(review.createdAt) }}</span>
      </div>
      <ReviewStars :rating="review.rating" :size="14" class="review-card__stars" />
    </div>
    <p class="review-card__text">{{ review.text }}</p>
  </article>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.review-card {
  background: $color-white;
  border-radius: $radius-xl;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow:
    -6px 0 16px -6px rgb(0 0 0 / 6%),
    6px 0 16px -6px rgb(0 0 0 / 6%),
    0 8px 20px -4px rgb(0 0 0 / 8%);

  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: $radius-full;
    background: $color-primary;
    color: $color-white;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  &__author {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__date {
    font-size: $font-size-xs;
    color: $color-gray-400;
  }

  &__stars {
    flex-shrink: 0;
  }

  &__text {
    font-size: $font-size-sm;
    color: $color-gray-700;
    line-height: $line-height-relaxed;
  }
}
</style>
