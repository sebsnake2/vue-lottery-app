<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ServiceProvider } from "../services/service-provider";
import type { User } from "../types/user";

const route = useRoute();
const router = useRouter();

const limit = 10;

const users = ref<User[]>([]);
const total = ref(0);
const isLoading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref(
  typeof route.query.q === "string" ? route.query.q : "",
);

const currentPage = computed(() => {
  const page = Number(route.query.page);

  return Number.isInteger(page) && page > 0 ? page : 1;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / limit)),
);

const skip = computed(
  () => (currentPage.value - 1) * limit,
);

async function loadUsers() {
  isLoading.value = true;
  error.value = null;

  try {
    const query = searchQuery.value.trim();

    const data = query
      ? await ServiceProvider.users.search(query, {
          limit,
          skip: skip.value,
        })
      : await ServiceProvider.users.getList({
          limit,
          skip: skip.value,
        });

    users.value = data.users;
    total.value = data.total;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Failed to load users.";
  } finally {
    isLoading.value = false;
  }
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

let searchTimer: ReturnType<typeof setTimeout> | null = null;

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
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">
        Users
      </h1>

      <button
        type="button"
        class="btn btn-info text-white fw-semibold"
      >
        Add user
      </button>
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

          <input
            id="user-search"
            v-model="searchQuery"
            type="search"
            class="form-control"
            placeholder="Search by name..."
          >
        </div>

        <div
          v-if="isLoading"
          class="alert alert-info mb-0"
        >
          Loading users...
        </div>

        <div
          v-else-if="error"
          class="alert alert-danger mb-0"
        >
          {{ error }}
        </div>

        <template v-else>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="user in users"
                  :key="user.id"
                >
                  <td>{{ user.id }}</td>

                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img
                        :src="user.image"
                        :alt="`${user.firstName} ${user.lastName}`"
                        class="user-avatar"
                      >

                      <span>
                        {{ user.firstName }}
                        {{ user.lastName }}
                      </span>
                    </div>
                  </td>

                  <td>{{ user.email }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.age }}</td>
                  <td>{{ user.gender }}</td>
                  <td>{{ user.phone }}</td>

                  <td>
                    <RouterLink
                      :to="`/users/${user.id}`"
                      class="btn btn-sm btn-outline-secondary"
                    >
                      View
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="users.length === 0"
            class="text-secondary text-center py-4"
          >
            No users found.
          </div>

          <div
            v-if="totalPages > 1"
            class="d-flex justify-content-between align-items-center mt-3"
          >
            <span class="text-secondary">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                Previous
              </button>

              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.user-avatar {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 50%;
}
</style>