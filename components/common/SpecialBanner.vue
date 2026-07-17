<script setup lang="ts">
interface Props {
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string | null
  reverse?: boolean
}

withDefaults(defineProps<Props>(), { reverse: false })
</script>

<template>
  <NuxtLink
    v-if="linkUrl"
    :to="linkUrl"
    :class="['special-banner', { 'special-banner--reverse': reverse }]"
  >
    <div class="special-banner__image">
      <img :src="imageUrl" :alt="title" class="special-banner__img" />
    </div>
    <div class="special-banner__content">
      <h2 class="special-banner__title">{{ title }}</h2>
      <p v-if="description" class="special-banner__description">{{ description }}</p>
      <div class="special-banner__actions">
        <AppButton variant="primary" size="lg" tag="span">Дивитись</AppButton>
      </div>
    </div>
  </NuxtLink>
  <div v-else :class="['special-banner', { 'special-banner--reverse': reverse }]">
    <div class="special-banner__image">
      <img :src="imageUrl" :alt="title" class="special-banner__img" />
    </div>
    <div class="special-banner__content">
      <h2 class="special-banner__title">{{ title }}</h2>
      <p v-if="description" class="special-banner__description">{{ description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.special-banner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  padding: 32px 24px;
  border-radius: $radius-2xl;
  background: $color-gray-100;

  @include mixins.respond-to(md) {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    padding: 48px;
  }

  &--reverse {
    .special-banner__image {
      @include mixins.respond-to(md) {
        order: 1;
      }
    }
  }

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    width: 100%;
    max-height: 260px;
    object-fit: contain;

    @include mixins.respond-to(md) {
      max-height: 320px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 16px;

    @include mixins.respond-to(md) {
      align-items: flex-end;
      text-align: right;
      gap: 20px;
    }
  }

  &--reverse &__content {
    @include mixins.respond-to(md) {
      align-items: flex-start;
      text-align: left;
    }
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0;

    @include mixins.respond-to(md) {
      font-size: $font-size-3xl;
    }
  }

  &__description {
    font-size: $font-size-base;
    color: $color-gray-600;
    margin: 0;
    max-width: 420px;
    line-height: 1.6;
  }

  &__actions {
    margin-top: 4px;
  }
}
</style>
