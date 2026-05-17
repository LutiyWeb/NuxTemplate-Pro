<script setup lang="ts">
import { ShoppingCart, Heart, Trash2 } from 'lucide-vue-next'

useSeoMeta({ title: 'Корзина — Nexus Commerce' })

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const productsStore = useProductsStore()

const selectedIds = ref<number[]>([])
const pendingDelete = ref(false)

const allSelected = computed(
  () => cartStore.items.length > 0 && selectedIds.value.length === cartStore.items.length,
)

function toggleAll() {
  if (allSelected.value) selectedIds.value = []
  else selectedIds.value = cartStore.items.map((e) => e.product.id)
}

function toggleItem(id: number, val: boolean) {
  if (val) selectedIds.value.push(id)
  else selectedIds.value = selectedIds.value.filter((i) => i !== id)
}

function removeSelected() {
  selectedIds.value.forEach((id) => cartStore.remove(id))
  selectedIds.value = []
  pendingDelete.value = false
}

function addSelectedToFavorites() {
  selectedIds.value.forEach((id) => {
    if (!favoritesStore.has(id)) favoritesStore.toggle(id)
  })
  selectedIds.value = []
}

function formatPrice(p: number) {
  return p.toLocaleString('uk-UA') + ' ₴'
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts({ limit: 8 })
  }
})

const recommendations = computed(() => productsStore.products.slice(0, 8))
</script>

<template>
  <div class="cart-page container">
    <AppBreadcrumbs
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'Корзина' }]"
      class="cart-page__breadcrumbs"
    />
    <h1 class="cart-page__heading">Корзина <span class="cart-page__count">{{ cartStore.count }}</span></h1>

    <!-- Empty -->
    <div v-if="!cartStore.items.length" class="cart-page__empty">
      <ShoppingCart :size="56" :stroke-width="1.5" class="cart-page__empty-icon" />
      <p class="cart-page__empty-title">Корзина пуста</p>
      <p class="cart-page__empty-desc">Добавьте товары, чтобы оформить заказ</p>
      <AppButton variant="primary" size="md" @click="navigateTo('/catalog')">Перейти в каталог</AppButton>
    </div>

    <!-- Layout with items -->
    <div v-else class="cart-page__layout">
      <!-- Items column -->
      <div class="cart-page__items">
        <!-- Bulk bar -->
        <div class="cart-page__bulk">
          <label class="cart-page__select-all">
            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
            Выбрано {{ selectedIds.length }} из {{ cartStore.items.length }}
          </label>
          <div v-if="selectedIds.length" class="cart-page__bulk-actions">
            <button type="button" @click="addSelectedToFavorites">
              <Heart :size="14" /> В избранное
            </button>
            <button type="button" class="cart-page__bulk-delete" @click="pendingDelete = true">
              <Trash2 :size="14" /> Удалить
            </button>
          </div>
        </div>

        <!-- Delete confirm -->
        <div v-if="pendingDelete" class="cart-page__confirm">
          <span>Удалить {{ selectedIds.length }} товар(ов)?</span>
          <button type="button" class="cart-page__confirm-ok" @click="removeSelected">Удалить</button>
          <button type="button" @click="pendingDelete = false">Отмена</button>
        </div>

        <CartItem
          v-for="item in cartStore.items"
          :key="item.product.id"
          :item="item"
          :selected="selectedIds.includes(item.product.id)"
          @update:selected="toggleItem(item.product.id, $event)"
          @remove="cartStore.remove($event)"
          @update-qty="(id, delta) => cartStore.updateQty(id, delta)"
        />
      </div>

      <!-- Summary column -->
      <aside class="cart-page__summary">
        <h2 class="cart-page__summary-title">Итого</h2>

        <div class="cart-page__summary-rows">
          <div class="cart-page__summary-row">
            <span>Товары ({{ cartStore.count }})</span>
            <span>{{ formatPrice(cartStore.total) }}</span>
          </div>
          <div class="cart-page__summary-row">
            <span>Доставка</span>
            <span class="cart-page__summary-free">Бесплатно</span>
          </div>
        </div>

        <div class="cart-page__summary-total">
          <span>К оплате</span>
          <span>{{ formatPrice(cartStore.total) }}</span>
        </div>

        <NuxtLink to="/checkout" class="cart-page__checkout">Оформить заказ</NuxtLink>
        <button type="button" class="cart-page__continue" @click="navigateTo('/catalog')">
          Продолжить покупки
        </button>
      </aside>
    </div>

    <!-- Recommendations -->
    <div v-if="recommendations.length" class="cart-page__recs">
      <AppSlider
        title="Рекомендуем"
        :slides="recommendations"
        :space-between="16"
        :breakpoints="{ 0: { slidesPerView: 2 }, 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }"
      >
        <template #default="slotProps">
          <TheProductCard v-if="slotProps?.slide" :product="(slotProps.slide as any)" />
        </template>
      </AppSlider>
    </div>
  </div>
</template>

<style lang="scss">
.cart-page {
  padding-block: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__breadcrumbs { margin-bottom: -24px; }

  &__heading {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__count {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-gray-400;
  }

  // Empty state
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 80px 0;
    text-align: center;
  }

  &__empty-icon { color: $color-gray-200; }
  &__empty-title { font-size: $font-size-xl; font-weight: $font-weight-semibold; color: $color-gray-700; }
  &__empty-desc { font-size: $font-size-sm; color: $color-gray-400; }

  // Two-column layout
  &__layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    align-items: flex-start;

    @media (max-width: 900px) { grid-template-columns: 1fr; }
  }

  // Items column
  &__items {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  // Bulk actions bar
  &__bulk {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid $color-gray-100;
    margin-bottom: 4px;
  }

  &__select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
  }

  &__bulk-actions {
    display: flex;
    gap: 8px;

    button {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: $font-size-xs;
      padding: 5px 10px;
      border-radius: $radius-md;
      background: $color-gray-100;
      color: $color-gray-700;
      cursor: pointer;
      transition: background $transition-fast;

      &:hover { background: $color-gray-200; }
    }
  }

  &__bulk-delete { color: $color-danger; }

  // Confirm bar
  &__confirm {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: rgb(239 68 68 / 8%);
    border-radius: $radius-md;
    font-size: $font-size-sm;
    margin-bottom: 4px;

    span { flex: 1; color: $color-gray-700; }

    button { cursor: pointer; font-size: $font-size-sm; }

    &-ok { color: $color-danger; font-weight: $font-weight-semibold; }
  }

  // Summary card
  &__summary {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 80px;
  }

  &__summary-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__summary-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-sm;
    color: $color-gray-600;
  }

  &__summary-free { color: $color-success; font-weight: $font-weight-medium; }

  &__summary-total {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid $color-gray-100;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__checkout {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px 24px;
    background: $color-primary;
    color: $color-white;
    border-radius: $radius-md;
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
    transition: background $transition-fast;
    text-align: center;

    &:hover { background: $color-primary-dark; }
  }

  &__continue {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 11px 24px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
    transition: background $transition-fast, border-color $transition-fast;

    &:hover { background: $color-gray-50; border-color: $color-gray-300; }
  }

  // Recommendations
  &__recs { padding-top: 8px; }
}
</style>
