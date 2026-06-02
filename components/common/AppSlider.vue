<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import type { RouteLocationRaw } from 'vue-router'

type SlideItem = { id: string | number; [key: string]: unknown }

interface Props {
  slides?: SlideItem[]
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  loop?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  breakpoints?: Record<number, { slidesPerView: number }>
  title?: string
  linkLabel?: string
  linkTo?: RouteLocationRaw
  linkCount?: number
  peek?: boolean
}

withDefaults(defineProps<Props>(), {
  slides: () => [] as SlideItem[],
  slidesPerView: 1,
  spaceBetween: 12,
  loop: false,
  autoplay: false,
  autoplayDelay: 3000,
  breakpoints: () => ({}),
  title: '',
  linkLabel: '',
  linkTo: undefined,
  linkCount: undefined,
  peek: false,
})

const { isSm } = useBreakpoints()

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const swiperRef = ref<SwiperType | null>(null)
const isBeginning = ref(true)
const isEnd = ref(false)

function onSwiper(swiper: SwiperType) {
  swiperRef.value = swiper
  isBeginning.value = swiper.isBeginning
  isEnd.value = swiper.isEnd
}

function onSlideChange() {
  if (!swiperRef.value) return
  isBeginning.value = swiperRef.value.isBeginning
  isEnd.value = swiperRef.value.isEnd
}

onBeforeUnmount(() => {
  swiperRef.value?.autoplay?.stop()
  swiperRef.value = null
})
</script>

<template>
  <div :class="['app-slider', { 'app-slider--peek': peek }]">
    <div v-if="title" class="app-slider__header">
      <h2 class="app-slider__title">{{ title }}</h2>
      <div class="app-slider__controls">
        <NuxtLink v-if="linkTo && linkLabel" :to="linkTo" class="app-slider__link">
          {{ linkLabel }}<template v-if="linkCount !== undefined"> ({{ linkCount }})</template>
        </NuxtLink>
        <AppArrow
          v-if="mounted && isSm"
          direction="left"
          :disabled="isBeginning"
          @click="swiperRef?.slidePrev()"
        />
        <AppArrow
          v-if="mounted && isSm"
          direction="right"
          :disabled="isEnd"
          @click="swiperRef?.slideNext()"
        />
      </div>
    </div>

    <Swiper
      v-if="mounted"
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      :navigation="!title && isSm"
      :pagination="{ clickable: true }"
      :loop="loop"
      :autoplay="autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false"
      :breakpoints="breakpoints"
      :class="['app-slider__swiper', { 'app-slider__swiper--peek': peek }]"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="slide in slides" :key="slide.id">
        <slot v-if="slide" :slide="slide" />
      </SwiperSlide>
    </Swiper>

    <div v-else class="app-slider__static">
      <slot v-for="slide in slides" :key="slide.id" :slide="slide" />
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.app-slider {
  &--peek {
    overflow: visible;

    @include mixins.respond-to(sm) {
      overflow: unset;
    }
  }

  &__static {
    display: flex;
    gap: 12px;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__title {
    font-size: $font-size-xl;

    font-weight: $font-weight-bold;
    color: $color-gray-900;

    @include mixins.respond-to(md) {
      font-size: $font-size-2xl;
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__link {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-primary;
    margin-right: 8px;
    transition: color $transition-fast;

    &:hover {
      color: $color-primary-dark;
    }
  }

  &__swiper {
    overflow: hidden;
    border-radius: $radius-xl;

    &--peek {
      overflow: visible;
      border-radius: 0;

      @include mixins.respond-to(sm) {
        overflow: hidden;
        border-radius: $radius-xl;
      }
    }
    padding-block-start: 12px;
    padding-block-end: 40px;
    --swiper-navigation-color: #{$color-gray-500};
    --swiper-navigation-size: 20px;

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
      width: 20px;
      height: 20px;
      padding: 14px;
      box-sizing: content-box;
      transition: opacity $transition-fast;

      &::after {
        font-weight: 700;
      }
      &:hover {
        opacity: 0.6;
      }
    }

    :deep(.swiper-slide) {
      display: flex;
    }
    :deep(.swiper-pagination-bullet) {
      background: $color-gray-300;
      opacity: 1;
    }
    :deep(.swiper-pagination-bullet-active) {
      background: $color-primary;
    }
  }
}
</style>
