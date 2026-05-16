<script setup lang="ts">
import { z } from 'zod'

const text1 = ref('')
const text2 = ref('')
const text3 = ref('')
const password = ref('')
const checkbox = ref(false)
const radio = ref('option1')
const select = ref('')

// Zod error state demo
const zodSchema = z.object({
  email: z.string().email('Введите корректный email'),
  name: z.string().min(2, 'Минимум 2 символа'),
})
const zodForm = reactive({ email: '', name: '' })
const zodErrors = ref<Record<string, string>>({})

function validateZod() {
  const result = zodSchema.safeParse(zodForm)
  zodErrors.value = {}
  if (!result.success) {
    result.error.errors.forEach(e => {
      const key = e.path[0] as string
      if (!zodErrors.value[key]) zodErrors.value[key] = e.message
    })
  } else {
    zodErrors.value = {}
  }
}

const INPUT_CODE = `<AppInputText
  v-model="value"
  label="Название поля"
  placeholder="Введите значение"
  :error="errors.field"
/>`

const ZOD_CODE = `const schema = z.object({
  email: z.string().email('Введите корректный email'),
})
const errors = ref({})

function validate() {
  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(e => {
      errors.value[e.path[0]] = e.message
    })
  }
}`

const PROPS = [
  { name: 'modelValue', type: 'string', description: 'Значение (v-model)' },
  { name: 'label', type: 'string', description: 'Текст метки над полем' },
  { name: 'placeholder', type: 'string', description: 'Плейсхолдер' },
  { name: 'error', type: 'string', description: 'Текст ошибки валидации' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокировать поле' },
]
</script>

<template>
  <div class="uikit-forms">

    <UiKitSection title="AppInputText" description="Текстовое поле на базе PrimeVue InputText">
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 400px">
          <AppInputText v-model="text1" label="Нормальное состояние" placeholder="Введите текст" />
          <AppInputText v-model="text2" label="С ошибкой" placeholder="Введите текст" error="Это поле обязательно" />
          <AppInputText v-model="text3" label="Заблокировано" placeholder="Недоступно" :disabled="true" />
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="INPUT_CODE" />
      </template>
      <template #props>
        <UiKitPropsTable :rows="PROPS" />
      </template>
    </UiKitSection>

    <UiKitSection title="AppPasswordInput" description="Поле пароля с переключателем видимости">
      <template #preview>
        <div style="width: 100%; max-width: 400px">
          <AppPasswordInput v-model="password" label="Пароль" placeholder="Введите пароль" />
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock code="<AppPasswordInput v-model=\"password\" label=\"Пароль\" />" />
      </template>
    </UiKitSection>

    <UiKitSection title="Checkbox и Radio" description="Нативные элементы со стилями проекта">
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 12px">
          <label class="uk-form-check">
            <input v-model="checkbox" type="checkbox" class="uk-form-check__input" />
            <span>Согласен с условиями</span>
          </label>
          <label class="uk-form-check">
            <input v-model="radio" type="radio" value="option1" class="uk-form-check__input" />
            <span>Вариант 1</span>
          </label>
          <label class="uk-form-check">
            <input v-model="radio" type="radio" value="option2" class="uk-form-check__input" />
            <span>Вариант 2</span>
          </label>
        </div>
        <div style="font-size: 13px; color: #6b7280; margin-top: 8px">
          checkbox: {{ checkbox }} · radio: {{ radio }}
        </div>
      </template>
    </UiKitSection>

    <UiKitSection title="Zod-валидация" description="Нажми 'Проверить' чтобы увидеть ошибки валидации">
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 400px">
          <AppInputText v-model="zodForm.name" label="Имя" placeholder="Иван" :error="zodErrors.name" />
          <AppInputText v-model="zodForm.email" label="Email" placeholder="example@mail.com" :error="zodErrors.email" />
          <AppButton variant="outline" size="sm" @click="validateZod">Проверить валидацию</AppButton>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="ZOD_CODE" language="ts" />
      </template>
    </UiKitSection>

  </div>
</template>

<style lang="scss">
.uikit-forms { display: flex; flex-direction: column; gap: 40px; }

.uk-form-check {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: $font-size-sm;
  color: $color-gray-700;

  &__input {
    width: 16px;
    height: 16px;
    accent-color: $color-primary;
    cursor: pointer;
  }
}
</style>
