<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ServiceProvider } from "../services/service-provider";
import type { User } from "../types/user";

const props = defineProps<{
  id: string;
}>();

const user = ref<User | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function loadUser() {
  isLoading.value = true;
  error.value = null;

  try {
    user.value = await ServiceProvider.users.getById(
      Number(props.id),
    );
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Failed to load user.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadUser);
</script>

<template>
  <section>
    <div
      v-if="isLoading"
      class="alert alert-info"
    >
      Loading user...
    </div>

    <div
      v-else-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <template v-else-if="user">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          {{ user.firstName }} {{ user.lastName }}
        </h1>

        <div class="d-flex gap-2">
          <RouterLink
            to="/users"
            class="btn btn-outline-secondary"
          >
            Back
          </RouterLink>

          <RouterLink
            :to="`/users/${user.id}/edit`"
            class="btn btn-info text-white"
          >
            Edit
          </RouterLink>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="user-header mb-4">
            <img
              :src="user.image"
              :alt="`${user.firstName} ${user.lastName}`"
              class="user-image"
            >

            <div>
              <h2 class="h4">
                {{ user.firstName }} {{ user.lastName }}
              </h2>

              <div class="text-secondary">
                @{{ user.username }}
              </div>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <strong>Email:</strong>
              {{ user.email }}
            </div>

            <div class="col-md-6">
              <strong>Phone:</strong>
              {{ user.phone }}
            </div>

            <div class="col-md-6">
              <strong>Age:</strong>
              {{ user.age }}
            </div>

            <div class="col-md-6">
              <strong>Gender:</strong>
              {{ user.gender }}
            </div>
          </div>
        </div>
      </div>

      <RouterView />
    </template>
  </section>
</template>

<style scoped lang="scss">
.user-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.user-image {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 50%;
}
</style>