<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const query = ref('')
const router = useRouter()

function handleSearch() {
  if (!query.value.trim()) return
  router.push(`/search?q=${encodeURIComponent(query.value.trim())}`)
  query.value = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition name="search-overlay">
      <div v-if="open" class="search-overlay" @click.self="$emit('close')">
        <div class="search-overlay__inner">
          <form class="search-overlay__form" @submit.prevent="handleSearch">
            <input
              v-model="query"
              class="search-overlay__input"
              placeholder="Поиск товаров..."
              autofocus
            />
            <button class="search-overlay__btn" type="submit"><Search :size="20" /></button>
          </form>
          <button class="search-overlay__close" type="button" @click="$emit('close')">
            <X :size="16" /> Закрыть
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 70%);
  z-index: $z-modal-overlay;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;

  &__inner {
    width: 100%;
    max-width: 640px;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__form {
    display: flex;
    width: 100%;
    background: $color-white;
    border-radius: $radius-xl;
    overflow: hidden;
  }

  &__input {
    flex: 1;
    padding: 16px 20px;
    font-size: $font-size-lg;
    border: none;
    outline: none;
    font-family: $font-family-base;
  }

  &__btn {
    padding: 0 20px;
    background: $color-primary;
    color: $color-white;
    font-size: 20px;
    cursor: pointer;
  }

  &__close {
    color: $color-white;
    font-size: $font-size-sm;
    cursor: pointer;
    opacity: 0.8;

    &:hover { opacity: 1; }
  }
}

.search-overlay-enter-active,
.search-overlay-leave-active { transition: opacity $transition-base; }
.search-overlay-enter-from,
.search-overlay-leave-to { opacity: 0; }
</style>
