<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle: string
  to: string
  bg: string
  video?: string
  image?: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const hovered = ref(false)

function onMouseEnter() {
  hovered.value = true
  videoRef.value?.play().catch(() => {})
}

function onMouseLeave() {
  hovered.value = false
  if (!videoRef.value) return
  videoRef.value.pause()
  videoRef.value.currentTime = 0
}
</script>

<template>
  <NuxtLink
    :to="to"
    class="category-banner"
    :style="{ background: bg }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="category-banner__media">
      <!-- Video background -->
      <video
        v-if="video"
        ref="videoRef"
        class="category-banner__video"
        :src="video"
        muted
        loop
        playsinline
        preload="auto"
      />

      <!-- Image overlay — fades out on hover -->
      <div
        v-if="image"
        class="category-banner__image"
        :class="{ 'category-banner__image--hidden': hovered }"
        :style="{ backgroundImage: `url(${image})` }"
      />

      <!-- external slot (legacy) -->
      <slot name="media" />
    </div>

    <div class="category-banner__content">
      <p class="category-banner__subtitle">{{ subtitle }}</p>
      <h3 class="category-banner__title">{{ title }}</h3>
      <span class="category-banner__cta"> Дивитись <ArrowRight :size="14" /> </span>
    </div>
  </NuxtLink>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.category-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: $radius-xl;
  overflow: hidden;
  text-decoration: none;
  color: $color-white;
  height: 100%;
  min-height: 240px;
  transition: transform $transition-base;

  &:hover {
    transform: translateY(-2px);
  }

  &__media {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  &__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 1;
    transition: opacity 0.6s ease;

    &--hidden {
      opacity: 0;
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    padding: 28px;
    background: linear-gradient(to top, rgb(0 0 0 / 55%) 0%, transparent 100%);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__subtitle {
    font-size: $font-size-sm;
    opacity: 0.85;
    margin: 0;
  }

  &__title {
    font-size: 32px;
    font-weight: $font-weight-bold;
    margin: 0;
    line-height: $line-height-tight;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    margin-top: 8px;
    opacity: 0.9;
  }
}
</style>
