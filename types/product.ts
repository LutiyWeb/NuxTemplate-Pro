export interface Product {
  id: number
  title: string
  slug: string
  description: string
  sku: string | null
  category: string | null
  categoryId: number | null
  categorySlug: string | null
  brand: string | null
  brandId: number | null
  price: number | null
  compareAtPrice: number | null
  discountPercentage: number | null
  rating: number | null
  stock: number
  status: string
  thumbnail: string | null
  images: string[]
  labels?: string[]
  createdAt: string | null
  updatedAt: string | null
}

export interface ProductsResponse {
  data: Product[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export interface Category {
  id: number
  name: string
  slug: string
  subcategories?: { id: number; name: string; slug: string }[]
}
