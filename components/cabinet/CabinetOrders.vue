<script setup lang="ts">
import { Package } from 'lucide-vue-next'
import type { Order } from '~/stores/orders'

const ordersStore = useOrdersStore()
const expandedId = ref<number | null>(null)

onMounted(() => ordersStore.fetchOrders())

const STATUS_COLOR: Record<Order['status'], string> = {
  pending:   'var(--color-warning)',
  confirmed: 'var(--color-primary)',
  shipped:   'var(--color-primary)',
  delivered: 'var(--color-success)',
  cancelled: 'var(--color-danger)',
}
</script>

<template>
  <div class="cab-orders">
    <h2 class="cab-orders__title">История заказов</h2>

    <!-- Loading -->
    <div v-if="ordersStore.loading" class="cab-orders__list">
      <div v-for="n in 3" :key="n" class="cab-orders__skeleton">
        <Skeleton width="120px" height="14px" />
        <Skeleton width="80px" height="14px" />
        <Skeleton width="90px" height="14px" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!ordersStore.orders.length" class="cab-orders__empty">
      <Package :size="48" class="cab-orders__empty-icon" />
      <p class="cab-orders__empty-title">Заказов пока нет</p>
      <p class="cab-orders__empty-desc">Ваши заказы появятся здесь после первой покупки</p>
      <AppButton variant="primary" size="md" @click="navigateTo('/catalog')">Перейти в каталог</AppButton>
    </div>

    <!-- List -->
    <div v-else class="cab-orders__list">
      <div v-for="order in ordersStore.orders" :key="order.id" class="cab-orders__item">
        <div class="cab-orders__row" @click="expandedId = expandedId === order.id ? null : order.id">
          <div class="cab-orders__meta">
            <span class="cab-orders__number">№{{ order.number }}</span>
            <span class="cab-orders__date">{{ new Date(order.createdAt).toLocaleDateString('ru-RU') }}</span>
          </div>
          <span class="cab-orders__status" :style="{ color: STATUS_COLOR[order.status] }">
            {{ ordersStore.getStatusLabel(order.status) }}
          </span>
          <span class="cab-orders__total">${{ order.total.toFixed(2) }}</span>
        </div>

        <div v-if="expandedId === order.id" class="cab-orders__details">
          <div v-for="item in order.items" :key="item.id" class="cab-orders__product">
            <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="cab-orders__product-img" />
            <div class="cab-orders__product-info">
              <span>{{ item.title }}</span>
              <span class="cab-orders__product-qty">{{ item.qty }} × ${{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.cab-orders {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 0;
    text-align: center;
  }

  &__empty-icon { color: $color-gray-200; }
  &__empty-title { font-size: $font-size-lg; font-weight: $font-weight-semibold; color: $color-gray-700; }
  &__empty-desc { font-size: $font-size-sm; color: $color-gray-400; }

  &__skeleton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid $color-gray-100;
    border-radius: $radius-lg;
  }

  &__list { display: flex; flex-direction: column; gap: 8px; }

  &__item {
    border: 1px solid $color-gray-100;
    border-radius: $radius-lg;
    overflow: hidden;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    cursor: pointer;
    transition: background $transition-fast;
    &:hover { background: $color-gray-50; }
  }

  &__meta { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  &__number { font-size: $font-size-sm; font-weight: $font-weight-semibold; }
  &__date { font-size: $font-size-xs; color: $color-gray-400; }
  &__status { font-size: $font-size-sm; font-weight: $font-weight-medium; }
  &__total { font-size: $font-size-sm; font-weight: $font-weight-bold; color: $color-gray-900; }

  &__details {
    border-top: 1px solid $color-gray-100;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: $color-gray-50;
  }

  &__product {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__product-img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: $radius-md;
    flex-shrink: 0;
  }

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: $font-size-sm;
    color: $color-gray-700;
  }

  &__product-qty { font-size: $font-size-xs; color: $color-gray-400; }
}
</style>
