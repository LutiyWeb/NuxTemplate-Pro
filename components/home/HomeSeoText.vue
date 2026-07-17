<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <section class="seo-block">
    <h2 class="seo-block__title">Купити смартфон, гаджети та аксесуари онлайн — Nexus</h2>
    <p class="seo-block__intro">
      <strong>Nexus</strong> — це сучасний інтернет-магазин електроніки, де кожен покупець знайде
      техніку для роботи, навчання та відпочинку. Ми пропонуємо широкий вибір смартфонів, планшетів,
      ноутбуків, навушників та аксесуарів від провідних світових брендів — Apple, Samsung, Sony,
      Xiaomi та інших. Весь асортимент сертифікований, має офіційну гарантію та доставляється по
      всій Україні.
    </p>

    <div :class="['seo-block__body', { 'seo-block__body--open': open }]">
      <div class="seo-block__inner">
        <h3 class="seo-block__subtitle">Чому обирають Nexus?</h3>
        <ul class="seo-block__list">
          <li>
            <strong>Великий асортимент</strong> — понад 1&nbsp;000 товарів у наявності та під
            замовлення: від бюджетних моделей до флагманів преміум-класу.
          </li>
          <li>
            <strong>Офіційна гарантія</strong> — на кожен товар надається гарантійний талон
            виробника та сервісна підтримка.
          </li>
          <li>
            <strong>Швидка доставка</strong> — відправляємо замовлення протягом 24&nbsp;годин після
            підтвердження. Доставка «Новою Поштою» або «Укрпоштою».
          </li>
          <li>
            <strong>Вигідні ціни</strong> — регулярні акції, сезонні розпродажі та програма
            лояльності для постійних клієнтів.
          </li>
          <li>
            <strong>Зручна оплата</strong> — картка Visa/Mastercard, готівка, оплата частинами без
            переплати.
          </li>
        </ul>

        <h3 class="seo-block__subtitle">Каталог техніки</h3>
        <p>
          У нашому магазині ви можете <strong>купити смартфон</strong> будь-якого цінового сегмента:
          від доступних моделей для повсякденного використання до флагманів з найпотужнішими
          процесорами та камерами. Крім смартфонів, у каталозі представлені ноутбуки для роботи та
          навчання, планшети для творчості й розваг, бездротові навушники та розумні годинники.
          Широкий вибір <strong>аксесуарів</strong> — чохли, захисні скла, кабелі, зарядні пристрої
          — зробить вашу техніку ще зручнішою.
        </p>

        <h3 class="seo-block__subtitle">Доставка та оплата</h3>
        <p>
          Доставляємо <strong>гаджети</strong> по всій Україні — у будь-яке місто та село. Самовивіз
          доступний у нашому шоурумі. Середній термін доставки — 1–2 робочі дні. Для оплати
          приймаємо картки Visa та Mastercard, готівку при отриманні, а також оплату частинами через
          партнерські банки — без відсотків і переплат.
        </p>

        <h3 class="seo-block__subtitle">Акції та знижки</h3>
        <p>
          Слідкуйте за розділом <strong>«Акції»</strong> — тут ми публікуємо знижки на популярні
          <strong>гаджети</strong>, сезонні розпродажі та спеціальні пропозиції для нових покупців.
          Підпишіться на розсилку, щоб першими дізнаватися про нові надходження й ексклюзивні
          пропозиції. Разом з Nexus купити смартфон або будь-який інший гаджет вигідно та зручно —
          незалежно від того, де ви знаходитеся.
        </p>
      </div>
    </div>

    <button class="seo-block__btn" type="button" @click="open = !open">
      {{ open ? 'Сховати' : 'Читати повністю' }}
      <span :class="['seo-block__arrow', { 'seo-block__arrow--open': open }]">↓</span>
    </button>
  </section>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.seo-block {
  padding: 24px 0 0;
  border-top: 1px solid $color-gray-200;

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 16px;
    line-height: 1.3;

    @include mixins.respond-to(md) {
      font-size: $font-size-2xl;
    }
  }

  &__intro {
    font-size: $font-size-sm;
    color: $color-gray-600;
    line-height: 1.7;
    margin: 0;
    max-width: 800px;

    @include mixins.respond-to(md) {
      font-size: $font-size-base;
    }
  }

  &__body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s ease;

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__inner {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 0;
    transition: padding-top 0.4s ease;

    .seo-block__body--open & {
      padding-top: 24px;
    }
  }

  &__subtitle {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-gray-800;
    margin: 0;

    @include mixins.respond-to(md) {
      font-size: $font-size-lg;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      font-size: $font-size-sm;
      color: $color-gray-600;
      line-height: 1.6;
      padding-left: 20px;
      position: relative;

      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: $color-primary;
        font-weight: $font-weight-bold;
      }

      @include mixins.respond-to(md) {
        font-size: $font-size-base;
      }
    }
  }

  p {
    font-size: $font-size-base;
    color: $color-gray-600;
    line-height: 1.7;
    margin: 0;
    max-width: 800px;

    @include mixins.respond-to(md) {
      font-size: $font-size-base;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 0;
    background: none;
    border: none;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-primary;
    cursor: pointer;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.75;
    }
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.3s ease;

    &--open {
      transform: rotate(180deg);
    }
  }
}
</style>
