<script setup lang="ts">
const toastStore = useToastStore()

const customMessage = ref('Моё сообщение')
const customType = ref<'success' | 'error' | 'warning'>('success')

const USAGE_CODE = `import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()

// Добавить тост
toastStore.add('Товар добавлен в корзину', 'success')
toastStore.add('Недостаточно товара на складе', 'error')
toastStore.add('Товар добавлен в избранное', 'warning')`

const STORE_CODE = `// stores/toast.ts
export type ToastType = 'success' | 'error' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

// Тост автоматически исчезает через 3.5 секунды`
</script>

<template>
  <div class="uikit-toasts">
    <UiKitSection
      title="Виды тостов"
      description="Три типа уведомлений: успех, ошибка, предупреждение"
    >
      <template #preview>
        <div style="display: flex; flex-wrap: wrap; gap: 12px">
          <AppButton
            variant="primary"
            size="sm"
            @click="toastStore.add('Товар успешно добавлен в корзину', 'success')"
          >
            Success
          </AppButton>
          <AppButton
            variant="danger"
            size="sm"
            @click="toastStore.add('Не удалось выполнить операцию', 'error')"
          >
            Error
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            @click="toastStore.add('Товар добавлен в избранное', 'warning')"
          >
            Warning
          </AppButton>
        </div>
      </template>
    </UiKitSection>

    <UiKitSection title="Конструктор тоста" description="Создай своё сообщение">
      <template #preview>
        <div
          style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 480px"
        >
          <AppInputText v-model="customMessage" label="Текст сообщения" />
          <div style="display: flex; gap: 8px">
            <label
              v-for="t in ['success', 'error', 'warning']"
              :key="t"
              class="uikit-toasts__radio"
            >
              <input v-model="customType" type="radio" :value="t" />
              {{ t }}
            </label>
          </div>
          <AppButton
            variant="outline"
            size="sm"
            style="align-self: flex-start"
            @click="toastStore.add(customMessage || 'Пустое сообщение', customType)"
          >
            Показать тост
          </AppButton>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="USAGE_CODE" language="ts" />
      </template>
    </UiKitSection>

    <UiKitSection title="API тостов">
      <UiKitPropsTable
        :rows="[
          {
            name: 'add(message, type)',
            type: 'function',
            description: 'Показать тост. Исчезает через 3.5 сек',
          },
          { name: 'remove(id)', type: 'function', description: 'Удалить тост по id' },
          { name: 'toasts', type: 'Toast[]', description: 'Текущий список тостов' },
        ]"
      />
      <UiKitCodeBlock :code="STORE_CODE" language="ts" />
    </UiKitSection>
  </div>
</template>

<style lang="scss">
.uikit-toasts {
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__radio {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $font-size-sm;
    color: $color-gray-700;
    cursor: pointer;

    input {
      accent-color: $color-primary;
      cursor: pointer;
    }
  }
}
</style>
