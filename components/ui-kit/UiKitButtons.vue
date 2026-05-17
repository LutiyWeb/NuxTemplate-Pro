<script setup lang="ts">
import { Trash2, Plus, ArrowRight } from 'lucide-vue-next'

const loadingDemo = ref(false)
function triggerLoading() {
  loadingDemo.value = true
  setTimeout(() => {
    loadingDemo.value = false
  }, 2000)
}

const VARIANTS_CODE = `<AppButton variant="primary">Основная</AppButton>
<AppButton variant="secondary">Вторичная</AppButton>
<AppButton variant="outline">Outline</AppButton>
<AppButton variant="ghost">Ghost</AppButton>
<AppButton variant="danger">Danger</AppButton>`

const SIZES_CODE = `<AppButton size="sm">Small</AppButton>
<AppButton size="md">Medium</AppButton>
<AppButton size="lg">Large</AppButton>`

const STATES_CODE = `<AppButton :loading="true">Загрузка...</AppButton>
<AppButton :disabled="true">Недоступна</AppButton>`

const ICON_CODE = `<AppButton variant="primary">
  <Plus :size="16" /> Добавить
</AppButton>
<AppButton variant="outline">
  Далее <ArrowRight :size="16" />
</AppButton>
<AppButton variant="danger">
  <Trash2 :size="16" />
</AppButton>`

const PROPS = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
    default: "'primary'",
    description: 'Визуальный стиль кнопки',
  },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Размер кнопки' },
  { name: 'tag', type: "'button' | 'a' | 'span'", default: "'button'", description: 'HTML тег' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокировать кнопку' },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Состояние загрузки (показывает спиннер)',
  },
]
</script>

<template>
  <div class="uikit-buttons">
    <UiKitSection
      title="Варианты"
      description="Все доступные визуальные стили компонента AppButton"
    >
      <template #preview>
        <AppButton variant="primary">Основная</AppButton>
        <AppButton variant="secondary">Вторичная</AppButton>
        <AppButton variant="outline">Outline</AppButton>
        <AppButton variant="ghost">Ghost</AppButton>
        <AppButton variant="danger">Danger</AppButton>
      </template>
      <template #code>
        <UiKitCodeBlock :code="VARIANTS_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection title="Размеры">
      <template #preview>
        <AppButton size="sm">Small</AppButton>
        <AppButton size="md">Medium</AppButton>
        <AppButton size="lg">Large</AppButton>
      </template>
      <template #code>
        <UiKitCodeBlock :code="SIZES_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection title="Состояния" description="Нажми на кнопку 'Загрузка' для демонстрации">
      <template #preview>
        <AppButton :loading="loadingDemo" @click="triggerLoading">
          {{ loadingDemo ? 'Загружается...' : 'Нажми для загрузки' }}
        </AppButton>
        <AppButton :disabled="true">Недоступна</AppButton>
      </template>
      <template #code>
        <UiKitCodeBlock :code="STATES_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection title="С иконками">
      <template #preview>
        <AppButton variant="primary"><Plus :size="16" /> Добавить</AppButton>
        <AppButton variant="outline">Далее <ArrowRight :size="16" /></AppButton>
        <AppButton variant="danger"><Trash2 :size="16" /></AppButton>
      </template>
      <template #code>
        <UiKitCodeBlock :code="ICON_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection title="Пропсы">
      <UiKitPropsTable :rows="PROPS" />
    </UiKitSection>
  </div>
</template>

<style lang="scss">
.uikit-buttons {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
