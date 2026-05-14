<template>
  <div class="layout">
    <TheHeader />
    <main class="layout__main">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
  }
}
</style>
