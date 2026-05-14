<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Личный кабинет — Nexus Commerce' })

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const productsStore = useProductsStore()
const route = useRoute()

const activeSection = ref((route.query.section as string) || 'info')
const isDeleteOpen = ref(false)

const sections = [
  { key: 'info', label: 'Контактные данные' },
  { key: 'addresses', label: 'Адреса доставки' },
  { key: 'orders', label: 'История заказов' },
  { key: 'favorites', label: 'Избранное' },
]

// Form
const form = reactive({
  firstName: authStore.user?.firstName ?? '',
  lastName: authStore.user?.lastName ?? '',
  email: authStore.user?.email ?? '',
  phone: authStore.user?.phone ?? '',
})

const favProducts = computed(() =>
  productsStore.products.filter((p) => favoritesStore.ids.includes(p.id)),
)

onMounted(() => {
  if (favoritesStore.ids.length && !productsStore.products.length) {
    productsStore.fetchProducts({ limit: 40 })
  }
})

async function confirmDelete() {
  try {
    await authStore.deleteAccount()
    navigateTo('/')
  } catch {}
}
</script>

<template>
  <div class="cabinet container">
    <div class="cabinet__layout">
      <!-- Sidebar -->
      <aside class="cabinet__sidebar">
        <div class="cabinet__user">
          <div class="cabinet__avatar">{{ authStore.user?.firstName?.[0] }}</div>
          <div>
            <p class="cabinet__name">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
            <p class="cabinet__email">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <nav class="cabinet__nav">
          <button
            v-for="s in sections"
            :key="s.key"
            :class="['cabinet__nav-item', { 'cabinet__nav-item--active': activeSection === s.key }]"
            type="button"
            @click="activeSection = s.key"
          >{{ s.label }}</button>
        </nav>
        <button class="cabinet__logout" type="button" @click="authStore.logout(); navigateTo('/')">
          Выйти
        </button>
      </aside>

      <!-- Main -->
      <div class="cabinet__main">
        <!-- Info -->
        <div v-if="activeSection === 'info'" class="cabinet__section">
          <TheTitle tag="h2" size="m">Контактные данные</TheTitle>
          <div class="cabinet__form">
            <AppInputText v-model="form.firstName" label="Имя" />
            <AppInputText v-model="form.lastName" label="Фамилия" />
            <AppInputText v-model="form.email" label="Email" />
            <AppInputText v-model="form.phone" label="Телефон" placeholder="+38 (0##) ###-##-##" />
          </div>
          <AppButton variant="primary" size="md">Сохранить</AppButton>

          <div class="cabinet__danger-zone">
            <AppButton variant="danger" size="md" @click="isDeleteOpen = true">
              Удалить аккаунт
            </AppButton>
          </div>
        </div>

        <!-- Addresses -->
        <div v-else-if="activeSection === 'addresses'" class="cabinet__section">
          <TheTitle tag="h2" size="m">Адреса доставки</TheTitle>
          <p class="cabinet__empty">Адреса доставки не добавлены.</p>
          <div class="cabinet__form">
            <AppInputText label="Улица" placeholder="ул. Примерная, 1" />
            <AppInputText label="Город" placeholder="Киев" />
            <AppInputText label="Индекс" placeholder="01001" />
          </div>
          <AppButton variant="primary" size="md">Добавить адрес</AppButton>
        </div>

        <!-- Orders -->
        <div v-else-if="activeSection === 'orders'" class="cabinet__section">
          <TheTitle tag="h2" size="m">История заказов</TheTitle>
          <p class="cabinet__empty">Заказов пока нет.</p>
        </div>

        <!-- Favorites -->
        <div v-else-if="activeSection === 'favorites'" class="cabinet__section">
          <TheTitle tag="h2" size="m">Избранное</TheTitle>
          <div v-if="favProducts.length" class="cabinet__fav-grid">
            <TheProductCard v-for="p in favProducts" :key="p.id" :product="p" />
          </div>
          <p v-else class="cabinet__empty">Нет избранных товаров.</p>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <Teleport to="body">
      <div v-if="isDeleteOpen" class="delete-modal-overlay" @click.self="isDeleteOpen = false">
        <div class="delete-modal">
          <h3 class="delete-modal__title">Удалить аккаунт?</h3>
          <p class="delete-modal__text">Вы уверены, что хотите удалить аккаунт? Это действие необратимо.</p>
          <p v-if="authStore.error" class="delete-modal__error">{{ authStore.error }}</p>
          <div class="delete-modal__actions">
            <AppButton variant="outline" size="md" @click="isDeleteOpen = false">Отмена</AppButton>
            <AppButton variant="danger" size="md" :loading="authStore.loading" @click="confirmDelete">
              Удалить аккаунт
            </AppButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss">
.cabinet {
  padding-block: 32px;

  &__layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    align-items: flex-start;

    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  &__sidebar {
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    overflow: hidden;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: $radius-full;
    background: $color-primary;
    color: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    flex-shrink: 0;
  }

  &__name { font-weight: $font-weight-semibold; margin: 0; font-size: $font-size-sm; }
  &__email { color: $color-gray-500; font-size: $font-size-xs; margin: 0; }

  &__nav { padding: 8px; display: flex; flex-direction: column; gap: 2px; }

  &__nav-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-gray-600;
    cursor: pointer;
    transition: background $transition-fast, color $transition-fast;

    &:hover { background: $color-gray-100; color: $color-gray-900; }
    &--active { background: $color-primary; color: $color-white; }
  }

  &__logout {
    display: block;
    width: 100%;
    padding: 12px 16px;
    border-top: 1px solid $color-gray-100;
    text-align: left;
    font-size: $font-size-sm;
    color: $color-danger;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover { background: rgb(239 68 68 / 5%); }
  }

  &__main { background: $color-white; border: 1px solid $color-gray-100; border-radius: $radius-xl; padding: 24px; }

  &__section { display: flex; flex-direction: column; gap: 20px; }

  &__form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  &__empty { color: $color-gray-400; font-size: $font-size-sm; }

  &__fav-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  }

  &__danger-zone { margin-top: 24px; padding-top: 24px; border-top: 1px solid $color-gray-100; }
}

.delete-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: $z-modal-overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.delete-modal {
  background: $color-white;
  border-radius: $radius-xl;
  padding: 32px;
  max-width: 400px;
  width: 100%;

  &__title { font-size: $font-size-xl; font-weight: $font-weight-bold; margin: 0 0 12px; }
  &__text { color: $color-gray-600; margin: 0 0 16px; }
  &__error { color: $color-danger; font-size: $font-size-sm; margin: 0 0 12px; }
  &__actions { display: flex; gap: 12px; justify-content: flex-end; }
}
</style>
