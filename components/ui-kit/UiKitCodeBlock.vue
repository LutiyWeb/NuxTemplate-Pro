<script setup lang="ts">
defineProps<{ code: string; language?: string }>()

const copied = ref(false)

async function copy(code: string) {
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div class="uk-code">
    <div class="uk-code__bar">
      <span class="uk-code__lang">{{ language ?? 'vue' }}</span>
      <button class="uk-code__copy" type="button" @click="copy(code)">
        {{ copied ? '✓ Скопировано' : 'Копировать' }}
      </button>
    </div>
    <pre class="uk-code__pre"><code>{{ code }}</code></pre>
  </div>
</template>

<style lang="scss">
.uk-code {
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1px solid $color-gray-200;
  font-size: 13px;

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: #1e1e2e;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  &__lang {
    font-size: 11px;
    font-family: monospace;
    color: rgb(255 255 255 / 40%);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__copy {
    font-size: 11px;
    font-family: $font-family-base;
    color: rgb(255 255 255 / 55%);
    background: rgb(255 255 255 / 8%);
    border: none;
    border-radius: $radius-sm;
    padding: 3px 10px;
    cursor: pointer;
    transition:
      background $transition-fast,
      color $transition-fast;

    &:hover {
      background: rgb(255 255 255 / 16%);
      color: $color-white;
    }
  }

  &__pre {
    margin: 0;
    padding: 16px;
    background: #1e1e2e;
    color: #cdd6f4;
    overflow-x: auto;
    line-height: 1.6;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    white-space: pre;
  }
}
</style>
