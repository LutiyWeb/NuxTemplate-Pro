<script setup lang="ts">
const uiStore = useUiStore()

const AUTH_CODE = `<!-- Открыть из любого места -->
<AppButton @click="uiStore.authModalOpen = true">Войти</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderAuthModal v-model:open="uiStore.authModalOpen" />`

const SEARCH_CODE = `<!-- Открыть поиск -->
<AppButton @click="uiStore.searchOpen = true">Поиск</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderSearchOverlay :open="uiStore.searchOpen" @close="uiStore.searchOpen = false" />`

const CATALOG_CODE = `<!-- Открыть меню каталога -->
<AppButton @click="uiStore.catalogOpen = true">Каталог</AppButton>

<!-- Компонент подключен в TheHeader -->
<HeaderCatalogMenu :open="uiStore.catalogOpen" @close="uiStore.catalogOpen = false" />`
</script>

<template>
  <div class="uikit-modals">
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
          {
            name: 'authModalOpen',
            type: 'boolean',
            default: 'false',
            description: 'Auth Modal открыта',
          },
          { name: 'catalogOpen', type: 'boolean', default: 'false', description: 'Каталог открыт' },
          { name: 'searchOpen', type: 'boolean', default: 'false', description: 'Поиск открыт' },
          {
            name: 'sidebarOpen',
            type: 'boolean',
            default: 'false',
            description: 'Мобильный сайдбар открыт',
          },
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
