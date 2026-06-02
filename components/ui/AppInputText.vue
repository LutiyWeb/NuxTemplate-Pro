<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <div class="app-input">
    <label v-if="label" class="app-input__label">{{ label }}</label>
    <InputText
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['app-input__field', { 'p-invalid': error }]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="app-input__error">{{ error }}</span>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
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
    width: 100%;
  }

  &__error {
    font-size: $font-size-xs;
    color: $color-danger;
  }
}
</style>
