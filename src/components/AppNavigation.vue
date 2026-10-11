<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

async function logout() {
  authStore.logout();

  await router.push({
    name: "login",
  });
}
</script>

<template>
  <nav class="navigation">
    <RouterLink to="/">
      Home
    </RouterLink>

    <RouterLink to="/about">
      About
    </RouterLink>

    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/users"
    >
      Users
    </RouterLink>

    <RouterLink
      v-if="!authStore.isAuthenticated"
      to="/login"
    >
      Login
    </RouterLink>

    <button
      v-else
      type="button"
      class="logout-button"
      @click="logout"
    >
      Logout
    </button>
  </nav>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  gap: 1.25rem;

  a {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
  }

  a:hover,
  a.router-link-active {
    color: #fff;
  }

  a.router-link-active {
    font-weight: 600;
  }
}
.logout-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}
</style>