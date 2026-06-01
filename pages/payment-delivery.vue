<script setup lang="ts">
useHead({ title: 'Оплата та доставка — Nexus Commerce' })
</script>

<template>
  <div class="legal-page container">
    <TheTitle tag="h1" size="m">Оплата та доставка</TheTitle>

    <div class="legal-page__section">
      <h2 class="legal-page__heading">Способи оплати</h2>
      <table class="legal-page__table">
        <thead>
          <tr>
            <th>Спосіб</th>
            <th>Деталі</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Картка онлайн (Visa / Mastercard)</td>
            <td>Миттєве підтвердження, захищено 3D Secure</td>
          </tr>
          <tr>
            <td>Apple Pay / Google Pay</td>
            <td>Доступно на мобільних пристроях</td>
          </tr>
          <tr>
            <td>Накладений платіж</td>
            <td>Оплата при отриманні у відділенні пошти</td>
          </tr>
          <tr>
            <td>Безготівковий переказ</td>
            <td>Для ФОП та юридичних осіб (за рахунком)</td>
          </tr>
        </tbody>
      </table>
      <p class="legal-page__text">
        Усі онлайн-платежі обробляються через захищений платіжний шлюз. Ми не зберігаємо дані
        банківських карток.
      </p>
    </div>

    <div class="legal-page__section">
      <h2 class="legal-page__heading">Способи доставки</h2>
      <table class="legal-page__table">
        <thead>
          <tr>
            <th>Служба</th>
            <th>Терміни</th>
            <th>Вартість</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Нова Пошта (відділення)</td>
            <td>1–2 робочих дні</td>
            <td>За тарифами НП</td>
          </tr>
          <tr>
            <td>Нова Пошта (кур'єр)</td>
            <td>1–2 робочих дні</td>
            <td>За тарифами НП + 50 грн</td>
          </tr>
          <tr>
            <td>Укрпошта</td>
            <td>3–5 робочих днів</td>
            <td>За тарифами Укрпошти</td>
          </tr>
          <tr>
            <td>Meest Express</td>
            <td>2–3 робочих дні</td>
            <td>За тарифами Meest</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="legal-page__section">
      <h2 class="legal-page__heading">Безкоштовна доставка</h2>
      <p class="legal-page__text">
        Безкоштовна доставка у відділення Нова Пошта діє для замовлень від 1 500 грн. Акція
        поширюється на доставку по всій території України.
      </p>
    </div>

    <div class="legal-page__section">
      <h2 class="legal-page__heading">Терміни обробки замовлення</h2>
      <p class="legal-page__text">
        Замовлення, оформлені до 14:00 у робочі дні, передаються до служби доставки у той самий
        день. Замовлення після 14:00 або у вихідні — наступного робочого дня. Ви отримаєте SMS та
        Email з трек-номером після відправки.
      </p>
    </div>

    <div class="legal-page__section">
      <h2 class="legal-page__heading">Доставка на тимчасово окуповані території</h2>
      <p class="legal-page__text">
        На жаль, ми не здійснюємо доставку на тимчасово окуповані та прифронтові території. Перелік
        недоступних регіонів уточнюйте у службі підтримки.
      </p>
    </div>
  </div>
</template>
