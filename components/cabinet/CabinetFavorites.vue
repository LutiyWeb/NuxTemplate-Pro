<script setup lang="ts">
import { Heart, Plus, Trash2, MoreHorizontal, Check } from 'lucide-vue-next'

const wishlistsStore = useWishlistsStore()
const toastStore = useToastStore()

const loading = ref(true)
const error = ref(false)
const creatingList = ref(false)
const newListName = ref('')
const createModalOpen = ref(false)
const activeTabId = ref<number | null>(null)

const menuProductId = ref<number | null>(null)
const moveModalOpen = ref(false)
const movingProductId = ref<number | null>(null)
const moveTargetId = ref<number | null>(null)
const isMoving = ref(false)

const selectionMode = ref(false)
const selectedIds = ref(new Set<number>())

const activeList = computed(
  () =>
    wishlistsStore.wishlists.find((w) => w.id === activeTabId.value) ??
    wishlistsStore.wishlists.find((w) => w.isDefault) ??
    null,
)

const otherLists = computed(() =>
  wishlistsStore.wishlists.filter((w) => w.id !== activeTabId.value),
)

const allSelected = computed(
  () =>
    !!activeList.value?.items.length &&
    activeList.value.items.every((i) => selectedIds.value.has(i.productId)),
)

function selectTab(id: number) {
  activeTabId.value = id
  exitSelectionMode()
}

function openCreateModal() {
  newListName.value = ''
  createModalOpen.value = true
}

function closeMenu() {
  menuProductId.value = null
}

function toggleMenu(productId: number) {
  menuProductId.value = menuProductId.value === productId ? null : productId
}

function openMoveModal(productId: number) {
  movingProductId.value = productId
  moveTargetId.value = null
  moveModalOpen.value = true
  menuProductId.value = null
}

function openBulkMoveModal() {
  moveTargetId.value = null
  moveModalOpen.value = true
}

function exitSelectionMode() {
  selectionMode.value = false
  selectedIds.value = new Set()
}

function toggleSelectionMode() {
  if (selectionMode.value) {
    exitSelectionMode()
  } else {
    selectionMode.value = true
  }
}

function toggleSelection(productId: number) {
  const next = new Set(selectedIds.value)
  if (next.has(productId)) next.delete(productId)
  else next.add(productId)
  selectedIds.value = next
}

function toggleSelectAll() {
  if (!activeList.value) return
  if (allSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(activeList.value.items.map((i) => i.productId))
  }
}

function removeAndCloseMenu(wishlistId: number, productId: number) {
  removeItem(wishlistId, productId)
  menuProductId.value = null
}

async function load() {
  loading.value = true
  error.value = false
  try {
    await wishlistsStore.fetchWishlists()
    if (activeTabId.value === null) {
      const def = wishlistsStore.wishlists.find((w) => w.isDefault)
      if (def) activeTabId.value = def.id
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function createList() {
  const name = newListName.value.trim()
  if (!name) return
  creatingList.value = true
  try {
    const newList = await wishlistsStore.createList(name)
    newListName.value = ''
    createModalOpen.value = false
    activeTabId.value = newList.id
    toastStore.add('Список создан')
  } catch {
    toastStore.add('Не удалось создать список', 'error')
  } finally {
    creatingList.value = false
  }
}

async function deleteList(id: number) {
  try {
    await wishlistsStore.deleteList(id)
    if (activeTabId.value === id) {
      const def = wishlistsStore.wishlists.find((w) => w.isDefault)
      activeTabId.value = def?.id ?? null
    }
    exitSelectionMode()
    toastStore.add('Список удалён', 'warning')
  } catch {
    toastStore.add('Не удалось удалить список', 'error')
  }
}

async function removeItem(wishlistId: number, productId: number) {
  try {
    await wishlistsStore.removeItem(wishlistId, productId)
  } catch {
    toastStore.add('Не удалось убрать товар', 'error')
  }
}

async function confirmMove() {
  if (!moveTargetId.value || !activeTabId.value) return

  const isBulk = selectionMode.value && selectedIds.value.size > 0
  if (!isBulk && !movingProductId.value) return

  isMoving.value = true
  try {
    if (isBulk) {
      const ids = [...selectedIds.value]
      await wishlistsStore.moveItems(ids, activeTabId.value, moveTargetId.value)
      exitSelectionMode()
      toastStore.add(`${ids.length} товаров перемещено`)
    } else {
      await wishlistsStore.moveItem(movingProductId.value!, activeTabId.value, moveTargetId.value)
      toastStore.add('Товар перемещён')
    }
    activeTabId.value = moveTargetId.value
    moveModalOpen.value = false
  } catch {
    toastStore.add('Не удалось переместить', 'error')
  } finally {
    isMoving.value = false
  }
}

onMounted(() => {
  load()
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <div class="cab-fav">
    <div class="cab-fav__header">
      <template v-if="!selectionMode">
        <h2 class="cab-fav__title">Избранное</h2>
        <div class="cab-fav__header-actions">
          <button
            v-if="activeList && activeList.items.length"
            class="cab-fav__select-btn"
            type="button"
            @click="toggleSelectionMode"
          >
            Выбрать
          </button>
          <button class="cab-fav__add-list-btn" type="button" @click="openCreateModal">
            <Plus :size="16" />
            Новый список
          </button>
        </div>
      </template>
      <template v-else>
        <span class="cab-fav__selection-info">
          Выбрано: {{ selectedIds.size }} из {{ activeList?.items.length ?? 0 }}
        </span>
        <div class="cab-fav__header-actions">
          <button class="cab-fav__select-btn" type="button" @click="toggleSelectAll">
            {{ allSelected ? 'Снять всё' : 'Выбрать все' }}
          </button>
          <button class="cab-fav__cancel-btn" type="button" @click="exitSelectionMode">
            Отмена
          </button>
        </div>
      </template>
    </div>

    <ClientOnly>
      <AppModal :open="createModalOpen" @update:open="createModalOpen = $event">
        <h2 class="cab-fav__modal-title">Новый список</h2>
        <div class="app-modal__form">
          <AppInputText
            v-model="newListName"
            label="Название"
            placeholder="Название списка (до 64 символов)"
            @keyup.enter="createList"
          />
          <AppButton
            variant="primary"
            size="md"
            :loading="creatingList"
            :disabled="!newListName.trim()"
            class="cab-fav__modal-submit"
            @click="createList"
          >
            Создать
          </AppButton>
        </div>
      </AppModal>

      <AppModal :open="moveModalOpen" @update:open="moveModalOpen = $event">
        <h2 class="cab-fav__modal-title">Переместить в список</h2>
        <div class="cab-fav__move-list">
          <button
            v-for="list in otherLists"
            :key="list.id"
            :class="[
              'cab-fav__move-item',
              { 'cab-fav__move-item--selected': moveTargetId === list.id },
            ]"
            type="button"
            @click="moveTargetId = list.id"
          >
            <span class="cab-fav__move-checkbox">
              <span v-if="moveTargetId === list.id" class="cab-fav__move-check" />
            </span>
            <span class="cab-fav__move-info">
              <span class="cab-fav__move-name">{{ list.name }}</span>
              <span class="cab-fav__move-count">{{ list.items.length }} товаров</span>
            </span>
          </button>
          <p v-if="!otherLists.length" class="cab-fav__move-empty">
            Нет других списков. Создайте новый список через кнопку «Новый список».
          </p>
        </div>
        <div class="cab-fav__move-actions">
          <AppButton
            variant="outline"
            size="md"
            class="cab-fav__modal-submit"
            @click="moveModalOpen = false"
          >
            Отмена
          </AppButton>
          <AppButton
            variant="primary"
            size="md"
            :disabled="!moveTargetId"
            :loading="isMoving"
            class="cab-fav__modal-submit"
            @click="confirmMove"
          >
            Переместить
          </AppButton>
        </div>
      </AppModal>
    </ClientOnly>

    <div v-if="loading" class="cab-fav__grid">
      <Skeleton v-for="n in 6" :key="n" width="100%" height="260px" border-radius="12px" />
    </div>

    <div v-else-if="error" class="cab-fav__empty">
      <p>Не удалось загрузить избранное.</p>
      <AppButton variant="outline" size="sm" @click="load">Повторить</AppButton>
    </div>

    <div v-else-if="!wishlistsStore.wishlists.length" class="cab-fav__empty">
      <Heart :size="48" class="cab-fav__empty-icon" />
      <p class="cab-fav__empty-title">Список избранного пуст</p>
      <p class="cab-fav__empty-desc">Добавляйте товары в избранное, чтобы не потерять их</p>
      <AppButton variant="primary" size="md" @click="navigateTo('/catalog')">
        Перейти в каталог
      </AppButton>
    </div>

    <template v-else>
      <div class="cab-fav__tabs">
        <button
          v-for="list in wishlistsStore.wishlists"
          :key="list.id"
          :class="['cab-fav__tab', { 'cab-fav__tab--active': activeTabId === list.id }]"
          type="button"
          @click="selectTab(list.id)"
        >
          <span class="cab-fav__tab-name">{{ list.name }}</span>
          <span class="cab-fav__tab-count">({{ list.items.length }})</span>
          <span
            v-if="!list.isDefault"
            class="cab-fav__tab-delete"
            role="button"
            title="Удалить список"
            @click.stop="deleteList(list.id)"
          >
            <Trash2 :size="13" />
          </span>
        </button>
      </div>

      <div v-if="activeList && !activeList.items.length" class="cab-fav__list-empty">
        Список пуст
      </div>

      <div v-else-if="activeList" class="cab-fav__grid">
        <div
          v-for="item in activeList.items"
          :key="item.productId"
          :class="[
            'cab-fav__card-wrap',
            {
              'cab-fav__card-wrap--selectable': selectionMode,
              'cab-fav__card-wrap--selected': selectedIds.has(item.productId),
            },
          ]"
          @click="selectionMode ? toggleSelection(item.productId) : undefined"
        >
          <div v-if="selectionMode" class="cab-fav__select-overlay" />

          <div
            v-if="selectionMode"
            :class="[
              'cab-fav__card-check',
              { 'cab-fav__card-check--checked': selectedIds.has(item.productId) },
            ]"
            @click.stop="toggleSelection(item.productId)"
          >
            <Check v-if="selectedIds.has(item.productId)" :size="11" />
          </div>
          <div class="cab-fav__card">
            <button
              v-if="!selectionMode"
              class="cab-fav__card-menu-btn"
              type="button"
              @click.stop="toggleMenu(item.productId)"
            >
              <MoreHorizontal :size="15" />
            </button>

            <div
              v-if="!selectionMode && menuProductId === item.productId"
              class="cab-fav__card-dropdown"
              @click.stop
            >
              <button
                v-if="otherLists.length"
                class="cab-fav__card-dropdown-item"
                type="button"
                @click="openMoveModal(item.productId)"
              >
                Переместить в другой список
              </button>
              <button
                class="cab-fav__card-dropdown-item cab-fav__card-dropdown-item--danger"
                type="button"
                @click="removeAndCloseMenu(activeList.id, item.productId)"
              >
                Удалить из списка
              </button>
            </div>
            <NuxtLink :to="`/product/${item.productId}`" class="cab-fav__img-wrap">
              <img
                v-if="item.product?.thumbnail"
                :src="item.product.thumbnail"
                :alt="item.product.title"
                class="cab-fav__img"
              />
            </NuxtLink>
            <div class="cab-fav__body">
              <NuxtLink :to="`/product/${item.productId}`" class="cab-fav__name">
                {{ item.product?.title }}
              </NuxtLink>
              <div class="cab-fav__footer">
                <span class="cab-fav__price">${{ item.product?.price }}</span>
                <button
                  v-if="!selectionMode"
                  class="cab-fav__remove"
                  type="button"
                  title="Убрать из избранного"
                  @click="removeItem(activeList.id, item.productId)"
                >
                  <Heart :size="16" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition name="cab-fav-bar">
        <div v-if="selectionMode && selectedIds.size > 0" class="cab-fav__action-bar">
          <span class="cab-fav__action-info">
            {{ selectedIds.size }} {{ selectedIds.size === 1 ? 'товар' : 'товаров' }} выбрано
          </span>
          <AppButton
            variant="primary"
            size="md"
            :disabled="!otherLists.length"
            @click="openBulkMoveModal"
          >
            Переместить
          </AppButton>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;

.cab-fav {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-gray-100;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
  }

  &__selection-info {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
  }

  &__select-btn {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-primary;
    cursor: pointer;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.75;
    }
  }

  &__cancel-btn {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-500;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: $color-gray-800;
    }
  }

  &__add-list-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-primary;
    cursor: pointer;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.75;
    }
  }

  &__modal-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin-bottom: 24px;
  }

  &__modal-submit {
    width: 100%;
  }

  // ─── Tabs ───────────────────────────────────────────────────────────────────

  &__tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    border-bottom: 1px solid $color-gray-100;
    margin-bottom: -8px;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px 10px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-400;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition:
      color $transition-fast,
      border-color $transition-fast;

    &:hover {
      color: $color-gray-700;
    }

    &--active {
      color: $color-gray-900;
      font-weight: $font-weight-semibold;
      border-bottom-color: $color-primary;
    }
  }

  &__tab-name {
    white-space: nowrap;
  }

  &__tab-count {
    color: $color-primary;
    font-weight: $font-weight-normal;
  }

  &__tab-delete {
    display: inline-flex;
    align-items: center;
    margin-left: 2px;
    color: $color-gray-300;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: $color-danger;
    }
  }

  // ─── Content ────────────────────────────────────────────────────────────────

  &__list-empty {
    font-size: $font-size-sm;
    color: $color-gray-400;
    padding: 32px 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    @include mixins.respond-to(sm) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include mixins.respond-to(lg) {
      grid-template-columns: repeat(4, 1fr);
    }

    @include mixins.respond-to(2xl) {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  // ─── Card wrap ──────────────────────────────────────────────────────────────

  &__card-wrap {
    position: relative;

    &--selectable {
      cursor: pointer;
    }

    &--selected .cab-fav__card {
      box-shadow: 0 0 16px rgb(79 70 229 / 40%);
    }
  }

  &__select-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: $radius-xl;
  }

  &__card-check {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 22px;
    height: 22px;
    border-radius: 8px;
    border: 2px solid $color-gray-300;
    background: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    cursor: pointer;
    transition:
      border-color $transition-fast,
      background $transition-fast;

    &--checked {
      border-color: $color-primary;
      background: $color-primary;
      color: $color-white;
    }
  }

  &__card-menu-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: rgb(255 255 255 / 88%);
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    opacity: 0;
    transition:
      opacity $transition-fast,
      background $transition-fast;

    &:hover {
      background: $color-white;
      box-shadow: 0 1px 6px rgb(0 0 0 / 15%);
    }
  }

  &__card-wrap:hover &__card-menu-btn {
    opacity: 1;
  }

  &__card-dropdown {
    position: absolute;
    top: 7px;
    right: 8px;
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-md;
    box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
    min-width: 196px;
    z-index: 10;
    overflow: hidden;
  }

  &__card-dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 10px 16px;
    font-size: $font-size-sm;
    color: $color-gray-700;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
      background: $color-gray-50;
    }

    &--danger {
      color: $color-danger;
    }
  }

  // ─── Card ───────────────────────────────────────────────────────────────────

  &__card {
    height: 100%;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    overflow: hidden;
    transition:
      box-shadow $transition-fast,
      border-color $transition-fast;

    &:hover {
      box-shadow: 0 4px 16px rgb(0 0 0 / 8%);
    }
  }

  &__img-wrap {
    display: block;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: $color-gray-50;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-base;
  }

  &__card:hover &__img {
    transform: scale(1.04);
  }

  &__body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
      color: $color-primary;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    font-weight: $font-weight-bold;
    font-size: $font-size-sm;
  }

  &__remove {
    color: $color-danger;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 1;
    }
  }

  // ─── Move modal ─────────────────────────────────────────────────────────────

  &__move-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 24px;
    max-height: 280px;
    overflow-y: auto;
  }

  &__move-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: $radius-md;
    cursor: pointer;
    transition: background $transition-fast;
    text-align: left;

    &:hover {
      background: $color-gray-50;
    }

    &--selected {
      background: rgb(79 70 229 / 5%);
    }
  }

  &__move-checkbox {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border: 2px solid $color-gray-300;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      border-color $transition-fast,
      background $transition-fast;

    .cab-fav__move-item--selected & {
      border-color: $color-primary;
      background: $color-primary;
    }
  }

  &__move-check {
    width: 10px;
    height: 10px;
    background: $color-white;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &__move-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__move-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-900;

    .cab-fav__move-item--selected & {
      color: $color-primary;
    }
  }

  &__move-count {
    font-size: $font-size-xs;
    color: $color-gray-400;
  }

  &__move-empty {
    font-size: $font-size-sm;
    color: $color-gray-400;
    padding: 8px 0;
  }

  &__move-actions {
    display: flex;
    gap: 12px;
  }

  // ─── Bulk action bar ─────────────────────────────────────────────────────────

  &__action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-xl;
    box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
    position: sticky;
    bottom: 16px;
    z-index: 20;
  }

  &__action-info {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
  }

  // ─── Empty state ─────────────────────────────────────────────────────────────

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 0;
    text-align: center;
  }

  &__empty-icon {
    color: $color-gray-200;
  }

  &__empty-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-700;
  }

  &__empty-desc {
    font-size: $font-size-sm;
    color: $color-gray-400;
  }
}

.cab-fav-bar-enter-active,
.cab-fav-bar-leave-active {
  transition:
    opacity $transition-fast,
    transform $transition-fast;
}

.cab-fav-bar-enter-from,
.cab-fav-bar-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
