<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const open = reactive<Record<number, boolean>>({})
function toggle(i: number) {
  open[i] = !open[i]
}
</script>

<template>
  <footer class="the-footer">
    <div class="the-footer__inner container">
      <div class="the-footer__brand">
        <NuxtLink to="/" class="the-footer__logo">Nexus</NuxtLink>
        <p class="the-footer__desc">Лучшие шаблоны для современных проектов.</p>
      </div>

      <div class="the-footer__cols">
        <div
          v-for="(col, i) in [
            {
              title: 'Каталог',
              links: [
                { to: '/catalog', label: 'Все товари' },
                { to: '/promo', label: 'Акції' },
              ],
            },
            {
              title: 'Компанія',
              links: [
                { to: '/about', label: 'Про нас' },
                { to: '/contacts', label: 'Контакти' },
              ],
            },
            {
              title: 'Покупцям',
              links: [
                { to: '/payment-delivery', label: 'Оплата та доставка' },
                { to: '/returns-exchanges', label: 'Повернення та обмін' },
              ],
            },
            {
              title: 'Правова інформація',
              links: [
                { to: '/public-offer', label: 'Публічна оферта' },
                { to: '/privacy-policy', label: 'Політика конфіденційності' },
              ],
            },
          ]"
          :key="i"
          class="the-footer__col"
        >
          <button
            :class="['the-footer__col-toggle', { 'the-footer__col-toggle--open': open[i] }]"
            type="button"
            @click="toggle(i)"
          >
            {{ col.title }}
            <ChevronDown class="the-footer__col-icon" :size="14" />
          </button>
          <div :class="['the-footer__col-body', { 'the-footer__col-body--open': open[i] }]">
            <div class="the-footer__col-body-inner">
              <NuxtLink
                v-for="link in col.links"
                :key="link.to"
                :to="link.to"
                class="the-footer__link"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="the-footer__bottom container">
      <span>© {{ new Date().getFullYear() }} Nexus Commerce. Усі права захищені.</span>
    </div>
  </footer>
</template>

<style lang="scss">
.the-footer {
  background: $color-gray-900;
  color: $color-white;
  margin-top: auto;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-block: 48px;

    @include mixins.respond-to(md) {
      flex-direction: row;
      gap: 48px;
    }
  }

  &__brand {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__logo {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $color-gray-400;
    margin: 0;
    max-width: 200px;
  }

  &__cols {
    display: flex;
    flex-direction: column;
    flex: 1;

    @include mixins.respond-to(md) {
      flex-direction: row;
      gap: 32px;
    }
  }

  &__col {
    display: flex;
    flex-direction: column;

    @include mixins.respond-to(md) {
      flex: 1;
    }
  }

  &__col-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 12px 0;
    background: none;
    border: none;
    border-bottom: 1px solid $color-gray-800;
    cursor: pointer;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-gray-300;
    text-align: left;
    transition: color $transition-fast;

    &:hover {
      color: $color-white;
    }

    &--open {
      color: $color-white;

      .the-footer__col-icon {
        transform: rotate(180deg);
      }
    }

    @include mixins.respond-to(md) {
      cursor: default;
      pointer-events: none;
      border-bottom: none;
      padding: 0 0 12px;
    }
  }

  &__col-icon {
    flex-shrink: 0;
    color: $color-gray-500;
    transition: transform $transition-base;

    @include mixins.respond-to(md) {
      display: none;
    }
  }

  &__col-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows $transition-base;

    &--open {
      grid-template-rows: 1fr;
    }

    @include mixins.respond-to(md) {
      grid-template-rows: 1fr;
      transition: none;
    }
  }

  &__col-body-inner {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 0;
    transition: padding-top $transition-base;

    .the-footer__col-body--open & {
      padding-top: 8px;
    }

    @include mixins.respond-to(md) {
      overflow: visible;
      padding-top: 0;
      transition: none;
    }
  }

  &__link {
    font-size: $font-size-sm;
    color: $color-gray-400;
    padding: 5px 0;
    transition: color $transition-fast;

    &:hover {
      color: $color-white;
    }
  }

  &__bottom {
    border-top: 1px solid $color-gray-800;
    padding-block: 16px;
    font-size: $font-size-sm;
    color: $color-gray-500;
  }
}
</style>
