import type { Product } from '~/types/product'

export interface SearchResponse {
  data: Product[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}
