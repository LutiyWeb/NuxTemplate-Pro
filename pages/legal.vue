<script setup lang="ts">
useHead({ title: 'Правовая информация — Nexus Commerce' })
</script>

<template>
  <div class="legal-page container">
    <TheTitle tag="h1" size="m">Условия использования</TheTitle>
    <div class="legal-page__content">
      <h2>1. Общие положения</h2>
      <p>Используя данный сервис, вы соглашаетесь с настоящими условиями использования.</p>
      <h2>2. Интеллектуальная собственность</h2>
      <p>
        Все материалы на сайте защищены авторским правом. Использование без разрешения запрещено.
      </p>
      <h2>3. Ограничение ответственности</h2>
      <p>Сервис предоставляется «как есть» без каких-либо гарантий.</p>
      <h2>4. Контакты</h2>
      <p>
        По вопросам обращайтесь:
        <a href="mailto:info@nexus-commerce.dev">info@nexus-commerce.dev</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/variables" as *;
@use "~/assets/styles/mixins" as mixins;
.legal-page {
  padding-block: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__content {
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h2 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      margin: 0;
    }
    p {
      color: $color-gray-600;
      line-height: $line-height-relaxed;
      margin: 0;
    }
    a {
      color: $color-primary;
    }
  }
}
</style>
