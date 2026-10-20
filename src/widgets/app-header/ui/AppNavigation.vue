<script setup lang="ts">
import { useSessionStore } from "@/entities/session";
import { LogoutButton } from "@/features/auth";

const sessionStore = useSessionStore();
</script>

<template>
  <nav class="d-flex align-items-center gap-3">
    <RouterLink
      to="/"
      class="nav-link"
    >
      Home
    </RouterLink>

    <RouterLink
      to="/about"
      class="nav-link"
    >
      About
    </RouterLink>

    <RouterLink
      v-if="sessionStore.isAuthenticated"
      to="/users"
      class="nav-link"
    >
      Users
    </RouterLink>

    <RouterLink
      v-if="!sessionStore.isAuthenticated"
      to="/login"
      class="nav-link"
    >
      Login
    </RouterLink>

    <LogoutButton
      v-else
    />
  </nav>
</template>

<style scoped lang="scss">
.nav-link {
  color: #fff;
  text-decoration: none;

  &:hover {
    color: #fff;
    opacity: 0.8;
  }

  &.router-link-active {
    font-weight: 600;
  }
}
</style>