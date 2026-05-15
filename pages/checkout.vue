<script setup lang="ts">
import { z } from 'zod'

useSeoMeta({ title: 'Оформление заказа — Nexus Commerce' })

const cartStore = useCartStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { authFetch } = useAuthFetch()

interface Address {
  id: number
  city: string
  street: string
  house: string
  apartment: string | null
  recipientName: string | null
  phone: string | null
  isDefault: boolean
}

// If cart is empty redirect to cart page
if (process.client && !cartStore.items.length) navigateTo('/cart')

const savedAddresses = ref<Address[]>([])
const selectedAddressId = ref<number | null>(null)
const loading = ref(false)
const submitting = ref(false)

const form = reactive({
  recipientName: '',
  phone: '',
  city: '',
  street: '',
  house: '',
  apartment: '',
  notes: '',
})

const schema = z.object({
  recipientName: z.string().trim().min(2, 'Введите имя получателя'),
  phone: z.string().trim().min(10, 'Введите корректный номер телефона'),
  city: z.string().trim().min(1, 'Введите город'),
  street: z.string().trim().min(1, 'Введите улицу'),
  house: z.string().trim().min(1, 'Введите номер дома'),
  apartment: z.string().optional(),
  notes: z.string().optional(),
})

const errors = ref<Partial<Record<keyof typeof form, string>>>({})

function formatPrice(p: number) {
  return p.toLocaleString('uk-UA') + ' ₴'
}

// Prefill from user profile
onMounted(async () => {
  if (authStore.user) {
    form.recipientName = `${authStore.user.firstName ?? ''} ${authStore.user.lastName ?? ''}`.trim()
    if (authStore.user.phone) form.phone = authStore.user.phone
  }

  // Load saved addresses
  if (authStore.isLoggedIn) {
    loading.value = true
    try {
      const res = await authFetch<{ data: Address[] }>('/api/addresses')
      savedAddresses.value = res.data
      const def = res.data.find(a => a.isDefault)
      if (def) applyAddress(def)
    } catch {}
    finally { loading.value = false }
  }
})

function applyAddress(addr: Address) {
  selectedAddressId.value = addr.id
  form.city = addr.city
  form.street = addr.street
  form.house = addr.house
  form.apartment = addr.apartment ?? ''
  if (addr.recipientName) form.recipientName = addr.recipientName
  if (addr.phone) form.phone = addr.phone
}

function selectAddress(addr: Address) {
  applyAddress(addr)
}

const ERROR_MESSAGES: Record<string, string> = {
  ADDRESS_NOT_FOUND:      'Адрес не найден. Выберите другой.',
  CART_EMPTY:             'Корзина пуста.',
  CART_ITEM_UNAVAILABLE:  'Один из товаров больше недоступен.',
  NOT_ENOUGH_STOCK:       'Недостаточно товара на складе.',
}

async function submit() {
  errors.value = {}
  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(e => {
      const key = e.path[0] as keyof typeof form
      if (!errors.value[key]) errors.value[key] = e.message
    })
    return
  }

  submitting.value = true
  try {
    const body = selectedAddressId.value
      ? { addressId: selectedAddressId.value, notes: form.notes || undefined }
      : {
          deliveryAddress: {
            recipientName: form.recipientName,
            phone: form.phone,
            city: form.city,
            street: form.street,
            house: form.house,
            apartment: form.apartment || undefined,
          },
          notes: form.notes || undefined,
        }

    const res = await authFetch<{ data: { id: number } }>('/api/orders', { method: 'POST', body })
    await cartStore.clear()
    navigateTo(`/order/${res.data.id}`)
  } catch (err: unknown) {
    const msg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message
    toastStore.add(ERROR_MESSAGES[msg ?? ''] ?? 'Не удалось оформить заказ. Попробуйте снова.', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="checkout container">
    <AppBreadcrumbs
      :crumbs="[
        { label: 'Главная', to: '/' },
        { label: 'Корзина', to: '/cart' },
        { label: 'Оформление заказа' },
      ]"
      class="checkout__breadcrumbs"
    />

    <h1 class="checkout__heading">Оформление заказа</h1>

    <div class="checkout__layout">
      <!-- Left: form -->
      <div class="checkout__form-col">

        <!-- Saved addresses -->
        <div v-if="savedAddresses.length" class="checkout__section">
          <h2 class="checkout__section-title">Сохранённые адреса</h2>
          <div class="checkout__addresses">
            <button
              v-for="addr in savedAddresses"
              :key="addr.id"
              :class="['checkout__address-card', { 'checkout__address-card--active': selectedAddressId === addr.id }]"
              type="button"
              @click="selectAddress(addr)"
            >
              <span class="checkout__address-line">{{ addr.city }}, {{ addr.street }}, {{ addr.house }}<template v-if="addr.apartment">, кв. {{ addr.apartment }}</template></span>
              <span v-if="addr.isDefault" class="checkout__address-badge">По умолчанию</span>
            </button>
          </div>
        </div>

        <!-- Delivery form -->
        <div class="checkout__section">
          <h2 class="checkout__section-title">Данные доставки</h2>

          <div class="checkout__fields">
            <AppInputText
              v-model="form.recipientName"
              label="Имя получателя"
              placeholder="Иван Иванов"
              :error="errors.recipientName"
            />
            <AppInputText
              v-model="form.phone"
              label="Телефон"
              placeholder="+38 (0##) ###-##-##"
              :error="errors.phone"
            />
            <AppInputText
              v-model="form.city"
              label="Город"
              placeholder="Киев"
              :error="errors.city"
            />
            <div class="checkout__fields-row">
              <AppInputText
                v-model="form.street"
                label="Улица"
                placeholder="ул. Крещатик"
                :error="errors.street"
              />
              <AppInputText
                v-model="form.house"
                label="Дом"
                placeholder="1"
                :error="errors.house"
              />
              <AppInputText
                v-model="form.apartment"
                label="Квартира"
                placeholder="42"
              />
            </div>
          </div>
        </div>

        <!-- Comment -->
        <div class="checkout__section">
          <h2 class="checkout__section-title">Комментарий к заказу</h2>
          <textarea
            v-model="form.notes"
            class="checkout__textarea"
            placeholder="Дополнительная информация для курьера..."
            rows="3"
          />
        </div>
      </div>

      <!-- Right: summary -->
      <aside class="checkout__summary">
        <h2 class="checkout__summary-title">Ваш заказ</h2>

        <div class="checkout__summary-items">
          <div v-for="item in cartStore.items" :key="item.product.id" class="checkout__summary-item">
            <img v-if="item.product.thumbnail" :src="item.product.thumbnail" :alt="item.product.title" class="checkout__summary-img" />
            <div class="checkout__summary-info">
              <span class="checkout__summary-name">{{ item.product.title }}</span>
              <span class="checkout__summary-qty">{{ item.qty }} шт.</span>
            </div>
            <span class="checkout__summary-price">{{ formatPrice(item.product.price * item.qty) }}</span>
          </div>
        </div>

        <div class="checkout__summary-rows">
          <div class="checkout__summary-row">
            <span>Товары ({{ cartStore.count }})</span>
            <span>{{ formatPrice(cartStore.total) }}</span>
          </div>
          <div class="checkout__summary-row">
            <span>Доставка</span>
            <span class="checkout__summary-free">Бесплатно</span>
          </div>
        </div>

        <div class="checkout__summary-total">
          <span>К оплате</span>
          <span>{{ formatPrice(cartStore.total) }}</span>
        </div>

        <AppButton
          variant="primary"
          size="lg"
          :loading="submitting"
          style="width: 100%"
          @click="submit"
        >
          Подтвердить заказ
        </AppButton>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.checkout {
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__breadcrumbs { margin-bottom: 8px; }

  &__heading {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: flex-start;

    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }

  &__form-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__section {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__section-title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  // Saved addresses
  &__addresses {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__address-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-lg;
    text-align: left;
    cursor: pointer;
    transition: border-color $transition-fast, background $transition-fast;

    &:hover { border-color: $color-primary; background: rgb(79 70 229 / 3%); }

    &--active {
      border-color: $color-primary;
      background: rgb(79 70 229 / 6%);
    }
  }

  &__address-line { font-size: $font-size-sm; color: $color-gray-700; }

  &__address-badge {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-primary;
    background: rgb(79 70 229 / 10%);
    padding: 2px 8px;
    border-radius: $radius-full;
    flex-shrink: 0;
  }

  // Fields
  &__fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__fields-row {
    display: grid;
    grid-template-columns: 1fr 80px 80px;
    gap: 12px;

    @media (max-width: 480px) { grid-template-columns: 1fr; }
  }

  // Textarea
  &__textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-family: $font-family-base;
    font-size: $font-size-sm;
    color: $color-gray-900;
    resize: vertical;
    outline: none;
    transition: border-color $transition-fast;
    background: $color-white;

    &::placeholder { color: $color-gray-400; }
    &:focus { border-color: $color-primary; }
  }

  // Summary
  &__summary {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 80px;
  }

  &__summary-title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__summary-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__summary-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__summary-img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: $radius-md;
    flex-shrink: 0;
    background: $color-gray-100;
  }

  &__summary-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__summary-name {
    font-size: $font-size-sm;
    color: $color-gray-900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__summary-qty { font-size: $font-size-xs; color: $color-gray-400; }

  &__summary-price {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    flex-shrink: 0;
  }

  &__summary-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid $color-gray-100;
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: $color-gray-600;
  }

  &__summary-free { color: $color-success; font-weight: $font-weight-medium; }

  &__summary-total {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    padding-top: 16px;
    border-top: 1px solid $color-gray-100;
  }
}
</style>
