<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserForm from "../components/UserForm.vue";
import { useUsersStore } from "../stores/users";
import type { CreateUserDto } from "../types/user";

const router = useRouter();
const usersStore = useUsersStore();

const isSaving = ref(false);
const error = ref<string | null>(null);

async function createUser(data: CreateUserDto) {
  isSaving.value = true;
  error.value = null;

  try {
    await usersStore.createUser(data);

    await router.push({
      name: "users",
      query: {
        page: "1",
      },
    });
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Failed to create user.";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">
        Add user
      </h1>

      <RouterLink
        to="/users"
        class="btn btn-outline-secondary"
      >
        Back
      </RouterLink>
    </div>

    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-4">
        <UserForm
          submit-label="Create user"
          @submit="createUser"
        />

        <div
          v-if="isSaving"
          class="text-secondary mt-3"
        >
          Saving user...
        </div>
      </div>
    </div>
  </section>
</template>