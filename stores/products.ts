import { defineStore } from 'pinia'
import type { Product, ProductsResponse } from '~/types/product'

export const useProductsStore = defineStore('products', () => {
  const config = useRuntimeConfig()
  const BASE = config.public.apiBase

  const products = ref<Product[]>([])
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const loadingOne = ref(false)
  const meta = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })

  async function fetchProducts(params: { page?: number; limit?: number; categorySlug?: string } = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams()
      query.set('page', String(params.page ?? 1))
      query.set('limit', String(params.limit ?? 20))
      if (params.categorySlug) query.set('categorySlug', params.categorySlug)
      const res = await $fetch<ProductsResponse>(`${BASE}/api/products/?${query}`)
      products.value = res.data
      meta.value = res.meta
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: number) {
    loadingOne.value = true
    try {
      const res = await $fetch<{ data: Product }>(`${BASE}/api/products/${id}`)
      product.value = res.data
    } finally {
      loadingOne.value = false
    }
  }

  return { products, product, loading, loadingOne, meta, fetchProducts, fetchProduct }
})
