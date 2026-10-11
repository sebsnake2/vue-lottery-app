<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";

const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  authStore.loadCurrentUser();
});

const layout = computed(
  () => route.meta.layout ?? DefaultLayout,
);
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>