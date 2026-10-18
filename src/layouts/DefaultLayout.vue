<script setup lang="ts">
import AppHeader from "../widgets/app-header/ui/AppHeader.vue";
</script>

<template>
  <div>
    <AppHeader />

    <main class="container py-5">
      <slot />
    </main>
  </div>
</template>