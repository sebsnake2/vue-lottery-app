<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useUsersStore } from "@/entities/user";
import { AppButton, AppInput } from "@/shared/ui";
import { UsersTable } from "@/widgets/users-table";

const route = useRoute();
const router = useRouter();

const usersStore = useUsersStore();

const {
  total,
  isLoading,
  error,
} = storeToRefs(usersStore);

const limit = 10;

const searchQuery = ref(
  typeof route.query.q === "string"
    ? route.query.q
    : "",
);

const currentPage = computed(() => {
  const page = Number(route.query.page);

  return Number.isInteger(page) && page > 0
    ? page
    : 1;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / limit)),
);

async function loadUsers() {
  await usersStore.fetchUsers(
    currentPage.value,
    searchQuery.value.trim(),
    limit,
  );
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return;
  }

  router.push({
    query: {
      ...route.query,
      page: String(page),
      q: searchQuery.value.trim() || undefined,
    },
  });
}

function openCreateUser() {
  router.push("/users/new");
}

let searchTimer: ReturnType<typeof setTimeout> | null =
  null;

watch(searchQuery, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(() => {
    router.push({
      query: {
        page: "1",
        q: value.trim() || undefined,
      },
    });
  }, 300);
});

watch(
  () => route.query,
  () => {
    const query =
      typeof route.query.q === "string"
        ? route.query.q
        : "";

    if (query !== searchQuery.value) {
      searchQuery.value = query;
    }

    loadUsers();
  },
);

onMounted(loadUsers);
</script>

<template>
  <section>
    <div
      class="d-flex justify-content-between align-items-center mb-4"
    >
      <h1 class="mb-0">
        Users
      </h1>

      <AppButton
        label="Add user"
        severity="info"
        @click="openCreateUser"
      />
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-4">
        <div class="mb-4">
          <label
            for="user-search"
            class="form-label fw-semibold"
          >
            Search users
          </label>

          <AppInput
            id="user-search"
            v-model="searchQuery"
            type="search"
            placeholder="Search by name..."
          />
        </div>

        <div
          v-if="error"
          class="alert alert-danger"
        >
          {{ error }}
        </div>

        <UsersTable />

        <div
          v-if="totalPages > 1"
          class="d-flex justify-content-between align-items-center mt-3"
        >
          <span class="text-secondary">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <div class="d-flex gap-2">
            <AppButton
              label="Previous"
              severity="secondary"
              :outlined="true"
              :disabled="
                currentPage === 1 || isLoading
              "
              @click="changePage(currentPage - 1)"
            />

            <AppButton
              label="Next"
              severity="secondary"
              :outlined="true"
              :disabled="
                currentPage === totalPages ||
                  isLoading
              "
              @click="changePage(currentPage + 1)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>