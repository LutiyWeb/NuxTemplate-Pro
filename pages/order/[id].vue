<script setup lang="ts">
import { CheckCircle2, Package, MapPin, User, Phone, FileText, ChevronRight } from 'lucide-vue-next'
import type { Order, OrderStatus } from '~/types/order'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { authFetch } = useAuthFetch()
const ordersStore = useOrdersStore()

const { data, pending, error } = useAsyncData(
  `order-${route.params.id}`,
  () => authFetch<{ data: Order }>(`/api/orders/${route.params.id}`),
)

const order = computed(() => data.value?.data ?? null)

useSeoMeta({
  title: () => order.value ? `Заказ ${order.value.orderNumber} — Nexus Commerce` : 'Заказ',
})

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:    'warning',
  confirmed:  'primary',
  processing: 'primary',
  shipped:    'info',
  delivered:  'success',
  cancelled:  'danger',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="order-page container">
    <AppBreadcrumbs
      :crumbs="[
        { label: 'Главная', to: '/' },
        { label: 'Мои заказы', to: '/cabinet?section=orders' },
        { label: order?.orderNumber ?? '...' },
      ]"
      class="order-page__breadcrumbs"
    />

    <!-- Loading -->
    <div v-if="pending" class="order-page__loading">
      <Skeleton width="100%" height="200px" border-radius="16px" />
    </div>

    <!-- Error -->
    <div v-else-if="error || !order" class="order-page__error">
      <p>Заказ не найден.</p>
      <NuxtLink to="/cabinet?section=orders" class="order-page__error-link">Мои заказы</NuxtLink>
    </div>

    <!-- Content -->
    <template v-else>

      <!-- Success banner -->
      <div class="order-page__banner">
        <div class="order-page__banner-icon">
          <CheckCircle2 :size="40" />
        </div>
        <div class="order-page__banner-body">
          <h1 class="order-page__banner-title">Заказ оформлен!</h1>
          <p class="order-page__banner-sub">
            Номер заказа: <strong>{{ order.orderNumber }}</strong> &nbsp;·&nbsp;
            {{ formatDate(order.createdAt) }}
          </p>
        </div>
        <span :class="['order-page__status', `order-page__status--${STATUS_COLOR[order.status as OrderStatus]}`]">
          {{ ordersStore.getStatusLabel(order.status as OrderStatus) }}
        </span>
      </div>

      <!-- Grid -->
      <div class="order-page__layout">

        <!-- Left: items + address -->
        <div class="order-page__main">

          <!-- Items -->
          <section class="order-page__card">
            <h2 class="order-page__card-title"><Package :size="16" />Состав заказа</h2>
            <div class="order-page__items">
              <div v-for="item in order.items" :key="item.id" class="order-page__item">
                <div class="order-page__item-info">
                  <p class="order-page__item-title">{{ item.productTitle }}</p>
                  <p v-if="item.sku" class="order-page__item-sku">SKU: {{ item.sku }}</p>
                  <p v-if="item.variant" class="order-page__item-variant">{{ (item.variant as any).title }}</p>
                </div>
                <div class="order-page__item-qty">× {{ item.quantity }}</div>
                <div class="order-page__item-price">
                  {{ ordersStore.formatMoney(item.totalPrice, order.currency) }}
                </div>
              </div>
            </div>
          </section>

          <!-- Delivery address -->
          <section v-if="order.deliveryAddressSnapshot" class="order-page__card">
            <h2 class="order-page__card-title"><MapPin :size="16" />Адрес доставки</h2>
            <div class="order-page__address">
              <p>
                <User :size="13" />
                {{ order.deliveryAddressSnapshot.recipientName }}
              </p>
              <p>
                <Phone :size="13" />
                {{ order.deliveryAddressSnapshot.phone }}
              </p>
              <p>
                <MapPin :size="13" />
                {{ order.deliveryAddressSnapshot.city }},
                {{ order.deliveryAddressSnapshot.street }},
                д. {{ order.deliveryAddressSnapshot.house }}
                <template v-if="order.deliveryAddressSnapshot.apartment">
                  , кв. {{ order.deliveryAddressSnapshot.apartment }}
                </template>
              </p>
            </div>
          </section>

          <!-- Notes -->
          <section v-if="order.notes" class="order-page__card">
            <h2 class="order-page__card-title"><FileText :size="16" />Комментарий</h2>
            <p class="order-page__notes">{{ order.notes }}</p>
          </section>
        </div>

        <!-- Right: summary + actions -->
        <aside class="order-page__aside">
          <div class="order-page__summary">
            <h2 class="order-page__summary-title">Итого</h2>

            <div class="order-page__summary-row">
              <span>Товары</span>
              <span>{{ ordersStore.formatMoney(order.subtotalPrice, order.currency) }}</span>
            </div>
            <div v-if="parseFloat(order.discountAmount) > 0" class="order-page__summary-row order-page__summary-row--discount">
              <span>Скидка</span>
              <span>− {{ ordersStore.formatMoney(order.discountAmount, order.currency) }}</span>
            </div>
            <div class="order-page__summary-row">
              <span>Доставка</span>
              <span>{{ parseFloat(order.deliveryPrice) === 0 ? 'Бесплатно' : ordersStore.formatMoney(order.deliveryPrice, order.currency) }}</span>
            </div>

            <div class="order-page__summary-total">
              <span>К оплате</span>
              <span>{{ ordersStore.formatMoney(order.totalPrice, order.currency) }}</span>
            </div>

            <div class="order-page__summary-actions">
              <NuxtLink to="/catalog" class="order-page__btn order-page__btn--primary">
                Продолжить покупки
              </NuxtLink>
              <NuxtLink to="/cabinet?section=orders" class="order-page__btn order-page__btn--outline">
                Мои заказы <ChevronRight :size="14" />
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.order-page {
  padding-block: 32px;

  &__breadcrumbs { margin-bottom: 24px; }

  &__loading, &__error {
    padding: 48px 0;
    text-align: center;
    color: $color-gray-500;
  }

  &__error-link {
    color: $color-primary;
    text-decoration: underline;
    margin-top: 8px;
    display: inline-block;
  }

  // ── Banner ───────────────────────────────────────────────────────────────
  &__banner {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px 28px;
    background: $color-white;
    border-radius: $radius-xl;
    box-shadow: $shadow-card;
    margin-bottom: 24px;

    @media (max-width: 640px) { flex-direction: column; align-items: flex-start; gap: 12px; }
  }

  &__banner-icon {
    width: 64px;
    height: 64px;
    border-radius: $radius-full;
    background: rgb(34 197 94 / 10%);
    color: $color-success;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__banner-body { flex: 1; }

  &__banner-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 4px;
  }

  &__banner-sub {
    font-size: $font-size-sm;
    color: $color-gray-500;
    margin: 0;
  }

  &__status {
    padding: 5px 14px;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    white-space: nowrap;
    flex-shrink: 0;

    &--primary { background: rgb(99 102 241 / 10%); color: $color-primary; }
    &--warning { background: rgb(234 179 8 / 12%); color: $color-warning; }
    &--success { background: rgb(34 197 94 / 10%); color: $color-success; }
    &--danger  { background: rgb(239 68 68 / 10%); color: $color-danger; }
    &--info    { background: rgb(6 182 212 / 10%); color: #0891b2; }
  }

  // ── Layout ───────────────────────────────────────────────────────────────
  &__layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: flex-start;

    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }

  &__main { display: flex; flex-direction: column; gap: 16px; }

  // ── Card ─────────────────────────────────────────────────────────────────
  &__card {
    background: $color-white;
    border-radius: $radius-xl;
    box-shadow: $shadow-card;
    padding: 20px 24px;
  }

  &__card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0 0 16px;

    svg { color: $color-primary; }
  }

  // ── Items ────────────────────────────────────────────────────────────────
  &__items { display: flex; flex-direction: column; }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid $color-gray-100;

    &:last-child { border-bottom: none; }
  }

  &__item-info { flex: 1; min-width: 0; }

  &__item-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-sku, &__item-variant {
    font-size: $font-size-xs;
    color: $color-gray-400;
    margin: 0;
  }

  &__item-qty {
    font-size: $font-size-sm;
    color: $color-gray-500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__item-price {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 100px;
    text-align: right;
  }

  // ── Address ──────────────────────────────────────────────────────────────
  &__address {
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: $font-size-sm;
      color: $color-gray-700;
      margin: 0;

      svg { color: $color-primary; flex-shrink: 0; margin-top: 2px; }
    }
  }

  &__notes { font-size: $font-size-sm; color: $color-gray-600; margin: 0; line-height: $line-height-relaxed; }

  // ── Summary ──────────────────────────────────────────────────────────────
  &__aside { position: sticky; top: 80px; }

  &__summary {
    background: $color-white;
    border-radius: $radius-xl;
    box-shadow: $shadow-card;
    padding: 20px 24px;
  }

  &__summary-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: $color-gray-600;
    margin-bottom: 10px;

    &--discount { color: $color-success; }
  }

  &__summary-total {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    padding-top: 12px;
    border-top: 1px solid $color-gray-100;
    margin-top: 4px;
    margin-bottom: 20px;
  }

  &__summary-actions { display: flex; flex-direction: column; gap: 10px; }

  // ── Buttons ───────────────────────────────────────────────────────────────
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 20px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    text-decoration: none;
    transition: background $transition-fast, color $transition-fast, border-color $transition-fast;

    &--primary {
      background: $color-primary;
      color: $color-white;
      &:hover { background: $color-primary-dark; }
    }

    &--outline {
      border: 1px solid $color-gray-200;
      color: $color-gray-700;
      &:hover { border-color: $color-primary; color: $color-primary; }
    }
  }
}
</style>
