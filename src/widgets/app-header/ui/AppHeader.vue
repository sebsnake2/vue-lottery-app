<script setup lang="ts">
import AppLogo from "./AppLogo.vue";
import AppNavigation from "./AppNavigation.vue";
</script>

<template>
  <header class="app-header">
    <div class="container header-content">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #212529;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
}
</style>