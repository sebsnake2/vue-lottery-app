<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useSessionStore } from "@/entities/session";
import { useSettingsStore } from "@/entities/setting";

const route = useRoute();
const sessionStore = useSessionStore();
const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.applyTheme();
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