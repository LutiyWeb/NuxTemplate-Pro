<template>
  <div class="layout">
    <TheHeader />
    <main class="layout__main">
      <slot />
    </main>
    <TheFooter />
    <AppBackdrop />
    <TheToast />
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables' as *;
@use '~/assets/styles/mixins' as mixins;
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
  }
}
</style>
