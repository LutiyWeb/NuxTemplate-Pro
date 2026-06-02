<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { Eye, EyeOff, Trash2 } from 'lucide-vue-next'
import { profileSchema, passwordSchema } from '~/api/profile'

const authStore = useAuthStore()

const form = reactive({
  firstName: authStore.user?.firstName ?? '',
  lastName: authStore.user?.lastName ?? '',
  email: authStore.user?.email ?? '',
  phone: authStore.user?.phone ?? '',
})

const profileErrors = ref<Record<string, string>>({})
const profileSaved = ref(false)

function saveProfile() {
  const result = profileSchema.safeParse(form)
  if (!result.success) {
    profileErrors.value = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']),
    )
    return
  }
  profileErrors.value = {}
  // TODO: PATCH /api/users/me — endpoint not yet implemented
  // Optimistic local update:
  if (authStore.user) {
    authStore.user.firstName = form.firstName
    authStore.user.lastName = form.lastName
    authStore.user.phone = form.phone
    if (process.client) localStorage.setItem('auth_user', JSON.stringify(authStore.user))
  }
  profileSaved.value = true
  setTimeout(() => {
    profileSaved.value = false
  }, 3000)
}

// — Password form —
const pwd = reactive({ current: '', next: '', confirm: '' })
const pwdErrors = ref<Record<string, string>>({})
const pwdSaved = ref(false)
const showPwd = ref({ current: false, next: false, confirm: false })

function changePassword() {
  const result = passwordSchema.safeParse(pwd)
  if (!result.success) {
    pwdErrors.value = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']),
    )
    return
  }
  pwdErrors.value = {}
  // TODO: PATCH /api/users/me/password — endpoint not yet implemented
  pwdSaved.value = true
  pwd.current = ''
  pwd.next = ''
  pwd.confirm = ''
  setTimeout(() => {
    pwdSaved.value = false
  }, 3000)
}

// — Delete account —
const isDeleteOpen = ref(false)

async function confirmDelete() {
  try {
    await authStore.deleteAccount()
    navigateTo('/')
  } catch {}
}
</script>

<template>
  <div class="cab-profile">
    <!-- Profile -->
    <section class="cab-profile__section">
      <h2 class="cab-profile__title">Контактные данные</h2>

      <div class="cab-profile__grid">
        <div class="cab-profile__field">
          <label class="cab-profile__label">Имя</label>
          <input
            v-model="form.firstName"
            class="cab-profile__input"
            :class="{ 'cab-profile__input--error': profileErrors.firstName }"
          />
          <span v-if="profileErrors.firstName" class="cab-profile__error">{{
            profileErrors.firstName
          }}</span>
        </div>

        <div class="cab-profile__field">
          <label class="cab-profile__label">Фамилия</label>
          <input
            v-model="form.lastName"
            class="cab-profile__input"
            :class="{ 'cab-profile__input--error': profileErrors.lastName }"
          />
          <span v-if="profileErrors.lastName" class="cab-profile__error">{{
            profileErrors.lastName
          }}</span>
        </div>

        <div class="cab-profile__field">
          <label class="cab-profile__label">Email</label>
          <input
            v-model="form.email"
            class="cab-profile__input"
            :class="{ 'cab-profile__input--error': profileErrors.email }"
          />
          <span v-if="profileErrors.email" class="cab-profile__error">{{
            profileErrors.email
          }}</span>
        </div>

        <div class="cab-profile__field">
          <label class="cab-profile__label">Телефон</label>
          <input
            v-model="form.phone"
            v-maska="'+38 (0##) ###-##-##'"
            class="cab-profile__input"
            placeholder="+38 (0__) ___-__-__"
          />
        </div>
      </div>

      <div class="cab-profile__actions">
        <AppButton variant="primary" size="md" @click="saveProfile">Сохранить</AppButton>
        <Transition name="fade">
          <span v-if="profileSaved" class="cab-profile__saved">Сохранено</span>
        </Transition>
      </div>
    </section>

    <!-- Password -->
    <section class="cab-profile__section">
      <h2 class="cab-profile__title">Смена пароля</h2>

      <div class="cab-profile__grid">
        <div class="cab-profile__field">
          <label class="cab-profile__label">Текущий пароль</label>
          <div class="cab-profile__pwd-wrap">
            <input
              v-model="pwd.current"
              :type="showPwd.current ? 'text' : 'password'"
              class="cab-profile__input"
              :class="{ 'cab-profile__input--error': pwdErrors.current }"
            />
            <button
              type="button"
              class="cab-profile__eye"
              @click="showPwd.current = !showPwd.current"
            >
              <component :is="showPwd.current ? EyeOff : Eye" :size="16" />
            </button>
          </div>
          <span v-if="pwdErrors.current" class="cab-profile__error">{{ pwdErrors.current }}</span>
        </div>

        <div />

        <div class="cab-profile__field">
          <label class="cab-profile__label">Новый пароль</label>
          <div class="cab-profile__pwd-wrap">
            <input
              v-model="pwd.next"
              :type="showPwd.next ? 'text' : 'password'"
              class="cab-profile__input"
              :class="{ 'cab-profile__input--error': pwdErrors.next }"
            />
            <button type="button" class="cab-profile__eye" @click="showPwd.next = !showPwd.next">
              <component :is="showPwd.next ? EyeOff : Eye" :size="16" />
            </button>
          </div>
          <span v-if="pwdErrors.next" class="cab-profile__error">{{ pwdErrors.next }}</span>
        </div>

        <div class="cab-profile__field">
          <label class="cab-profile__label">Повторите пароль</label>
          <div class="cab-profile__pwd-wrap">
            <input
              v-model="pwd.confirm"
              :type="showPwd.confirm ? 'text' : 'password'"
              class="cab-profile__input"
              :class="{ 'cab-profile__input--error': pwdErrors.confirm }"
            />
            <button
              type="button"
              class="cab-profile__eye"
              @click="showPwd.confirm = !showPwd.confirm"
            >
              <component :is="showPwd.confirm ? EyeOff : Eye" :size="16" />
            </button>
          </div>
          <span v-if="pwdErrors.confirm" class="cab-profile__error">{{ pwdErrors.confirm }}</span>
        </div>
      </div>

      <div class="cab-profile__actions">
        <AppButton variant="outline" size="md" @click="changePassword">Изменить пароль</AppButton>
        <Transition name="fade">
          <span v-if="pwdSaved" class="cab-profile__saved">Пароль изменён</span>
        </Transition>
      </div>
    </section>

    <!-- Danger zone -->
    <section class="cab-profile__danger">
      <div>
        <p class="cab-profile__danger-title">Удаление аккаунта</p>
        <p class="cab-profile__danger-desc">
          После удаления все данные будут уничтожены и не подлежат восстановлению.
        </p>
      </div>
      <AppButton variant="danger" size="md" @click="isDeleteOpen = true">
        <Trash2 :size="16" /> Удалить аккаунт
      </AppButton>
    </section>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <div v-if="isDeleteOpen" class="cab-profile__overlay" @click.self="isDeleteOpen = false">
        <div class="cab-profile__modal">
          <h3>Удалить аккаунт?</h3>
          <p>Это действие необратимо. Все ваши данные, заказы и избранное будут удалены.</p>
          <p v-if="authStore.error" class="cab-profile__error">{{ authStore.error }}</p>
          <div class="cab-profile__modal-actions">
            <AppButton variant="outline" size="md" @click="isDeleteOpen = false">Отмена</AppButton>
            <AppButton
              variant="danger"
              size="md"
              :loading="authStore.loading"
              @click="confirmDelete"
            >
              Да, удалить
            </AppButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.cab-profile {
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    @include mixins.respond-to(sm) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
  }

  &__input {
    height: 40px;
    padding: 0 12px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-family: $font-family-base;
    color: $color-gray-900;
    transition: border-color $transition-fast;
    outline: none;
    width: 100%;

    &:focus {
      border-color: $color-primary;
    }
    &--error {
      border-color: $color-danger;
    }
  }

  &__pwd-wrap {
    position: relative;
  }
  &__pwd-wrap &__input {
    padding-right: 40px;
  }

  &__eye {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: $color-gray-400;
    cursor: pointer;
    display: flex;
    &:hover {
      color: $color-gray-700;
    }
  }

  &__error {
    font-size: $font-size-xs;
    color: $color-danger;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__saved {
    font-size: $font-size-sm;
    color: $color-success;
  }

  &__danger {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    border: 1px solid rgb(239 68 68 / 20%);
    border-radius: $radius-lg;
    background: rgb(239 68 68 / 3%);
    @include mixins.respond-to(sm) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__danger-title {
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
    color: $color-danger;
    margin-bottom: 4px;
  }
  &__danger-desc {
    font-size: $font-size-sm;
    color: $color-gray-500;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 50%);
    z-index: $z-modal-overlay;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  &__modal {
    background: $color-white;
    border-radius: $radius-xl;
    padding: 32px;
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
    }
    p {
      color: $color-gray-600;
      font-size: $font-size-sm;
    }
  }

  &__modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
