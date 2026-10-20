<template>
  <main class="auth-layout">
    <div class="container py-5">
      <slot />
    </div>
  </main>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>