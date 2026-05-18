import { defineStore } from 'pinia'

export interface Brand {
  id: number
  name: string
  slug: string
  count: number
}

export const useBrandsStore = defineStore('brands', () => {
  const config = useRuntimeConfig()
  const BASE = config.public.apiBase

  const brands = ref<Brand[]>([])
  const loading = ref(false)

  async function fetchBrands(search?: string) {
    loading.value = true
    try {
      const query = new URLSearchParams()
      if (search) query.set('search', search)
      const res = await $fetch<{ data: Brand[] }>(`${BASE}/api/brands${search ? `?${query}` : ''}`)
      brands.value = res.data
    } finally {
      loading.value = false
    }
  }

  return { brands, loading, fetchBrands }
})
