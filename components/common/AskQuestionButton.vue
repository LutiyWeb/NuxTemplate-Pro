<script setup lang="ts">
interface Props {
  productId: number
}

defineProps<Props>()
const emit = defineEmits<{ submitted: [{ text: string; name: string; email: string }] }>()

const authStore = useAuthStore()
const uiStore = useUiStore()
const open = ref(false)

function handleClick() {
  if (!authStore.isLoggedIn) {
    uiStore.authModalOpen = true
    return
  }
  open.value = true
}
</script>

<template>
  <AppButton variant="outline" size="md" @click="handleClick">Поставити запитання</AppButton>
  <AskQuestionModal
    v-model:open="open"
    :product-id="productId"
    @submitted="emit('submitted', $event)"
  />
</template>
