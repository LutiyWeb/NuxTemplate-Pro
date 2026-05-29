<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean]; success: []; 'forgot-password': [] }>()

const authStore = useAuthStore()
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const formError = ref('')

async function submit() {
  formError.value = ''
  try {
    if (mode.value === 'login') {
      if (!email.value || !password.value) {
        formError.value = 'Заполните все поля'
        return
      }
      await authStore.login(email.value, password.value)
    } else {
      if (!email.value || !password.value || !firstName.value || !lastName.value) {
        formError.value = 'Заполните все поля'
        return
      }
      if (password.value.length < 8) {
        formError.value = 'Пароль минимум 8 символов'
        return
      }
      await authStore.register({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
      })
    }
    emit('update:open', false)
    emit('success')
  } catch {}
}
</script>

<template>
  <AppModal :open="open" @update:open="emit('update:open', $event)">
    <div class="auth-modal__tabs">
      <button
        :class="['auth-modal__tab', { 'auth-modal__tab--active': mode === 'login' }]"
        type="button"
        @click="mode = 'login'"
      >
        Войти
      </button>
      <button
        :class="['auth-modal__tab', { 'auth-modal__tab--active': mode === 'register' }]"
        type="button"
        @click="mode = 'register'"
      >
        Регистрация
      </button>
    </div>

    <form class="app-modal__form" @submit.prevent="submit">
      <template v-if="mode === 'register'">
        <AppInputText v-model="firstName" label="Имя" placeholder="Иван" />
        <AppInputText v-model="lastName" label="Фамилия" placeholder="Иванов" />
      </template>
      <AppInputText v-model="email" label="Email" placeholder="email@example.com" />
      <AppPasswordInput v-model="password" label="Пароль" placeholder="Минимум 8 символов" />

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
        {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
      </AppButton>

      <button
        v-if="mode === 'login'"
        type="button"
        class="app-modal__secondary-btn"
        @click="$emit('forgot-password')"
      >
        Забыли пароль?
      </button>
    </form>
  </AppModal>
</template>

<style lang="scss">
.auth-modal {
  &__tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__tab {
    flex: 1;
    padding: 8px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-500;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;

    &--active {
      background: $color-primary;
      color: $color-white;
    }

    &:not(&--active):hover {
      background: $color-gray-100;
    }
  }
}
</style>
