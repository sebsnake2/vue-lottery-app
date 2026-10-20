<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useSessionStore } from "@/entities/session";

const route = useRoute();
const sessionStore = useSessionStore();

onMounted(() => {
  sessionStore.loadCurrentUser();
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