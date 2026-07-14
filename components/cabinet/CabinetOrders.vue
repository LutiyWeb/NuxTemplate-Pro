<script setup lang="ts">
import { Package, ChevronDown, ExternalLink } from 'lucide-vue-next'
import type { OrderStatus } from '~/types/order'

const ordersStore = useOrdersStore()
const expandedId = ref<number | null>(null)

onMounted(() => ordersStore.fetchOrders())

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

async function loadPage(page: number) {
  await ordersStore.fetchOrders(page)
  expandedId.value = null
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
}
</script>

<template>
  <div class="cab-orders">
    <h2 class="cab-orders__title">История заказов</h2>

    <!-- Loading -->
    <div v-if="ordersStore.loading" class="cab-orders__list">
      <div v-for="n in 3" :key="n" class="cab-orders__skeleton">
        <AppSkeleton width="120px" height="14px" />
        <AppSkeleton width="80px" height="14px" />
        <AppSkeleton width="90px" height="14px" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!ordersStore.orders.length" class="cab-orders__empty">
      <Package :size="48" class="cab-orders__empty-icon" />
      <p class="cab-orders__empty-title">Заказов пока нет</p>
      <p class="cab-orders__empty-desc">Ваши заказы появятся здесь после первой покупки</p>
      <AppButton variant="primary" size="md" @click="navigateTo('/catalog')"
        >Перейти в каталог</AppButton
      >
    </div>

    <!-- List -->
    <div v-else class="cab-orders__list">
      <div v-for="order in ordersStore.orders" :key="order.id" class="cab-orders__item">
        <!-- Row header -->
        <div class="cab-orders__row" @click="toggleExpand(order.id)">
          <div class="cab-orders__meta">
            <span class="cab-orders__number">{{ order.orderNumber }}</span>
            <span class="cab-orders__date">{{
              new Date(order.createdAt).toLocaleDateString('ru-RU')
            }}</span>
          </div>

          <span
            :class="[
              'cab-orders__status',
              `cab-orders__status--${STATUS_CLASS[order.status as OrderStatus]}`,
            ]"
          >
            {{ ordersStore.getStatusLabel(order.status as OrderStatus) }}
          </span>

          <span class="cab-orders__total">{{
            ordersStore.formatMoney(order.totalPrice, order.currency)
          }}</span>

          <ChevronDown
            :size="16"
            :class="[
              'cab-orders__chevron',
              { 'cab-orders__chevron--open': expandedId === order.id },
            ]"
          />
        </div>

        <!-- Expanded details -->
        <Transition name="cab-orders-expand">
          <div v-if="expandedId === order.id" class="cab-orders__details">
            <div v-for="item in order.items" :key="item.id" class="cab-orders__product">
              <div class="cab-orders__product-info">
                <span class="cab-orders__product-title">{{ item.productTitle }}</span>
                <span v-if="item.variant" class="cab-orders__product-variant">{{
                  (item.variant as any).title
                }}</span>
                <span class="cab-orders__product-qty">
                  {{ item.quantity }} шт. ×
                  {{ ordersStore.formatMoney(item.unitPrice, order.currency) }}
                </span>
              </div>
              <span class="cab-orders__product-price">{{
                ordersStore.formatMoney(item.totalPrice, order.currency)
              }}</span>
            </div>

            <div class="cab-orders__details-footer">
              <NuxtLink :to="`/order/${order.id}`" class="cab-orders__link">
                Подробнее о заказе <ExternalLink :size="13" />
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="ordersStore.meta.totalPages > 1" class="cab-orders__pagination">
      <button
        v-for="page in ordersStore.meta.totalPages"
        :key="page"
        :class="[
          'cab-orders__page-btn',
          { 'cab-orders__page-btn--active': page === ordersStore.meta.page },
        ]"
        @click="loadPage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
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

  &__empty-icon {
    color: $color-gray-200;
  }
  &__empty-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-700;
  }
  &__empty-desc {
    font-size: $font-size-sm;
    color: $color-gray-400;
  }

  &__skeleton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid $color-gray-100;
    border-radius: $radius-lg;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

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
    &:hover {
      background: $color-gray-50;
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  &__number {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }
  &__date {
    font-size: $font-size-xs;
    color: $color-gray-400;
  }

  &__status {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    padding: 3px 10px;
    border-radius: $radius-full;
    white-space: nowrap;
    flex-shrink: 0;

    &--primary {
      background: rgb(99 102 241 / 10%);
      color: $color-primary;
    }
    &--warning {
      background: rgb(234 179 8 / 12%);
      color: $color-warning;
    }
    &--success {
      background: rgb(34 197 94 / 10%);
      color: $color-success;
    }
    &--danger {
      background: rgb(239 68 68 / 10%);
      color: $color-danger;
    }
    &--info {
      background: rgb(6 182 212 / 10%);
      color: #0891b2;
    }
  }

  &__total {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__chevron {
    color: $color-gray-400;
    flex-shrink: 0;
    transition: transform $transition-fast;

    &--open {
      transform: rotate(180deg);
    }
  }

  // Expand transition
  .cab-orders-expand-enter-active,
  .cab-orders-expand-leave-active {
    transition: opacity $transition-fast;
  }
  .cab-orders-expand-enter-from,
  .cab-orders-expand-leave-to {
    opacity: 0;
  }

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
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;

    &:not(:last-child) {
      border-bottom: 1px solid $color-gray-100;
    }
  }

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  &__product-title {
    font-size: $font-size-sm;
    color: $color-gray-800;
    font-weight: $font-weight-medium;
  }

  &__product-variant {
    font-size: $font-size-xs;
    color: $color-gray-500;
  }
  &__product-qty {
    font-size: $font-size-xs;
    color: $color-gray-400;
  }

  &__product-price {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__details-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid $color-gray-100;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-primary;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  // Pagination
  &__pagination {
    display: flex;
    gap: 6px;
    justify-content: center;
  }

  &__page-btn {
    width: 32px;
    height: 32px;
    border-radius: $radius-md;
    border: 1px solid $color-gray-200;
    font-size: $font-size-sm;
    color: $color-gray-700;
    cursor: pointer;
    transition:
      background $transition-fast,
      border-color $transition-fast,
      color $transition-fast;
    background: $color-white;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: $color-white;
    }
  }
}
</style>
