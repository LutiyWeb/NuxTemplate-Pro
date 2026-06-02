<script setup lang="ts">
import { HomeIcon, ServerCrash, SearchX } from 'lucide-vue-next'

const props = defineProps<{
  error: { statusCode: number; statusMessage?: string; message?: string }
}>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({ title: is404.value ? '404 — Страница не найдена' : '500 — Ошибка сервера' })
</script>

<template>
  <div class="error-page container">
    <AppEmpty
      :title="is404 ? 'Страница не найдена' : 'Ошибка сервера'"
      :description="
        is404
          ? 'Такой страницы не существует или она была удалена'
          : 'Что-то пошло не так. Попробуйте обновить страницу'
      "
    >
      <template #icon>
        <SearchX v-if="is404" :size="64" :stroke-width="1.2" />
        <ServerCrash v-else :size="64" :stroke-width="1.2" />
      </template>
      <template #action>
        <div class="error-page__actions">
          <AppButton variant="primary" size="md" @click="clearError({ redirect: '/' })">
            <HomeIcon :size="16" />
            На главную
          </AppButton>
          <AppButton v-if="!is404" variant="outline" size="md" @click="clearError()">
            Попробовать снова
          </AppButton>
        </div>
      </template>
    </AppEmpty>

    <p class="error-page__code">{{ error.statusCode }}</p>
  </div>
</template>

<style lang="scss">
.error-page {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__code {
    font-size: 120px;
    font-weight: $font-weight-bold;
    color: $color-gray-100;
    margin: 0;
    line-height: 1;
    user-select: none;
    position: absolute;
    z-index: -1;
  }
}
</style>
