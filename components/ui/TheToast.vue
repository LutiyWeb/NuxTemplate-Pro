<script setup lang="ts">
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-vue-next'

const toastStore = useToastStore()

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
}
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
  padding: 14px 16px;
  border-radius: $radius-lg;
  background: $color-white;
  box-shadow: 0 4px 20px rgb(0 0 0 / 12%);
  border: 1px solid $color-gray-100;
  border-left: 4px solid transparent;
  pointer-events: all;
  min-width: 300px;
  max-width: 380px;

  &--success {
    border-left-color: $color-success;
    .toast__icon {
      color: $color-success;
    }
  }

  &--error {
    border-left-color: $color-danger;
    .toast__icon {
      color: $color-danger;
    }
  }

  &--warning {
    border-left-color: $color-warning;
    .toast__icon {
      color: $color-warning;
    }
  }

  &__msg {
    flex: 1;
    font-size: $font-size-sm;
    color: $color-gray-800;
    line-height: $line-height-relaxed;
  }

  &__close {
    color: $color-gray-400;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    transition: color $transition-fast;
    &:hover {
      color: $color-gray-700;
    }
  }
}

.toast-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(48px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(48px);
}
</style>
