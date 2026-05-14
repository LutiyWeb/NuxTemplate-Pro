import { defineStore } from 'pinia'
import type { Category } from '~/types/product'

export const useCategoriesStore = defineStore('categories', () => {
  const config = useRuntimeConfig()
  const categories = ref<Category[]>([])
  const loading = ref(false)
  let fetched = false

  async function fetchCategories() {
    if (fetched) return
    loading.value = true
    try {
      const res = await $fetch<{ data: Category[] }>(`${config.public.apiBase}/api/categories/`)
      categories.value = res.data.map((cat) => ({
        ...cat,
        subcategories: [1, 2, 3].map((n) => ({
          id: cat.id * 100 + n,
          name: `${cat.name} — раздел ${n}`,
          slug: `${cat.slug}-${n}`,
        })),
      }))
      fetched = true
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories }
})
