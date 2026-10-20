<script setup lang="ts">
import { useRouter } from "vue-router";

import { useSessionStore } from "@/entities/session";
import { AppButton } from "@/shared/ui";

const router = useRouter();
const sessionStore = useSessionStore();

async function logout() {
  sessionStore.logout();

  await router.push("/login");
}
</script>

<template>
  <AppButton
    label="Logout"
    severity="secondary"
    :outlined="true"
    @click="logout"
  />
</template>