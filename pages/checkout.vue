<script setup lang="ts">
useHead({ title: 'Оформление заказа — Nexus Commerce' })

const cartStore = useCartStore()
const authStore = useAuthStore()

const form = reactive({ name: '', phone: '', address: '', comment: '' })

const total = computed(() =>
  cartStore.items.reduce((sum, e) => sum + (e.product.price ?? 0) * e.qty, 0),
)

function submit() {
  // TODO: integrate with API
}
</script>

<template>
  <div class="checkout-page container">
    <TheTitle tag="h1" size="m">Оформление заказа</TheTitle>

    <div class="checkout-page__layout">
      <form class="checkout-page__form" @submit.prevent="submit">
        <AppInputText v-model="form.name" label="Имя и фамилия" placeholder="Иван Иванов" />
        <AppInputText v-model="form.phone" label="Телефон" placeholder="+38 (0##) ###-##-##" />
        <AppInputText v-model="form.address" label="Адрес доставки" placeholder="г. Киев, ул. Примерная, 1" />
        <div class="checkout-page__field">
          <label class="checkout-page__label">Комментарий</label>
          <textarea v-model="form.comment" class="checkout-page__textarea" placeholder="Дополнительная информация..." />
        </div>
        <AppButton type="submit" variant="primary" size="lg" style="width: 100%">
          Оформить заказ
        </AppButton>
      </form>

      <div class="checkout-page__summary">
        <TheTitle tag="h2" size="s">Ваш заказ</TheTitle>
        <div v-for="item in cartStore.items" :key="item.product.id" class="checkout-page__item">
          <span>{{ item.product.title }} × {{ item.qty }}</span>
          <span>${{ (item.product.price ?? 0) * item.qty }}</span>
        </div>
        <div class="checkout-page__total">
          <span>Итого:</span>
          <span>${{ total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.checkout-page {
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: flex-start;

    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  &__form { display: flex; flex-direction: column; gap: 16px; }

  &__field { display: flex; flex-direction: column; gap: 6px; }

  &__label { font-size: $font-size-sm; font-weight: $font-weight-medium; color: $color-gray-700; }

  &__textarea {
    padding: 10px 12px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-family: $font-family-base;
    font-size: $font-size-base;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: border-color $transition-fast;

    &:focus { border-color: $color-primary; }
  }

  &__summary {
    background: $color-gray-50;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: $color-gray-700;
    padding-bottom: 8px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__total {
    display: flex;
    justify-content: space-between;
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
    margin-top: 4px;
  }
}
</style>
