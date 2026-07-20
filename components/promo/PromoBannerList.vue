<script setup lang="ts">
interface PromoBanner {
  id: number
  gradient: string
  title: string
  subtitle: string
}

defineProps<{ banners: PromoBanner[] }>()
</script>

<template>
  <div class="promo-banner-list">
    <PromoBannerCard
      v-for="banner in banners"
      :key="banner.id"
      :gradient="banner.gradient"
      :title="banner.title"
      :subtitle="banner.subtitle"
    />
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.promo-banner-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-block: 4px 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex: 0 0 300px;
  }

  @include mixins.respond-to(md) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: visible;

    > * {
      flex: 0 0 auto;
    }
  }
}
</style>
