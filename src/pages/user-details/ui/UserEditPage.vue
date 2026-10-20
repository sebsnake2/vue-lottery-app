<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import UserForm from "../../../components/UserForm.vue";
import { useUsersStore } from "../../../entities/user/model/users.store.ts";

import type {
  User,
  CreateUserDto,
} from "@/entities/user";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const usersStore = useUsersStore();

const isLoading = ref(false);
const isSaving = ref(false);
const error = ref<string | null>(null);

const user = computed<User | null>(() => {
  return usersStore.usersById[Number(props.id)] ?? null;
});

const initialValues = computed<Partial<CreateUserDto>>(() => {
  if (!user.value) {
    return {};
  }

  return {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
    username: user.value.username,
    password: user.value.password,
    age: user.value.age,
    gender: user.value.gender,
    phone: user.value.phone,
  };
});

async function loadUser() {
  isLoading.value = true;
  error.value = null;

  try {
    await usersStore.loadUser(Number(props.id));
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Failed to load user.";
  } finally {
    isLoading.value = false;
  }
}

async function updateUser(data: CreateUserDto) {
  isSaving.value = true;
  error.value = null;

  try {
    await usersStore.updateUser(
      Number(props.id),
      data,
    );

    await router.push({
      name: "user-details",
      params: {
        id: props.id,
      },
    });
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Failed to update user.";
  } finally {
    isSaving.value = false;
  }
}

onMounted(loadUser);
</script>

<template>
  <div class="card shadow-sm mt-4">
    <div class="card-body p-4">
      <h2 class="h4 mb-4">
        Edit user
      </h2>

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
        <UserForm
          :initial-values="initialValues"
          submit-label="Update user"
          @submit="updateUser"
        />

        <div
          v-if="isSaving"
          class="text-secondary mt-3"
        >
          Saving changes...
        </div>
      </template>
    </div>
  </div>
</template>