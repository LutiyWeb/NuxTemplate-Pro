<script setup lang="ts">
useHead({ title: 'Оплата та доставка — Nexus Commerce' })
</script>

<template>
  <div class="legal-page container">
    <TheTitle tag="h1" size="m">Оплата та доставка</TheTitle>

    <AppAccordion title="Способи оплати" :default-open="true">
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
    </AppAccordion>

    <AppAccordion title="Способи доставки">
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
    </AppAccordion>

    <AppAccordion title="Безкоштовна доставка">
      <p class="legal-page__text">
        Безкоштовна доставка у відділення Нова Пошта діє для замовлень від 1 500 грн. Акція
        поширюється на доставку по всій території України.
      </p>
    </AppAccordion>

    <AppAccordion title="Терміни обробки замовлення">
      <p class="legal-page__text">
        Замовлення, оформлені до 14:00 у робочі дні, передаються до служби доставки у той самий
        день. Замовлення після 14:00 або у вихідні — наступного робочого дня. Ви отримаєте SMS та
        Email з трек-номером після відправки.
      </p>
    </AppAccordion>

    <AppAccordion title="Доставка на тимчасово окуповані території">
      <p class="legal-page__text">
        Доставка здійснюється виключно в ті населені пункти та відділення логістичних служб, які є
        відкритими та фактично здійснюють обслуговування клієнтів на момент відправки замовлення.
        Актуальний перелік працюючих відділень уточнюйте на сайтах перевізників або у нашій службі
        підтримки.
      </p>
    </AppAccordion>
  </div>
</template>
