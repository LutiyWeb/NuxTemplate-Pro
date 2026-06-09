<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import type { CartEntry } from '~/stores/cart'

defineProps<{
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

    <NuxtLink :to="`/product/${item.product.id}`" class="cart-item__img-link">
      <img
        v-if="item.product.thumbnail"
        :src="item.product.thumbnail"
        :alt="item.product.title"
        class="cart-item__img"
      />
      <div v-else class="cart-item__img cart-item__img--placeholder" />
    </NuxtLink>

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
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.cart-item {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid $color-gray-100;
  align-items: start;

  @include mixins.respond-to(md) {
    grid-template-columns: auto 64px 1fr auto auto;
    grid-template-rows: auto;
    align-items: center;
  }

  &__check {
    grid-column: 1;
    grid-row: 1 / 3;
    align-self: center;
    width: 16px;
    height: 16px;
    cursor: pointer;

    @include mixins.respond-to(md) {
      grid-row: 1;
    }
  }

  &__img-link {
    grid-column: 2;
    grid-row: 1 / 3;
    display: block;
    border-radius: $radius-md;
    flex-shrink: 0;

    @include mixins.respond-to(md) {
      grid-row: 1;
    }
  }

  &__img {
    display: block;
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: $radius-md;

    &--placeholder {
      background: $color-gray-100;
    }

    @include mixins.respond-to(md) {
      width: 64px;
      height: 64px;
    }
  }

  &__info {
    grid-column: 3;
    grid-row: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;

    @include mixins.respond-to(md) {
      grid-column: 3;
    }
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
    grid-column: 3 / 5;
    grid-row: 2;
    display: flex;
    align-items: center;
    gap: 8px;

    @include mixins.respond-to(md) {
      grid-column: 4;
      grid-row: 1;
    }

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
    grid-column: 4;
    grid-row: 1;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background $transition-fast;

    @include mixins.respond-to(md) {
      grid-column: 5;
    }

    &:hover {
      background: rgb(239 68 68 / 10%);
    }
  }
}
</style>
