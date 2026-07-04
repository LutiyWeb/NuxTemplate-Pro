<script setup lang="ts">
import type AppCaptcha from '~/components/common/AppCaptcha.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean]; 'back-to-login': [] }>()

const authStore = useAuthStore()
const toastStore = useToastStore()
const email = ref('')
const formError = ref('')
const captchaToken = ref('')
const captchaRef = ref<InstanceType<typeof AppCaptcha> | null>(null)

watch(
  () => props.open,
  (val) => {
    if (!val) {
      email.value = ''
      formError.value = ''
      captchaToken.value = ''
      authStore.error = null
    }
  },
)

function onCaptchaVerify(token: string) {
  captchaToken.value = token
}

function onCaptchaExpired() {
  captchaToken.value = ''
}

async function submit() {
  formError.value = ''
  if (!email.value) return
  if (!captchaToken.value) {
    formError.value = 'Пройдите проверку капчи'
    return
  }
  try {
    await authStore.forgotPassword(email.value, captchaToken.value)
    emit('update:open', false)
    toastStore.add(`Посилання для відновлення пароля надіслано на ${email.value}`, 'success')
  } catch {
    captchaToken.value = ''
    captchaRef.value?.reset()
  }
}
</script>

<template>
  <AppModal :open="open" @update:open="emit('update:open', $event)">
    <h2 class="forgot-modal__title">Відновлення пароля</h2>
    <p class="forgot-modal__desc">Введіть email, і ми надішлемо посилання для скидання пароля.</p>

    <form class="app-modal__form" @submit.prevent="submit">
      <AppInputText v-model="email" label="Email" placeholder="email@example.com" type="email" />

      <AppCaptcha
        ref="captchaRef"
        @verify="onCaptchaVerify"
        @expired="onCaptchaExpired"
      />

      <p v-if="formError || authStore.error" class="app-modal__error">
        {{ formError || authStore.error }}
      </p>

      <AppButton
        type="submit"
        variant="primary"
        size="md"
        :loading="authStore.loading"
        style="width: 100%"
      >
        Відновити пароль
      </AppButton>

      <button type="button" class="app-modal__secondary-btn" @click="$emit('back-to-login')">
        ← Назад до входу
      </button>
    </form>
  </AppModal>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.forgot-modal {
  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin-bottom: 8px;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $color-gray-500;
    margin-bottom: 24px;
    line-height: 1.6;
  }
}
</style>
