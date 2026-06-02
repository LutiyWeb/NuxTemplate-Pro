<script setup lang="ts">
const uiStore = useUiStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="app-backdrop">
      <div
        v-if="uiStore.overlayVisible"
        :class="[
          'app-backdrop',
          uiStore.overlayAboveHeader ? 'app-backdrop--high' : 'app-backdrop--low',
        ]"
        @click="uiStore.closeAll()"
      />
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.app-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 55%);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  // catalog menu lives inside the header stacking context (z-index: $z-dropdown = 10)
  // → backdrop must sit BELOW the header so the menu stays visible above it
  &--low {
    z-index: #{$z-dropdown - 1};
  }

  // search / auth / sidebar must cover the header too
  // → sit between header (10) and the modal (20 / 30)
  &--high {
    z-index: #{$z-modal-overlay - 1};
  }
}

.app-backdrop-enter-active,
.app-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.app-backdrop-enter-from,
.app-backdrop-leave-to {
  opacity: 0;
}
</style>
