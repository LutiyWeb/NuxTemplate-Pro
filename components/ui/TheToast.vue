<script setup lang="ts">
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()

const ICONS = { success: CheckCircle, error: XCircle, info: Info }
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`]"
        >
          <component :is="ICONS[toast.type]" :size="18" class="toast__icon" />
          <span class="toast__msg">{{ toast.message }}</span>
          <button class="toast__close" type="button" @click="toastStore.remove(toast.id)">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss">
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: $radius-lg;
  background: $color-white;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  border: 1px solid $color-gray-100;
  pointer-events: all;
  min-width: 280px;
  max-width: 360px;

  &--success &__icon { color: $color-success; }
  &--error   &__icon { color: $color-danger; }
  &--info    &__icon { color: $color-primary; }

  &__msg { flex: 1; font-size: $font-size-sm; color: $color-gray-800; }

  &__close {
    color: $color-gray-400;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    &:hover { color: $color-gray-700; }
  }
}

.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(40px); }
.toast-leave-to     { opacity: 0; transform: translateX(40px); }
</style>
