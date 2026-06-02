<script setup lang="ts">
useHead({ title: 'Створення нового пароля — Nexus Commerce' })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const token = computed(() => route.query.token as string | undefined)

const password = ref('')
const confirm = ref('')
const fieldError = ref('')
const done = ref(false)

async function submit() {
  fieldError.value = ''

  if (!password.value || !confirm.value) {
    fieldError.value = 'Заповніть усі поля'
    return
  }
  if (password.value.length < 8) {
    fieldError.value = 'Пароль має містити мінімум 8 символів'
    return
  }
  if (password.value !== confirm.value) {
    fieldError.value = 'Паролі не збігаються'
    return
  }

  try {
    await authStore.resetPassword(token.value!, password.value)
    done.value = true
    toastStore.add('Пароль успішно змінено', 'success')
  } catch {}
}
</script>

<template>
  <div class="reset-page container">
    <!-- No token in URL -->
    <template v-if="!token">
      <div class="reset-page__card reset-page__card--error">
        <TheTitle tag="h1" size="m">Недійсне посилання</TheTitle>
        <p class="reset-page__text">
          Посилання для скидання пароля недійсне або застаріло. Спробуйте надіслати запит знову.
        </p>
        <NuxtLink to="/" class="reset-page__back">← На головну</NuxtLink>
      </div>
    </template>

    <!-- Success state -->
    <template v-else-if="done">
      <div class="reset-page__card reset-page__card--success">
        <div class="reset-page__icon">✓</div>
        <TheTitle tag="h1" size="m">Пароль змінено</TheTitle>
        <p class="reset-page__text">Ви можете увійти до облікового запису з новим паролем.</p>
        <AppButton variant="primary" size="md" @click="router.push('/')"> На головну </AppButton>
      </div>
    </template>

    <!-- Form -->
    <template v-else>
      <div class="reset-page__card">
        <TheTitle tag="h1" size="m">Створення нового пароля</TheTitle>
        <p class="reset-page__text">Введіть новий пароль для вашого облікового запису.</p>

        <form class="reset-page__form" @submit.prevent="submit">
          <AppPasswordInput
            v-model="password"
            label="Новий пароль"
            placeholder="Мінімум 8 символів"
          />
          <AppPasswordInput
            v-model="confirm"
            label="Підтвердження пароля"
            placeholder="Повторіть пароль"
          />

          <p v-if="fieldError || authStore.error" class="reset-page__error">
            {{ fieldError || authStore.error }}
          </p>

          <AppButton
            type="submit"
            variant="primary"
            size="md"
            :loading="authStore.loading"
            style="width: 100%"
          >
            Зберегти
          </AppButton>
        </form>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.reset-page {
  padding-block: 80px;
  display: flex;
  justify-content: center;

  &__card {
    width: 100%;
    max-width: 440px;
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: $shadow-md;

    &--success {
      align-items: center;
      text-align: center;
    }
  }

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: $radius-full;
    background: rgb(34 197 94 / 12%);
    color: $color-success;
    font-size: 24px;
    font-weight: $font-weight-bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__text {
    font-size: $font-size-sm;
    color: $color-gray-500;
    line-height: 1.6;
    margin: 0;
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

  &__back {
    font-size: $font-size-sm;
    color: $color-primary;
    transition: color $transition-fast;

    &:hover {
      color: $color-primary-dark;
    }
  }
}
</style>
