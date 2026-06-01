<script setup lang="ts">
interface Breakpoint {
  w: number
  h: number
}

interface Props {
  src: string
  alt?: string
  lazy?: boolean
  imgClass?: string
  sizes?: {
    mobile?: Breakpoint
    tablet?: Breakpoint
    desktop?: Breakpoint
  }
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  lazy: true,
  imgClass: '',
  sizes: () => ({}),
})

const sizesAttr = computed(() => {
  const parts: string[] = []
  if (props.sizes.mobile) parts.push(`(max-width: 767px) ${props.sizes.mobile.w}px`)
  if (props.sizes.tablet) parts.push(`(max-width: 1023px) ${props.sizes.tablet.w}px`)
  if (props.sizes.desktop) parts.push(`${props.sizes.desktop.w}px`)
  return parts.join(', ')
})

const width = computed(
  () => props.sizes.desktop?.w ?? props.sizes.tablet?.w ?? props.sizes.mobile?.w,
)
const height = computed(
  () => props.sizes.desktop?.h ?? props.sizes.tablet?.h ?? props.sizes.mobile?.h,
)

const imgAttrs = computed(() => ({
  class: ['app-image__img', props.imgClass].filter(Boolean).join(' '),
  decoding: 'async' as const,
}))
</script>

<template>
  <NuxtPicture
    class="app-image"
    :src="src"
    :alt="alt"
    :loading="lazy ? 'lazy' : 'eager'"
    :sizes="sizesAttr || undefined"
    :width="width"
    :height="height"
    :img-attrs="imgAttrs"
    format="webp,jpg"
  />
</template>

<style lang="scss">
.app-image {
  display: contents;

  &__img {
    display: block;
    width: var(--ai-width, 100%);
    max-width: 100%;
    height: var(--ai-height, auto);
    object-fit: var(--ai-fit, cover);
    aspect-ratio: var(--ai-ratio, auto);
  }
}
</style>
