<script setup lang="ts">
import type { Product } from '~/types/product'

const MOCK_PRODUCTS: Product[] = Array.from({ length: 6 }, (_, i) => ({
  id: 8000 + i,
  title: `Товар для слайдера ${i + 1}`,
  slug: `slider-product-${i + 1}`,
  description: 'Описание товара в слайдере',
  sku: `SKU-${i + 1}`,
  category: 'Электроника',
  categoryId: 1,
  categorySlug: 'electronics',
  brand: 'Brand',
  brandId: 1,
  price: 1000 + i * 500,
  compareAtPrice: i % 2 === 0 ? 1500 + i * 500 : null,
  discountPercentage: i % 2 === 0 ? 20 : null,
  rating: 4 + (i % 2) * 0.5,
  stock: 5,
  status: 'active',
  thumbnail: `https://picsum.photos/seed/nav${i}/400/400`,
  images: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const RIBBON_CODE = `<!-- CategoryRibbon читает данные из categoriesStore автоматически -->
<CategoryRibbon />`

const SLIDER_CODE = `<AppSlider
  title="Рекомендуем"
  :slides="products"
  :space-between="16"
  :breakpoints="{
    0:    { slidesPerView: 2 },
    640:  { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    1280: { slidesPerView: 5 },
  }"
>
  <template #default="{ slide }">
    <TheProductCard :product="slide" />
  </template>
</AppSlider>`

const ARROW_CODE = `<!-- AppArrow — универсальная стрелка для всех слайдеров -->
<AppArrow direction="prev" @click="swiper.slidePrev()" />
<AppArrow direction="next" @click="swiper.slideNext()" />

<!-- Состояния -->
<AppArrow direction="prev" :disabled="isBeginning" />
<AppArrow direction="next" :disabled="isEnd" />`
</script>

<template>
  <div class="uikit-nav">
    <UiKitSection
      title="CategoryRibbon"
      description="Горизонтальная лента категорий с иконками и стрелками прокрутки"
    >
      <template #preview>
        <div style="width: 100%; overflow: hidden">
          <CategoryRibbon />
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="RIBBON_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection
      title="AppSlider"
      description="Swiper.js слайдер с товарами, адаптивными брейкпоинтами и стрелками"
    >
      <template #preview>
        <div style="width: 100%; overflow: hidden">
          <AppSlider
            title="Пример слайдера"
            :slides="MOCK_PRODUCTS"
            :space-between="16"
            :breakpoints="{
              0: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }"
          >
            <template #default="slotProps">
              <TheProductCard v-if="slotProps?.slide" :product="slotProps.slide as any" />
            </template>
          </AppSlider>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="SLIDER_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection
      title="AppArrow"
      description="Универсальный компонент стрелок — используется во всех слайдерах"
    >
      <template #preview>
        <div style="display: flex; gap: 12px; align-items: center">
          <AppArrow direction="prev" />
          <AppArrow direction="next" />
          <span style="color: #9ca3af; font-size: 13px; margin-left: 8px">активные</span>
        </div>
        <div style="display: flex; gap: 12px; align-items: center">
          <AppArrow direction="prev" :disabled="true" />
          <AppArrow direction="next" :disabled="true" />
          <span style="color: #9ca3af; font-size: 13px; margin-left: 8px">disabled</span>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="ARROW_CODE" />
      </template>
      <template #props>
        <UiKitPropsTable
          :rows="[
            {
              name: 'direction',
              type: `'prev' | 'next'`,
              required: true,
              description: 'Направление стрелки',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Заблокировать стрелку',
            },
          ]"
        />
      </template>
    </UiKitSection>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.uikit-nav {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
