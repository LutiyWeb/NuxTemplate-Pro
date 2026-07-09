<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="open" class="app-modal-overlay" @click.self="emit('update:open', false)">
        <div class="app-modal">
          <button class="app-modal__close" type="button" @click="emit('update:open', false)">
            <X :size="14" />
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.app-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: $z-modal-overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.app-modal {
  position: relative;
  background: $color-white;
  border-radius: $radius-xl;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  z-index: $z-modal;

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-gray-400;
    transition: color $transition-fast;

    &:hover {
      color: $color-gray-700;
    }
  }

  // ─── Shared inner styles ────────────────────────────────────────────────────

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__error {
    font-size: $font-size-sm;
    color: $color-danger;
    margin: 0;
  }

  &__secondary-btn {
    align-self: center;
    font-size: $font-size-sm;
    color: $color-gray-400;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: $color-primary;
    }
  }
}

.app-modal-enter-active,
.app-modal-leave-active {
  transition: opacity $transition-fast;

  .app-modal {
    transition: transform $transition-fast;
  }
}

.app-modal-enter-from,
.app-modal-leave-to {
  opacity: 0;

  .app-modal {
    transform: translateY(-12px);
  }
}
</style>
