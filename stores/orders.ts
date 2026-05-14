import { defineStore } from 'pinia'

export interface OrderItem {
  id: number
  productId: number
  title: string
  thumbnail: string | null
  price: number
  qty: number
}

export interface Order {
  id: number
  number: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
  items: OrderItem[]
}

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждён',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)

  // TODO: replace with real API call when /api/orders is ready
  async function fetchOrders() {
    loading.value = true
    await new Promise(r => setTimeout(r, 600))
    orders.value = []
    loading.value = false
  }

  function getStatusLabel(status: Order['status']) {
    return STATUS_LABELS[status]
  }

  return { orders, loading, fetchOrders, getStatusLabel }
})
