<template>
  <footer class="the-footer">
    <div class="the-footer__inner container">
      <div class="the-footer__brand">
        <NuxtLink to="/" class="the-footer__logo">Nexus</NuxtLink>
        <p class="the-footer__desc">Лучшие шаблоны для современных проектов.</p>
      </div>

      <div class="the-footer__cols">
        <div class="the-footer__col">
          <span class="the-footer__col-title">Каталог</span>
          <NuxtLink to="/catalog" class="the-footer__link">Все товары</NuxtLink>
          <NuxtLink to="/promo" class="the-footer__link">Акции</NuxtLink>
        </div>
        <div class="the-footer__col">
          <span class="the-footer__col-title">Компания</span>
          <NuxtLink to="/about" class="the-footer__link">О нас</NuxtLink>
          <NuxtLink to="/contacts" class="the-footer__link">Контакты</NuxtLink>
        </div>
        <div class="the-footer__col">
          <span class="the-footer__col-title">Правовая информация</span>
          <NuxtLink to="/legal" class="the-footer__link">Условия использования</NuxtLink>
        </div>
      </div>
    </div>
    <div class="the-footer__bottom container">
      <span>© {{ new Date().getFullYear() }} Nexus Commerce. Все права защищены.</span>
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
    gap: 48px;
    padding-block: 48px;

    @media (max-width: 768px) { flex-direction: column; gap: 32px; }
  }

  &__brand { flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }

  &__logo { font-size: $font-size-xl; font-weight: $font-weight-bold; color: $color-primary; }

  &__desc { font-size: $font-size-sm; color: $color-gray-400; margin: 0; max-width: 200px; }

  &__cols { display: flex; gap: 48px; flex-wrap: wrap; }

  &__col { display: flex; flex-direction: column; gap: 8px; }

  &__col-title { font-size: $font-size-sm; font-weight: $font-weight-semibold; color: $color-gray-300; }

  &__link {
    font-size: $font-size-sm;
    color: $color-gray-400;
    transition: color $transition-fast;

    &:hover { color: $color-white; }
  }

  &__bottom {
    border-top: 1px solid $color-gray-800;
    padding-block: 16px;
    font-size: $font-size-sm;
    color: $color-gray-500;
  }
}
</style>
