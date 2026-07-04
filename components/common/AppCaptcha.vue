<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

const emit = defineEmits<{
  verify: [token: string]
  expired: []
}>()

const config = useRuntimeConfig()
const mounted = ref(false)
const captchaRef = ref<InstanceType<typeof VueHcaptcha> | null>(null)

onMounted(() => {
  mounted.value = true
})

function onVerify(token: string) {
  emit('verify', token)
}

function onExpired() {
  emit('expired')
}

function reset() {
  captchaRef.value?.reset()
}

defineExpose({ reset })
</script>

<template>
  <div v-if="mounted" class="app-captcha">
    <VueHcaptcha
      ref="captchaRef"
      :sitekey="config.public.hcaptchaSiteKey"
      @verify="onVerify"
      @expired="onExpired"
    />
  </div>
</template>
