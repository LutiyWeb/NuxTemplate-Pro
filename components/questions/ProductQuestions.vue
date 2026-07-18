<script setup lang="ts">
import { MessageCircleQuestion } from 'lucide-vue-next'
import type { Question } from '~/types/question'

defineProps<{ productId: number }>()

// ── Mock questions (replace with API when /api/products/:id/questions is ready) ──
const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    author: 'Ігор П.',
    initials: 'ІП',
    text: 'Чи підходить цей товар для щоденного інтенсивного використання?',
    createdAt: '2026-04-20T09:00:00Z',
    answer: 'Так, товар розрахований на щоденне інтенсивне використання без втрати якості.',
    answeredAt: '2026-04-20T14:00:00Z',
  },
  {
    id: 2,
    author: 'Наталія В.',
    initials: 'НВ',
    text: 'Яка гарантія виробника надається на цей товар?',
    createdAt: '2026-04-05T11:30:00Z',
  },
]

const questions = ref<Question[]>([...MOCK_QUESTIONS])

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
}

function handleSubmitted(payload: { text: string; name: string; email: string }) {
  const name = payload.name || 'Анонім'
  questions.value.unshift({
    id: Date.now(),
    author: name,
    initials: initials(name),
    text: payload.text,
    createdAt: new Date().toISOString(),
  })
}
</script>

<template>
  <section class="product-questions">
    <div class="product-questions__header">
      <div class="product-questions__header-left">
        <h2 class="product-questions__title">Питання</h2>
        <span v-if="questions.length" class="product-questions__count">{{ questions.length }}</span>
      </div>
      <AskQuestionButton :product-id="productId" @submitted="handleSubmitted" />
    </div>

    <div v-if="questions.length" class="product-questions__list">
      <QuestionCard v-for="question in questions" :key="question.id" :question="question" />
    </div>

    <AppEmpty
      v-else
      title="Питань поки немає"
      description="Будьте першим, хто задасть питання про цей товар"
    >
      <template #icon>
        <MessageCircleQuestion :size="56" :stroke-width="1.2" />
      </template>
    </AppEmpty>
  </section>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.product-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;

  @include mixins.respond-to(lg) {
    margin-top: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__count {
    background: $color-gray-100;
    color: $color-gray-600;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    border-radius: $radius-full;
    padding: 2px 10px;
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @include mixins.respond-to(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
