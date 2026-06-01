export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: number
  productId: number
  selectedVariantId: number | null
  productTitle: string
  sku: string
  variant: { id: number; title: string; sku: string; attributes: unknown } | null
  quantity: number
  unitPrice: string
  totalPrice: string
  createdAt: string
}

export interface OrderCustomerSnapshot {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

export interface OrderAddressSnapshot {
  addressId?: number
  recipientName: string
  phone: string
  city: string
  street: string
  house: string
  apartment?: string
}

export interface Order {
  id: number
  userId: number
  orderNumber: string
  status: OrderStatus
  subtotalPrice: string
  discountAmount: string
  deliveryPrice: string
  totalPrice: string
  currency: string
  customerSnapshot: OrderCustomerSnapshot | null
  deliveryAddressSnapshot: OrderAddressSnapshot | null
  notes: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}
