<script setup lang="ts">
import type { CartEntry } from '~/stores/cart'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  item: CartEntry
  selected: boolean
}>()

const emit = defineEmits<{
  'update:selected': [boolean]
  remove: [number]
  updateQty: [number, number]
}>()

function formatPrice(p: number) {
  return p.toLocaleString('uk-UA') + ' ₴'
}
</script>

<template>
  <div class="cart-item">
    <input
      type="checkbox"
      class="cart-item__check"
      :checked="selected"
      @change="emit('update:selected', ($event.target as HTMLInputElement).checked)"
    />

    <img
      v-if="item.product.thumbnail"
      :src="item.product.thumbnail"
      :alt="item.product.title"
      class="cart-item__img"
    />
    <div v-else class="cart-item__img cart-item__img--placeholder" />

    <div class="cart-item__info">
      <NuxtLink :to="`/product/${item.product.id}`" class="cart-item__title">
        {{ item.product.title }}
      </NuxtLink>
      <span class="cart-item__price">{{ formatPrice(item.product.price) }}</span>
    </div>

    <div class="cart-item__qty">
      <button type="button" @click="emit('updateQty', item.product.id, -1)">−</button>
      <span>{{ item.qty }}</span>
      <button type="button" @click="emit('updateQty', item.product.id, 1)">+</button>
    </div>

    <button class="cart-item__remove" type="button" @click="emit('remove', item.product.id)">
      <Trash2 :size="16" />
    </button>
  </div>
</template>

<style lang="scss">
.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $color-gray-100;

  &__check {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &__img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: $radius-md;
    flex-shrink: 0;

    &--placeholder {
      background: $color-gray-100;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: $color-primary;
    }
  }

  &__price {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
  }

  &__qty {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    button {
      width: 28px;
      height: 28px;
      background: $color-gray-100;
      border-radius: $radius-md;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background $transition-fast;

      &:hover {
        background: $color-gray-200;
      }
    }

    span {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      min-width: 20px;
      text-align: center;
    }
  }

  &__remove {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: transparent;
    border-radius: $radius-md;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background $transition-fast;

    &:hover {
      background: rgb(239 68 68 / 10%);
    }
  }
}
</style>
