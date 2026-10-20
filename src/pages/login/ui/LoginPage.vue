<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import { LoginForm } from "@/features/auth";

const router = useRouter();
const route = useRoute();

async function handleLoginSuccess() {
  const redirect =
    typeof route.query.redirect === "string"
      ? route.query.redirect
      : "/users";

  await router.push(redirect);
}
</script>

<template>
  <LoginForm @success="handleLoginSuccess" />
</template>