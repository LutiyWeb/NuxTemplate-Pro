import type { Product } from '~/types/product'

export interface CartEntry {
  id: number | null
  product: Product
  qty: number
}
