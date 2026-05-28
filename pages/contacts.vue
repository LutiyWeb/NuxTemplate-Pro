<script setup lang="ts">
useHead({ title: 'Контакти — Nexus Commerce' })
</script>

<template>
  <div class="contacts-page container">
    <TheTitle tag="h1" size="l">Контакти</TheTitle>
    <div class="contacts-page__layout">
      <div class="contacts-page__info">
        <div class="contacts-page__block">
          <span class="contacts-page__block-label">Служба підтримки</span>
          <a href="tel:+380440000000" class="contacts-page__contact-link">+38 (044) 000-00-00</a>
          <span class="contacts-page__hint">Пн–Пт, 9:00–18:00</span>
        </div>
        <div class="contacts-page__block">
          <span class="contacts-page__block-label">Email</span>
          <a href="mailto:support@nexus-commerce.ua" class="contacts-page__contact-link">
            support@nexus-commerce.ua
          </a>
        </div>
        <div class="contacts-page__block">
          <span class="contacts-page__block-label">Адреса</span>
          <span class="contacts-page__contact-text">м. Київ, вул. Хрещатик, 1</span>
        </div>
        <div class="contacts-page__block">
          <span class="contacts-page__block-label">Юридичні питання</span>
          <a href="mailto:legal@nexus-commerce.ua" class="contacts-page__contact-link">
            legal@nexus-commerce.ua
          </a>
        </div>
      </div>
      <form class="contacts-page__form">
        <AppInputText label="Ваше ім'я" placeholder="Іван Іваненко" />
        <AppInputText label="Email" placeholder="email@example.com" />
        <div>
          <label class="contacts-page__label">Повідомлення</label>
          <textarea class="contacts-page__textarea" placeholder="Ваше запитання..." />
        </div>
        <AppButton variant="primary" size="md">Надіслати</AppButton>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.contacts-page {
  padding-block: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;

    @include mixins.respond-to(md) { grid-template-columns: 1fr 1fr; }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__block-label {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-gray-400;
  }

  &__contact-link {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
    transition: color $transition-fast;

    &:hover { color: $color-primary; }
  }

  &__contact-text {
    font-size: $font-size-lg;
    color: $color-gray-700;
  }

  &__hint {
    font-size: $font-size-sm;
    color: $color-gray-400;
  }

  &__form { display: flex; flex-direction: column; gap: 16px; }

  &__label { display: block; font-size: $font-size-sm; font-weight: $font-weight-medium; color: $color-gray-700; margin-bottom: 6px; }

  &__textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    font-family: $font-family-base;
    font-size: $font-size-base;
    resize: vertical;
    min-height: 120px;
    outline: none;

    &:focus { border-color: $color-primary; }
  }
}
</style>
