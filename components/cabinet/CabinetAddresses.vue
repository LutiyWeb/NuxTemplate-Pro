<script setup lang="ts">
import { MapPin, Star, Trash2, Plus, X } from 'lucide-vue-next'
import { addressSchema } from '~/api/addresses'
import type { Address } from '~/api/addresses'

const { authFetch } = useAuthFetch()

const addresses = ref<Address[]>([])
const loading = ref(true)
const showForm = ref(false)
const submitting = ref(false)

const form = reactive({ city: '', street: '', house: '', apartment: '', isDefault: false })
const errors = ref<Record<string, string>>({})

async function load() {
  loading.value = true
  try {
    const res = await authFetch<{ data: Address[] }>('/api/addresses')
    addresses.value = res.data
  } finally {
    loading.value = false
  }
}

async function submit() {
  const result = addressSchema.safeParse(form)
  if (!result.success) {
    errors.value = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']),
    )
    return
  }
  errors.value = {}
  submitting.value = true
  try {
    await authFetch('/api/addresses', { method: 'POST', body: result.data })
    form.city = ''
    form.street = ''
    form.house = ''
    form.apartment = ''
    form.isDefault = false
    showForm.value = false
    await load()
  } finally {
    submitting.value = false
  }
}

async function setDefault(id: number) {
  await authFetch(`/api/addresses/${id}`, { method: 'PATCH', body: { isDefault: true } })
  await load()
}

async function deleteAddress(id: number) {
  await authFetch(`/api/addresses/${id}`, { method: 'DELETE' })
  addresses.value = addresses.value.filter((a) => a.id !== id)
}

onMounted(load)
</script>

<template>
  <div class="cab-addr">
    <div class="cab-addr__header">
      <h2 class="cab-addr__title">Адреса доставки</h2>
      <AppButton variant="outline" size="sm" @click="showForm = !showForm">
        <component :is="showForm ? X : Plus" :size="14" />
        {{ showForm ? 'Отмена' : 'Добавить адрес' }}
      </AppButton>
    </div>

    <!-- Add form -->
    <Transition name="slide-down">
      <div v-if="showForm" class="cab-addr__form">
        <div class="cab-addr__grid">
          <div class="cab-addr__field">
            <label class="cab-addr__label">Город *</label>
            <input
              v-model="form.city"
              class="cab-addr__input"
              :class="{ 'cab-addr__input--error': errors.city }"
              placeholder="Киев"
            />
            <span v-if="errors.city" class="cab-addr__error">{{ errors.city }}</span>
          </div>

          <div class="cab-addr__field">
            <label class="cab-addr__label">Улица *</label>
            <input
              v-model="form.street"
              class="cab-addr__input"
              :class="{ 'cab-addr__input--error': errors.street }"
              placeholder="ул. Крещатик"
            />
            <span v-if="errors.street" class="cab-addr__error">{{ errors.street }}</span>
          </div>

          <div class="cab-addr__field">
            <label class="cab-addr__label">Дом *</label>
            <input
              v-model="form.house"
              class="cab-addr__input"
              :class="{ 'cab-addr__input--error': errors.house }"
              placeholder="10"
            />
            <span v-if="errors.house" class="cab-addr__error">{{ errors.house }}</span>
          </div>

          <div class="cab-addr__field">
            <label class="cab-addr__label">Квартира</label>
            <input v-model="form.apartment" class="cab-addr__input" placeholder="42" />
          </div>
        </div>

        <label class="cab-addr__checkbox">
          <input v-model="form.isDefault" type="checkbox" />
          <span>Сделать основным</span>
        </label>

        <AppButton variant="primary" size="md" :loading="submitting" @click="submit">
          Сохранить адрес
        </AppButton>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="loading" class="cab-addr__list">
      <Skeleton v-for="n in 2" :key="n" width="100%" height="80px" border-radius="12px" />
    </div>

    <!-- Empty -->
    <div v-else-if="!addresses.length && !showForm" class="cab-addr__empty">
      <MapPin :size="40" class="cab-addr__empty-icon" />
      <p>Нет сохранённых адресов</p>
    </div>

    <!-- List -->
    <div v-else-if="addresses.length" class="cab-addr__list">
      <div v-for="addr in addresses" :key="addr.id" class="cab-addr__item">
        <MapPin :size="18" class="cab-addr__item-icon" />
        <div class="cab-addr__item-body">
          <span class="cab-addr__item-text">
            {{ addr.city }}, {{ addr.street }}, {{ addr.house }}
            <template v-if="addr.apartment">, кв. {{ addr.apartment }}</template>
          </span>
          <span v-if="addr.isDefault" class="cab-addr__badge">Основной</span>
        </div>
        <div class="cab-addr__item-actions">
          <button
            v-if="!addr.isDefault"
            class="cab-addr__action-btn"
            title="Сделать основным"
            @click="setDefault(addr.id)"
          >
            <Star :size="15" />
          </button>
          <button
            class="cab-addr__action-btn cab-addr__action-btn--danger"
            title="Удалить"
            @click="deleteAddress(addr.id)"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cab-addr {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__form {
    background: $color-gray-50;
    border: 1px solid $color-gray-100;
    border-radius: $radius-lg;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
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
    background: $color-white;
    color: $color-gray-900;
    outline: none;
    transition: border-color $transition-fast;
    &:focus {
      border-color: $color-primary;
    }
    &--error {
      border-color: $color-danger;
    }
  }

  &__error {
    font-size: $font-size-xs;
    color: $color-danger;
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: $color-gray-700;
    cursor: pointer;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid $color-gray-100;
    border-radius: $radius-lg;
    background: $color-white;
  }

  &__item-icon {
    color: $color-gray-400;
    flex-shrink: 0;
  }

  &__item-body {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  &__item-text {
    font-size: $font-size-sm;
    color: $color-gray-700;
  }

  &__badge {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: $color-primary;
    background: rgb(79 70 229 / 8%);
    padding: 2px 8px;
    border-radius: $radius-full;
  }

  &__item-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  &__action-btn {
    width: 30px;
    height: 30px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-gray-400;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;
    &:hover {
      background: $color-gray-100;
      color: $color-gray-700;
    }
    &--danger:hover {
      background: rgb(239 68 68 / 8%);
      color: $color-danger;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 0;
    color: $color-gray-400;
    font-size: $font-size-sm;
    text-align: center;
  }

  &__empty-icon {
    color: $color-gray-200;
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
