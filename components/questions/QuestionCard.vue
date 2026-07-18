<script setup lang="ts">
import type { Question } from '~/types/question'

defineProps<{ question: Question }>()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <article class="question-card">
    <div class="question-card__head">
      <div class="question-card__avatar">{{ question.initials }}</div>
      <div class="question-card__meta">
        <span class="question-card__author">{{ question.author }}</span>
        <span class="question-card__date">{{ formatDate(question.createdAt) }}</span>
      </div>
      <span v-if="!question.answer" class="question-card__pending">Очікує на відповідь</span>
    </div>
    <p class="question-card__text">{{ question.text }}</p>

    <div v-if="question.answer" class="question-card__answer">
      <span class="question-card__answer-label">Відповідь продавця</span>
      <p class="question-card__answer-text">{{ question.answer }}</p>
    </div>
  </article>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.question-card {
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
    background: $color-secondary;
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

  &__pending {
    flex-shrink: 0;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-warning;
    background: rgb(245 158 11 / 12%);
    padding: 4px 10px;
    border-radius: $radius-full;
    white-space: nowrap;
  }

  &__text {
    font-size: $font-size-sm;
    color: $color-gray-700;
    line-height: $line-height-relaxed;
  }

  &__answer {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 16px;
    background: $color-gray-50;
    border-radius: $radius-md;
    border-left: 3px solid $color-primary;
  }

  &__answer-label {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-primary;
  }

  &__answer-text {
    font-size: $font-size-sm;
    color: $color-gray-700;
    line-height: $line-height-relaxed;
    margin: 0;
  }
}
</style>
