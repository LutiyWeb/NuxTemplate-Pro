<script setup lang="ts">
useHead({ title: 'Контакты — Nexus Commerce' })
</script>

<template>
  <div class="contacts-page container">
    <TheTitle tag="h1" size="l">Контакты</TheTitle>
    <div class="contacts-page__layout">
      <div class="contacts-page__info">
        <p>📧 info@nexus-commerce.dev</p>
        <p>📞 +38 (044) 000-00-00</p>
        <p>📍 Киев, Украина</p>
      </div>
      <form class="contacts-page__form">
        <AppInputText label="Ваше имя" placeholder="Иван Иванов" />
        <AppInputText label="Email" placeholder="email@example.com" />
        <div>
          <label class="contacts-page__label">Сообщение</label>
          <textarea class="contacts-page__textarea" placeholder="Ваш вопрос..." />
        </div>
        <AppButton variant="primary" size="md">Отправить</AppButton>
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
    grid-template-columns: 1fr 1fr;
    gap: 48px;

    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  &__info { display: flex; flex-direction: column; gap: 12px; font-size: $font-size-lg; color: $color-gray-700; }

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
