<script setup lang="ts">
import { Paperclip, X } from 'lucide-vue-next'
import { questionSchema, QUESTION_MAX_FILES, QUESTION_MAX_FILE_SIZE } from '~/api/questions'

interface Props {
  open: boolean
  productId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [boolean]
  submitted: [{ text: string; name: string; email: string }]
}>()

const authStore = useAuthStore()
const toastStore = useToastStore()

const text = ref('')
const name = ref('')
const email = ref('')
const notifyByEmail = ref(true)
const files = ref<File[]>([])
const previews = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const fileError = ref('')

const errors = ref<Record<string, string>>({})
const submitting = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    const user = authStore.user
    name.value = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
    email.value = user?.email ?? ''
    text.value = ''
    notifyByEmail.value = true
    errors.value = {}
    fileError.value = ''
    clearFiles()
  },
)

function pickFiles() {
  fileInput.value?.click()
}

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const picked = Array.from(input.files ?? [])
  input.value = ''
  fileError.value = ''

  for (const file of picked) {
    if (files.value.length >= QUESTION_MAX_FILES) {
      fileError.value = `Максимум ${QUESTION_MAX_FILES} файлів`
      break
    }
    if (!file.type.startsWith('image/')) {
      fileError.value = 'Дозволені лише зображення'
      continue
    }
    if (file.size > QUESTION_MAX_FILE_SIZE) {
      fileError.value = 'Розмір файлу не має перевищувати 5 МБ'
      continue
    }
    files.value.push(file)
    previews.value.push(URL.createObjectURL(file))
  }
}

function removeFile(index: number) {
  URL.revokeObjectURL(previews.value[index])
  files.value.splice(index, 1)
  previews.value.splice(index, 1)
}

function clearFiles() {
  previews.value.forEach((url) => URL.revokeObjectURL(url))
  files.value = []
  previews.value = []
}

function close() {
  emit('update:open', false)
}

async function submit() {
  const result = questionSchema.safeParse({ text: text.value, name: name.value, email: email.value })
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    errors.value = Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']))
    return
  }
  errors.value = {}

  submitting.value = true
  try {
    // TODO: replace with real API call when /api/products/:id/questions is ready
    // await authFetch(`/api/products/${props.productId}/questions`, {
    //   method: 'POST',
    //   body: { text: text.value, name: name.value, email: email.value, notifyByEmail: notifyByEmail.value },
    // })
    await new Promise((resolve) => setTimeout(resolve, 500))

    emit('submitted', { text: text.value, name: name.value, email: email.value })
    toastStore.add('Питання надіслано і очікує на модерацію', 'success')
    close()
  } catch {
    toastStore.add('Не вдалося надіслати питання', 'error')
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(clearFiles)
</script>

<template>
  <AppModal :open="open" @update:open="emit('update:open', $event)">
    <h3 class="ask-question-modal__title">Поставити запитання</h3>

    <form class="app-modal__form" @submit.prevent="submit">
      <div class="ask-question-modal__field">
        <label class="ask-question-modal__label">Ваше запитання</label>
        <textarea
          v-model="text"
          class="ask-question-modal__textarea"
          :class="{ 'ask-question-modal__textarea--error': errors.text }"
          placeholder="Опишіть, що б ви хотіли дізнатися про товар..."
          rows="4"
        />
        <span v-if="errors.text" class="app-modal__error">{{ errors.text }}</span>
      </div>

      <div class="ask-question-modal__field">
        <label class="ask-question-modal__label">Фото (необов'язково)</label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="ask-question-modal__file-input"
          @change="onFilesSelected"
        />
        <AppButton type="button" variant="outline" size="sm" @click="pickFiles">
          <Paperclip :size="14" />
          Вибрати файли
        </AppButton>

        <div v-if="previews.length" class="ask-question-modal__previews">
          <div v-for="(src, i) in previews" :key="src" class="ask-question-modal__preview">
            <img :src="src" alt="" class="ask-question-modal__preview-img" />
            <button
              type="button"
              class="ask-question-modal__preview-remove"
              @click="removeFile(i)"
            >
              <X :size="12" />
            </button>
          </div>
        </div>
        <span v-if="fileError" class="app-modal__error">{{ fileError }}</span>
      </div>

      <AppInputText v-model="name" label="Ваше ім'я та прізвище" :error="errors.name" />
      <AppInputText v-model="email" label="Електронна пошта" :error="errors.email" />

      <label class="ask-question-modal__checkbox">
        <input v-model="notifyByEmail" type="checkbox" />
        Повідомляти про відповіді по електронній пошті
      </label>

      <div class="ask-question-modal__actions">
        <AppButton type="button" variant="outline" size="md" @click="close">Скасувати</AppButton>
        <AppButton type="submit" variant="primary" size="md" :loading="submitting">
          Поставити запитання
        </AppButton>
      </div>

      <p class="ask-question-modal__disclaimer">
        Питання проходить модерацію. Ознайомтесь із
        <NuxtLink to="/rules-questions" @click="close">правилами публікації</NuxtLink>.
      </p>
    </form>
  </AppModal>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.ask-question-modal {
  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0 0 20px;
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
    min-height: 100px;
    outline: none;
    background: $color-white;
    transition: border-color $transition-fast;

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

  &__file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__previews {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__preview {
    position: relative;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }

  &__preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-md;
    border: 1px solid $color-gray-200;
    display: block;
  }

  &__preview-remove {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: $radius-full;
    background: $color-gray-700;
    color: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-danger;
    }
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: $color-gray-700;
    cursor: pointer;

    input {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      accent-color: $color-primary;
      cursor: pointer;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;

    .app-btn {
      flex: 1;
    }
  }

  &__disclaimer {
    font-size: $font-size-xs;
    color: $color-gray-400;
    line-height: $line-height-relaxed;
    margin: 0;
    text-align: center;

    a {
      color: $color-primary;
    }
  }
}
</style>
