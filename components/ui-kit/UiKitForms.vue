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
  email: z.string().email('Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ email'),
  name: z.string().min(2, 'РњРёРЅРёРјСѓРј 2 СЃРёРјРІРѕР»Р°'),
})
const zodForm = reactive({ email: '', name: '' })
const zodErrors = ref<Record<string, string>>({})

function validateZod() {
  const result = zodSchema.safeParse(zodForm)
  zodErrors.value = {}
  if (!result.success) {
    result.error.issues.forEach(e => {
      const key = e.path[0] as string
      if (!zodErrors.value[key]) zodErrors.value[key] = e.message
    })
  } else {
    zodErrors.value = {}
  }
}

const INPUT_CODE = `<AppInputText
  v-model="value"
  label="РќР°Р·РІР°РЅРёРµ РїРѕР»СЏ"
  placeholder="Р’РІРµРґРёС‚Рµ Р·РЅР°С‡РµРЅРёРµ"
  :error="errors.field"
/>`

const ZOD_CODE = `const schema = z.object({
  email: z.string().email('Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ email'),
})
const errors = ref({})

function validate() {
  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach(e => {
      errors.value[e.path[0]] = e.message
    })
  }
}`

const PROPS = [
  { name: 'modelValue', type: 'string', description: 'Р—РЅР°С‡РµРЅРёРµ (v-model)' },
  { name: 'label', type: 'string', description: 'РўРµРєСЃС‚ РјРµС‚РєРё РЅР°Рґ РїРѕР»РµРј' },
  { name: 'placeholder', type: 'string', description: 'РџР»РµР№СЃС…РѕР»РґРµСЂ' },
  { name: 'error', type: 'string', description: 'РўРµРєСЃС‚ РѕС€РёР±РєРё РІР°Р»РёРґР°С†РёРё' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Р—Р°Р±Р»РѕРєРёСЂРѕРІР°С‚СЊ РїРѕР»Рµ' },
]
</script>

<template>
  <div class="uikit-forms">

    <UiKitSection title="AppInputText" description="РўРµРєСЃС‚РѕРІРѕРµ РїРѕР»Рµ РЅР° Р±Р°Р·Рµ PrimeVue InputText">
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 400px">
          <AppInputText v-model="text1" label="РќРѕСЂРјР°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ" placeholder="Р’РІРµРґРёС‚Рµ С‚РµРєСЃС‚" />
          <AppInputText v-model="text2" label="РЎ РѕС€РёР±РєРѕР№" placeholder="Р’РІРµРґРёС‚Рµ С‚РµРєСЃС‚" error="Р­С‚Рѕ РїРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ" />
          <AppInputText v-model="text3" label="Р—Р°Р±Р»РѕРєРёСЂРѕРІР°РЅРѕ" placeholder="РќРµРґРѕСЃС‚СѓРїРЅРѕ" :disabled="true" />
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="INPUT_CODE" />
      </template>
      <template #props>
        <UiKitPropsTable :rows="PROPS" />
      </template>
    </UiKitSection>

    <UiKitSection title="AppPasswordInput" description="РџРѕР»Рµ РїР°СЂРѕР»СЏ СЃ РїРµСЂРµРєР»СЋС‡Р°С‚РµР»РµРј РІРёРґРёРјРѕСЃС‚Рё">
      <template #preview>
        <div style="width: 100%; max-width: 400px">
          <AppPasswordInput v-model="password" label="РџР°СЂРѕР»СЊ" placeholder="Р’РІРµРґРёС‚Рµ РїР°СЂРѕР»СЊ" />
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock code="<AppPasswordInput v-model=\"password\" label=\"РџР°СЂРѕР»СЊ\" />" />
      </template>
    </UiKitSection>

    <UiKitSection title="Checkbox Рё Radio" description="РќР°С‚РёРІРЅС‹Рµ СЌР»РµРјРµРЅС‚С‹ СЃРѕ СЃС‚РёР»СЏРјРё РїСЂРѕРµРєС‚Р°">
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 12px">
          <label class="uk-form-check">
            <input v-model="checkbox" type="checkbox" class="uk-form-check__input" />
            <span>РЎРѕРіР»Р°СЃРµРЅ СЃ СѓСЃР»РѕРІРёСЏРјРё</span>
          </label>
          <label class="uk-form-check">
            <input v-model="radio" type="radio" value="option1" class="uk-form-check__input" />
            <span>Р’Р°СЂРёР°РЅС‚ 1</span>
          </label>
          <label class="uk-form-check">
            <input v-model="radio" type="radio" value="option2" class="uk-form-check__input" />
            <span>Р’Р°СЂРёР°РЅС‚ 2</span>
          </label>
        </div>
        <div style="font-size: 13px; color: #6b7280; margin-top: 8px">
          checkbox: {{ checkbox }} В· radio: {{ radio }}
        </div>
      </template>
    </UiKitSection>

    <UiKitSection title="Zod-РІР°Р»РёРґР°С†РёСЏ" description="РќР°Р¶РјРё 'РџСЂРѕРІРµСЂРёС‚СЊ' С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РѕС€РёР±РєРё РІР°Р»РёРґР°С†РёРё">
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 400px">
          <AppInputText v-model="zodForm.name" label="РРјСЏ" placeholder="РРІР°РЅ" :error="zodErrors.name" />
          <AppInputText v-model="zodForm.email" label="Email" placeholder="example@mail.com" :error="zodErrors.email" />
          <AppButton variant="outline" size="sm" @click="validateZod">РџСЂРѕРІРµСЂРёС‚СЊ РІР°Р»РёРґР°С†РёСЋ</AppButton>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="ZOD_CODE" language="ts" />
      </template>
    </UiKitSection>

  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
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

