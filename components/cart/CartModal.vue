<script setup lang="ts">
import { X, Heart, Trash2, ShoppingCart } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const productsStore = useProductsStore()

const stopNavWatch = router.afterEach(() => {
  if (props.open) emit('update:open', false)
})
onUnmounted(stopNavWatch)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && productsStore.products.length === 0) {
      await productsStore.fetchProducts({ limit: 8 })
    }
  },
)

const recommendations = computed(() => productsStore.products.slice(0, 8))
const selectedIds = ref<number[]>([])
const pendingDelete = ref(false)

const totalPrice = computed(() =>
  cartStore.items.reduce((sum, e) => sum + (e.product.price ?? 0) * e.qty, 0),
)

function formatPrice(p: number) {
  return p.toLocaleString('uk-UA') + ' ₴'
}

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
</script>

<template>
  <Teleport to="body">
    <Transition name="cart-modal">
      <div v-if="open" class="cart-modal">
        <div class="cart-modal__backdrop" @click="emit('update:open', false)" />

        <div class="cart-modal__panel">
          <div class="cart-modal__head">
            <h2 class="cart-modal__title">Корзина ({{ cartStore.count }})</h2>
            <button class="cart-modal__close" type="button" @click="emit('update:open', false)">
              <X :size="14" />
            </button>
          </div>

          <div class="cart-modal__body">
            <template v-if="cartStore.items.length">
              <div class="cart-modal__bulk">
                <label class="cart-modal__select-all">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                  Выбрано {{ selectedIds.length }} из {{ cartStore.items.length }}
                </label>
                <div v-if="selectedIds.length" class="cart-modal__bulk-actions">
                  <button type="button" @click="addSelectedToFavorites">
                    <Heart :size="14" /> В избранное
                  </button>
                  <button type="button" @click="pendingDelete = true">
                    <Trash2 :size="14" /> Удалить
                  </button>
                </div>
              </div>

              <div v-if="pendingDelete" class="cart-modal__confirm">
                <span>Удалить {{ selectedIds.length }} товар(ов)?</span>
                <button type="button" class="cart-modal__confirm-ok" @click="removeSelected">
                  Удалить
                </button>
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
            </template>
            <div v-else class="cart-modal__empty">
              <ShoppingCart :size="48" :stroke-width="1.5" />
              <p>Корзина пуста</p>
            </div>

            <div v-if="recommendations.length" class="cart-modal__recs">
              <AppSlider
                title="Рекомендуем"
                :slides="recommendations"
                :space-between="12"
                :peek="true"
                :breakpoints="{
                  0: { slidesPerView: 1.5 },
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }"
              >
                <template #default="slotProps">
                  <TheProductCard v-if="slotProps?.slide" :product="slotProps.slide as any" />
                </template>
              </AppSlider>
            </div>
          </div>

          <div class="cart-modal__footer">
            <span class="cart-modal__total">Итого: {{ formatPrice(totalPrice) }}</span>
            <NuxtLink to="/checkout" class="cart-modal__checkout">Оформить заказ</NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.cart-modal {
  position: fixed;
  inset: 0;
  z-index: $z-modal;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 50%);
  }

  &__panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 560px;
    background: $color-white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid $color-gray-100;
    flex-shrink: 0;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    margin: 0;
  }

  &__close {
    width: 32px;
    height: 32px;
    background: $color-gray-100;
    border-radius: $radius-full;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-200;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__bulk {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid $color-gray-100;
  }

  &__select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    cursor: pointer;
  }

  &__bulk-actions {
    display: flex;
    gap: 8px;

    button {
      font-size: $font-size-xs;
      padding: 4px 8px;
      border-radius: $radius-md;
      background: $color-gray-100;
      cursor: pointer;
      transition: background $transition-fast;

      &:hover {
        background: $color-gray-200;
      }
    }
  }

  &__confirm {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgb(239 68 68 / 10%);
    border-radius: $radius-md;
    font-size: $font-size-sm;

    &-ok {
      color: $color-danger;
      font-weight: $font-weight-semibold;
      cursor: pointer;
    }
    button:last-child {
      cursor: pointer;
      color: $color-gray-500;
    }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px 0;
    color: $color-gray-400;

    span {
      font-size: 48px;
    }
    p {
      font-size: $font-size-base;
      margin: 0;
    }
  }

  &__recs {
    margin-top: 24px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-top: 1px solid $color-gray-100;
    flex-shrink: 0;
  }

  &__total {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
  }

  &__checkout {
    display: inline-flex;
    padding: 12px 24px;
    background: $color-primary;
    color: $color-white;
    border-radius: $radius-md;
    font-weight: $font-weight-semibold;
    transition: background $transition-fast;

    &:hover {
      background: $color-primary-dark;
    }
  }
}

.cart-modal-enter-active,
.cart-modal-leave-active {
  transition: opacity $transition-base;

  .cart-modal__panel {
    transition: transform $transition-base;
  }
}

.cart-modal-enter-from,
.cart-modal-leave-to {
  opacity: 0;

  .cart-modal__panel {
    transform: translateX(100%);
  }
}
</style>
