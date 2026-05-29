<script setup lang="ts">
const uiStore = useUiStore()

const AUTH_CODE = `<!-- Открыть из любого места -->
<AppButton @click="uiStore.authModalOpen = true">Войти</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderAuthModal v-model:open="uiStore.authModalOpen" />`

const FORGOT_CODE = `<!-- Открыть из любого места -->
<AppButton @click="uiStore.forgotPasswordModalOpen = true">Забыли пароль?</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderForgotPasswordModal v-model:open="uiStore.forgotPasswordModalOpen" />`

const SEARCH_CODE = `<!-- Открыть поиск -->
<AppButton @click="uiStore.searchOpen = true">Поиск</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderSearchOverlay :open="uiStore.searchOpen" @close="uiStore.searchOpen = false" />`

const CATALOG_CODE = `<!-- Открыть меню каталога -->
<AppButton @click="uiStore.catalogOpen = true">Каталог</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderCatalogMenu :open="uiStore.catalogOpen" @close="uiStore.catalogOpen = false" />`

const MODAL_CODE = `<!-- Базовый компонент, переиспользуется во всех модалках -->
<AppModal :open="myModalOpen" @update:open="myModalOpen = $event">
  <!-- Контент модалки -->
  <h2>Заголовок</h2>
  <form class="app-modal__form">
    <!-- поля -->
    <p class="app-modal__error">Ошибка</p>
    <AppButton type="submit">Сохранить</AppButton>
    <button class="app-modal__secondary-btn">Вторичное действие</button>
  </form>
</AppModal>`
</script>

<template>
  <div class="uikit-modals">
    <UiKitSection
      title="AppModal"
      description="Базовый компонент модалки: оверлей, контейнер, крестик, анимация. Все остальные модалки строятся на его основе."
    >
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
          <span style="font-size: 13px; color: #9ca3af">Базовый компонент — открой Auth Modal или Forgot Password ниже</span>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="MODAL_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection
      title="Auth Modal"
      description="Модалка входа/регистрации. Управляется через uiStore.authModalOpen"
    >
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
          <AppButton variant="primary" @click="uiStore.authModalOpen = true">
            Открыть Auth Modal
          </AppButton>
          <span style="font-size: 13px; color: #9ca3af">uiStore.authModalOpen = true</span>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="AUTH_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection
      title="Forgot Password Modal"
      description="Модалка восстановления пароля. Управляется через uiStore.forgotPasswordModalOpen"
    >
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
          <AppButton variant="outline" @click="uiStore.forgotPasswordModalOpen = true">
            Открыть Forgot Password Modal
          </AppButton>
          <span style="font-size: 13px; color: #9ca3af">uiStore.forgotPasswordModalOpen = true</span>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="FORGOT_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection
      title="Search Overlay"
      description="Поисковый оверлей с историей, категориями и трендовыми товарами"
    >
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
          <AppButton variant="outline" @click="uiStore.searchOpen = true">
            Открыть Search Overlay
          </AppButton>
          <span style="font-size: 13px; color: #9ca3af">uiStore.searchOpen = true</span>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="SEARCH_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection
      title="Catalog Menu"
      description="Выпадающее меню каталога с категориями и подкатегориями"
    >
      <template #preview>
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start">
          <AppButton variant="outline" @click="uiStore.catalogOpen = true">
            Открыть Catalog Menu
          </AppButton>
          <span style="font-size: 13px; color: #9ca3af">uiStore.catalogOpen = true</span>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="CATALOG_CODE" />
      </template>
    </UiKitSection>

    <UiKitSection title="UiStore API" description="Централизованное управление всеми оверлеями">
      <UiKitPropsTable
        :rows="[
          { name: 'authModalOpen', type: 'boolean', default: 'false', description: 'Auth Modal открыта' },
          { name: 'forgotPasswordModalOpen', type: 'boolean', default: 'false', description: 'Forgot Password Modal открыта' },
          { name: 'catalogOpen', type: 'boolean', default: 'false', description: 'Каталог открыт' },
          { name: 'searchOpen', type: 'boolean', default: 'false', description: 'Поиск открыт' },
          { name: 'sidebarOpen', type: 'boolean', default: 'false', description: 'Мобильный сайдбар открыт' },
          { name: 'closeAll()', type: 'function', description: 'Закрыть все оверлеи' },
        ]"
      />
    </UiKitSection>
  </div>
</template>

<style lang="scss">
.uikit-modals {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
