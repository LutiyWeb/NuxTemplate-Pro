<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean]; success: [] }>()

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
      if (!email.value || !password.value) { formError.value = 'Заполните все поля'; return }
      await authStore.login(email.value, password.value)
    } else {
      if (!email.value || !password.value || !firstName.value || !lastName.value) {
        formError.value = 'Заполните все поля'; return
      }
      if (password.value.length < 8) { formError.value = 'Пароль минимум 8 символов'; return }
      await authStore.register({ email: email.value, password: password.value, firstName: firstName.value, lastName: lastName.value })
    }
    emit('update:open', false)
    emit('success')
  } catch {}
}

function close() { emit('update:open', false) }
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="auth-modal-overlay" @click.self="close">
      <div class="auth-modal">
        <button class="auth-modal__close" type="button" @click="close"><X :size="14" /></button>

        <div class="auth-modal__tabs">
          <button
            :class="['auth-modal__tab', { 'auth-modal__tab--active': mode === 'login' }]"
            type="button"
            @click="mode = 'login'"
          >Войти</button>
          <button
            :class="['auth-modal__tab', { 'auth-modal__tab--active': mode === 'register' }]"
            type="button"
            @click="mode = 'register'"
          >Регистрация</button>
        </div>

        <form class="auth-modal__form" @submit.prevent="submit">
          <template v-if="mode === 'register'">
            <AppInputText v-model="firstName" label="Имя" placeholder="Иван" />
            <AppInputText v-model="lastName" label="Фамилия" placeholder="Иванов" />
          </template>
          <AppInputText v-model="email" label="Email" placeholder="email@example.com" />
          <AppPasswordInput v-model="password" label="Пароль" placeholder="Минимум 8 символов" />

          <p v-if="formError || authStore.error" class="auth-modal__error">
            {{ formError || authStore.error }}
          </p>

          <AppButton type="submit" variant="primary" size="md" :loading="authStore.loading" style="width: 100%">
            {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </AppButton>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: $z-modal-overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.auth-modal {
  position: relative;
  background: $color-white;
  border-radius: $radius-xl;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  z-index: $z-modal;

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    background: $color-gray-100;
    border-radius: $radius-full;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background $transition-fast;

    &:hover { background: $color-gray-200; }
  }

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
    transition: background $transition-fast, color $transition-fast;

    &--active {
      background: $color-primary;
      color: $color-white;
    }

    &:not(&--active):hover { background: $color-gray-100; }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__error {
    font-size: $font-size-sm;
    color: $color-danger;
    margin: 0;
  }
}
</style>
