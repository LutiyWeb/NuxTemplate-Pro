<script setup lang="ts">
import { MessageSquare, X } from 'lucide-vue-next'
import { reviewSchema } from '~/api/reviews'
import type { Review } from '~/types/review'

const props = defineProps<{ productId: number }>()

const authStore = useAuthStore()
const uiStore = useUiStore()
const toastStore = useToastStore()

// в”Ђв”Ђ Mock reviews (replace with API when /api/products/:id/reviews is ready) в”Ђв”Ђ
const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'РђР»РµРєСЃРµР№ Рљ.',
    initials: 'РђРљ',
    rating: 5,
    text: 'РћС‚Р»РёС‡РЅС‹Р№ С‚РѕРІР°СЂ, РїРѕР»РЅРѕСЃС‚СЊСЋ СЃРѕРѕС‚РІРµС‚СЃС‚РІСѓРµС‚ РѕРїРёСЃР°РЅРёСЋ. Р”РѕСЃС‚Р°РІРєР° Р±С‹СЃС‚СЂР°СЏ, СѓРїР°РєРѕРІРєР° РЅР°РґС‘Р¶РЅР°СЏ. РћРґРЅРѕР·РЅР°С‡РЅРѕ СЂРµРєРѕРјРµРЅРґСѓСЋ!',
    createdAt: '2026-04-15T10:30:00Z',
  },
  {
    id: 2,
    author: 'РњР°СЂРёРЅР° РЎ.',
    initials: 'РњРЎ',
    rating: 4,
    text: 'РҐРѕСЂРѕС€РµРµ СЃРѕРѕС‚РЅРѕС€РµРЅРёРµ С†РµРЅР°/РєР°С‡РµСЃС‚РІРѕ. РќРµРјРЅРѕРіРѕ РЅРµ РґРѕС‚СЏРіРёРІР°РµС‚ РґРѕ РѕР¶РёРґР°РЅРёР№ РїРѕ РјРµР»РѕС‡Р°Рј, РЅРѕ РІ С†РµР»РѕРј РѕС‡РµРЅСЊ РґРѕРІРѕР»РµРЅ РїРѕРєСѓРїРєРѕР№.',
    createdAt: '2026-04-02T14:20:00Z',
  },
  {
    id: 3,
    author: 'Р”РјРёС‚СЂРёР№ Р’.',
    initials: 'Р”Р’',
    rating: 5,
    text: 'Р’С‚РѕСЂРѕР№ СЂР°Р· РїРѕРєСѓРїР°СЋ. РќРµ СЂР°Р·РѕС‡Р°СЂРѕРІР°Р»СЃСЏ. РљР°С‡РµСЃС‚РІРѕ СЃС‚Р°Р±РёР»СЊРЅРѕРµ, РІСЃС‘ СЂР°Р±РѕС‚Р°РµС‚ РєР°Рє РЅР°РґРѕ.',
    createdAt: '2026-03-28T09:15:00Z',
  },
  {
    id: 4,
    author: 'РћР»СЊРіР° Рќ.',
    initials: 'РћРќ',
    rating: 3,
    text: 'Р’ С†РµР»РѕРј РЅРѕСЂРјР°Р»СЊРЅРѕ, РЅРѕ Р±С‹Р»Рё РЅРµР±РѕР»СЊС€РёРµ РїСЂРѕР±Р»РµРјС‹ СЃ СѓРїР°РєРѕРІРєРѕР№ РїСЂРё РґРѕСЃС‚Р°РІРєРµ. РџСЂРѕРґР°РІРµС† Р±С‹СЃС‚СЂРѕ СЂРµС€РёР» РІРѕРїСЂРѕСЃ.',
    createdAt: '2026-03-10T18:45:00Z',
  },
]

const reviews = ref<Review[]>([...MOCK_REVIEWS])
const visibleCount = ref(3)
const visibleReviews = computed(() => reviews.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < reviews.value.length)

const avgRating = computed(() => {
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((s, r) => s + r.rating, 0)
  return Math.round((sum / reviews.value.length) * 10) / 10
})

const ratingCounts = computed(() => {
  const counts = [0, 0, 0, 0, 0]
  reviews.value.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++
  })
  return counts.reverse()
})

// в”Ђв”Ђ Dialog в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const dialogOpen = ref(false)

function openDialog() {
  if (!authStore.isLoggedIn) {
    uiStore.authModalOpen = true
    return
  }
  formRating.value = 0
  formText.value = ''
  formErrors.value = {}
  dialogOpen.value = true
}

// в”Ђв”Ђ Form в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const formRating = ref(0)
const formText = ref('')
const formErrors = ref<{ rating?: string; text?: string }>({})
const submitting = ref(false)

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
}

async function submit() {
  formErrors.value = {}
  const result = reviewSchema.safeParse({ rating: formRating.value, text: formText.value })
  if (!result.success) {
    result.error.issues.forEach((e) => {
      const key = e.path[0] as 'rating' | 'text'
      if (!formErrors.value[key]) formErrors.value[key] = e.message
    })
    return
  }

  submitting.value = true
  try {
    // TODO: replace with real API call when /api/products/:id/reviews is ready
    // await authFetch(`/api/products/${props.productId}/reviews`, {
    //   method: 'POST',
    //   body: { rating: formRating.value, text: formText.value },
    // })

    await new Promise((r) => setTimeout(r, 500)) // simulate request

    const user = authStore.user
    const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'РђРЅРѕРЅРёРј'
    const newReview: Review = {
      id: Date.now(),
      author: name,
      initials: initials(name),
      rating: formRating.value,
      text: formText.value,
      createdAt: new Date().toISOString(),
    }
    reviews.value.unshift(newReview)
    visibleCount.value = Math.max(visibleCount.value, 1)
    dialogOpen.value = false
    toastStore.add('РћС‚Р·С‹РІ СѓСЃРїРµС€РЅРѕ РґРѕР±Р°РІР»РµРЅ!')
  } catch {
    toastStore.add('РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ РѕС‚Р·С‹РІ', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="product-reviews">
    <!-- Header -->
    <div class="product-reviews__header">
      <div class="product-reviews__header-left">
        <h2 class="product-reviews__title">РћС‚Р·С‹РІС‹</h2>
        <span class="product-reviews__count">{{ reviews.length }}</span>
      </div>
      <AppButton variant="primary" size="md" @click="openDialog">
        <MessageSquare :size="16" />
        РќР°РїРёСЃР°С‚СЊ РѕС‚Р·С‹РІ
      </AppButton>
    </div>

    <!-- Summary -->
    <div v-if="reviews.length" class="product-reviews__summary">
      <div class="product-reviews__avg">
        <span class="product-reviews__avg-num">{{ avgRating }}</span>
        <ReviewStars :rating="avgRating" :size="20" />
        <span class="product-reviews__avg-sub">{{ reviews.length }} РѕС‚Р·С‹РІРѕРІ</span>
      </div>
      <div class="product-reviews__bars">
        <div v-for="(count, i) in ratingCounts" :key="i" class="product-reviews__bar-row">
          <span class="product-reviews__bar-label">{{ 5 - i }} в…</span>
          <div class="product-reviews__bar-track">
            <div
              class="product-reviews__bar-fill"
              :style="{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }"
            />
          </div>
          <span class="product-reviews__bar-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="product-reviews__empty">
      <MessageSquare :size="40" class="product-reviews__empty-icon" />
      <p>РћС‚Р·С‹РІРѕРІ РїРѕРєР° РЅРµС‚. Р‘СѓРґСЊС‚Рµ РїРµСЂРІС‹Рј!</p>
    </div>

    <!-- List -->
    <div v-if="reviews.length" class="product-reviews__list">
      <ReviewCard v-for="review in visibleReviews" :key="review.id" :review="review" />
    </div>

    <!-- Load more -->
    <div v-if="hasMore" class="product-reviews__more">
      <AppButton variant="outline" size="md" @click="visibleCount += 3">
        РџРѕРєР°Р·Р°С‚СЊ РµС‰С‘
      </AppButton>
    </div>

    <!-- Dialog -->
    <Teleport to="body">
      <div v-if="dialogOpen" class="review-dialog-overlay" @click.self="dialogOpen = false">
        <div class="review-dialog">
          <div class="review-dialog__head">
            <h3 class="review-dialog__title">РќР°РїРёСЃР°С‚СЊ РѕС‚Р·С‹РІ</h3>
            <button class="review-dialog__close" type="button" @click="dialogOpen = false">
              <X :size="14" />
            </button>
          </div>

          <div class="review-dialog__body">
            <!-- Star picker -->
            <div class="review-dialog__field">
              <label class="review-dialog__label">РћС†РµРЅРєР°</label>
              <ReviewStars
                v-model:rating="formRating"
                :rating="formRating"
                :size="28"
                interactive
              />
              <span v-if="formErrors.rating" class="review-dialog__error">{{
                formErrors.rating
              }}</span>
            </div>

            <!-- Text -->
            <div class="review-dialog__field">
              <label class="review-dialog__label">Р’Р°С€ РѕС‚Р·С‹РІ</label>
              <textarea
                v-model="formText"
                class="review-dialog__textarea"
                :class="{ 'review-dialog__textarea--error': formErrors.text }"
                placeholder="Р Р°СЃСЃРєР°Р¶РёС‚Рµ Рѕ СЃРІРѕС‘Рј РѕРїС‹С‚Рµ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ С‚РѕРІР°СЂР°..."
                rows="5"
              />
              <div class="review-dialog__field-footer">
                <span v-if="formErrors.text" class="review-dialog__error">{{
                  formErrors.text
                }}</span>
                <span class="review-dialog__char-count">{{ formText.length }} / 1000</span>
              </div>
            </div>
          </div>

          <div class="review-dialog__footer">
            <AppButton variant="outline" size="md" @click="dialogOpen = false"
              >РћС‚РјРµРЅР°</AppButton
            >
            <AppButton variant="primary" size="md" :loading="submitting" @click="submit">
              РћС‚РїСЂР°РІРёС‚СЊ РѕС‚Р·С‹РІ
            </AppButton>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.product-reviews {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid $color-gray-100;

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

  // Summary block
  &__summary {
    display: flex;
    gap: 32px;
    padding: 24px;
    background: $color-gray-50;
    border-radius: $radius-xl;
    border: 1px solid $color-gray-100;
    flex-wrap: wrap;
  }

  &__avg {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 100px;
  }

  &__avg-num {
    font-size: 48px;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    line-height: 1;
  }

  &__avg-sub {
    font-size: $font-size-xs;
    color: $color-gray-400;
  }

  &__bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
  }

  &__bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__bar-label {
    font-size: $font-size-xs;
    color: $color-gray-500;
    width: 28px;
    flex-shrink: 0;
  }

  &__bar-track {
    flex: 1;
    height: 6px;
    background: $color-gray-200;
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    background: $color-warning;
    border-radius: $radius-full;
    transition: width 0.4s ease;
  }

  &__bar-count {
    font-size: $font-size-xs;
    color: $color-gray-400;
    width: 16px;
    text-align: right;
    flex-shrink: 0;
  }

  // Empty
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 0;
    color: $color-gray-400;
    text-align: center;
    font-size: $font-size-sm;
  }

  &__empty-icon {
    color: $color-gray-200;
  }

  // List
  &__list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    @include mixins.respond-to(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  // More button
  &__more {
    display: flex;
    justify-content: center;
  }
}

// в”Ђв”Ђ Review Dialog в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
.review-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: $z-modal;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.15s ease;
}

.review-dialog {
  background: $color-white;
  border-radius: $radius-xl;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 24px 48px rgb(0 0 0 / 20%);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__close {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $color-gray-100;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background $transition-fast;
    &:hover {
      background: $color-gray-200;
    }
  }

  &__body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
  }

  &__textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-family: $font-family-base;
    font-size: $font-size-sm;
    color: $color-gray-900;
    resize: vertical;
    min-height: 120px;
    outline: none;
    transition: border-color $transition-fast;
    background: $color-white;

    &::placeholder {
      color: $color-gray-400;
    }
    &:focus {
      border-color: $color-primary;
    }
    &--error {
      border-color: $color-danger;
    }
  }

  &__field-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__error {
    font-size: $font-size-xs;
    color: $color-danger;
  }

  &__char-count {
    font-size: $font-size-xs;
    color: $color-gray-400;
    margin-left: auto;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid $color-gray-100;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
