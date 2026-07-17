<script setup lang="ts">
const accepted = useCookie<boolean>('cookie_accepted', { maxAge: 60 * 60 * 24 * 365 })
const visible = ref(!accepted.value)

function accept() {
  accepted.value = true
  visible.value = false
}
</script>

<template>
  <Transition name="cookie-widget">
    <div v-if="visible" class="cookie-widget">
      <p class="cookie-widget__text">
        Ми використовуємо файли cookie для покращення роботи сайту. Залишаючись на сайті, ви
        погоджуєтесь з нашою
        <NuxtLink to="/privacy-policy" class="cookie-widget__link"
          >політикою конфіденційності</NuxtLink
        >.
      </p>
      <AppButton variant="primary" size="sm" @click="accept">Прийняти</AppButton>
    </div>
  </Transition>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;

.cookie-widget {
  position: fixed;
  bottom: 16px;
  right: 16px;
  left: 16px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 520px;
  padding: 24px;
  background: $color-white;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;

  &__text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-500;
    margin: 0;
    line-height: 1.5;
  }

  &__link {
    color: $color-primary;
    font-weight: $font-weight-semibold;
    transition: opacity $transition-base;

    &:hover {
      opacity: 0.75;
    }
  }
}

.cookie-widget-enter-active,
.cookie-widget-leave-active {
  transition:
    opacity $transition-base,
    transform $transition-base;
}

.cookie-widget-enter-from,
.cookie-widget-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
