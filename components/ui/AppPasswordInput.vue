<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const showPassword = ref(false)
</script>

<template>
  <div class="app-input">
    <label v-if="label" class="app-input__label">{{ label }}</label>
    <div :class="['app-input__field', { 'app-input__field--error': error }]">
      <input
        :value="modelValue"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :disabled="disabled"
        class="app-input__input"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="app-input__toggle"
        tabindex="-1"
        @click="showPassword = !showPassword"
      >
        <EyeOff v-if="showPassword" :size="16" />
        <Eye v-else :size="16" />
      </button>
    </div>
    <span v-if="error" class="app-input__error">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.app-input {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
  }

  &__field {
    display: flex;
    align-items: center;
    border: 1px solid $color-gray-300;
    border-radius: $radius-md;
    background: $color-white;
    transition: border-color $transition-base;

    &:focus-within {
      border-color: $color-primary;
    }

    &--error {
      border-color: $color-danger;
    }
  }

  &__input {
    flex: 1;
    height: 44px;
    padding: 0 8px 0 12px;
    border: none;
    outline: none;
    background: transparent;
    font-size: $font-size-base;
    font-family: $font-family-base;
    color: $color-gray-900;

    &::placeholder {
      color: $color-gray-400;
    }

    &:disabled {
      color: $color-gray-400;
      cursor: not-allowed;
    }
  }

  &__toggle {
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: $color-gray-400;
    cursor: pointer;
    transition: color $transition-base;
    flex-shrink: 0;

    &:hover {
      color: $color-gray-600;
    }
  }

  &__error {
    font-size: $font-size-xs;
    color: $color-danger;
  }
}
</style>
