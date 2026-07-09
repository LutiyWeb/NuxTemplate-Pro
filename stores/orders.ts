import { defineStore } from 'pinia'
import type { Order, OrderStatus } from '~/types/order'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждён',
  processing: 'Обрабатывается',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
}

export const useOrdersStore = defineStore('orders', () => {
  const { authFetch } = useAuthFetch()

  const orders = ref<Order[]>([])
  const loading = ref(false)
  const meta = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })

  async function fetchOrders(page = 1) {
    loading.value = true
    try {
      const res = await authFetch<{ data: Order[]; meta: typeof meta.value }>('/api/orders', {
        params: { page, limit: 20 },
      })
      orders.value = res.data
      meta.value = res.meta
    } finally {
      loading.value = false
    }
  }

  function getStatusLabel(status: OrderStatus) {
    return STATUS_LABELS[status] ?? status
  }
  function getStatusColor(status: OrderStatus) {
    return STATUS_COLOR[status] ?? 'primary'
  }

  function formatMoney(value: string, currency = 'UAH') {
    const num = parseFloat(value)
    return isNaN(num)
      ? value
      : num.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
          ' ' +
          currency
  }

  return { orders, loading, meta, fetchOrders, getStatusLabel, getStatusColor, formatMoney }
})
