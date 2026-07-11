<script setup lang="ts">
import { HomeIcon, ServerCrash, SearchX } from 'lucide-vue-next'

const props = defineProps<{
  error: { statusCode: number; statusMessage?: string; message?: string }
}>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({ title: is404.value ? '404 — Сторінку не знайдено' : '500 — Помилка сервера' })
</script>

<template>
  <div class="error-page container">
    <p class="error-page__code" aria-hidden="true">{{ error.statusCode }}</p>

    <div class="error-page__body">
      <div class="error-page__icon">
        <SearchX v-if="is404" :size="56" :stroke-width="1.3" />
        <ServerCrash v-else :size="56" :stroke-width="1.3" />
      </div>

      <h1 class="error-page__title">
        {{ is404 ? 'Сторінку не знайдено' : 'Помилка сервера' }}
      </h1>

      <p class="error-page__desc">
        {{
          is404
            ? 'Схоже, ця сторінка переїхала або більше не існує. Перевірте адресу або поверніться на головну.'
            : 'Щось пішло не так. Спробуйте оновити сторінку або поверніться пізніше.'
        }}
      </p>

      <div class="error-page__actions">
        <AppButton variant="primary" size="md" @click="clearError({ redirect: '/' })">
          <HomeIcon :size="16" />
          На головну
        </AppButton>
        <AppButton v-if="!is404" variant="outline" size="md" @click="clearError()">
          Спробувати знову
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.error-page {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__code {
    position: absolute;
    font-size: 240px;
    font-weight: $font-weight-bold;
    color: $color-gray-100;
    line-height: 1;
    user-select: none;
    z-index: 0;
    margin: 0;

    @include mixins.respond-to(md) {
      font-size: 320px;
    }
  }

  &__body {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    max-width: 520px;
    padding-block: 48px;
  }

  &__icon {
    color: $color-gray-300;
    margin-bottom: 8px;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0;

    @include mixins.respond-to(md) {
      font-size: $font-size-3xl;
    }
  }

  &__desc {
    font-size: $font-size-base;
    color: $color-gray-500;
    line-height: 1.6;
    margin: 0;
    max-width: 400px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
