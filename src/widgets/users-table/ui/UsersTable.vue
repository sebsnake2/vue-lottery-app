<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import { useUsersStore } from "@/entities/user";
import {
  AppButton,
  AppColumn,
  AppConfirmDialog,
  AppTable,
} from "@/shared/ui";

const usersStore = useUsersStore();
const { users, isLoading } = storeToRefs(usersStore);

const confirm = useConfirm();
const toast = useToast();

const deletingId = ref<number | null>(null);
const deleteError = ref<string | null>(null);

function confirmDelete(id: number) {
  confirm.require({
    message: "Are you sure you want to delete this user?",
    header: "Delete user",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",
    acceptClass: "p-button-danger",

    accept: async () => {
      deletingId.value = id;
      deleteError.value = null;

      try {
        await usersStore.removeUser(id);

        toast.add({
          severity: "success",
          summary: "User deleted",
          detail: "The user was deleted successfully.",
          life: 3000,
        });
      } catch (e) {
        deleteError.value =
          e instanceof Error
            ? e.message
            : "Failed to delete user.";

        toast.add({
          severity: "error",
          summary: "Delete failed",
          detail:
            deleteError.value ??
            "Failed to delete user.",
          life: 4000,
        });
      } finally {
        deletingId.value = null;
      }
    },
  });
}
</script>

<template>
  <AppConfirmDialog />

  <div
    v-if="deleteError"
    class="alert alert-danger"
  >
    {{ deleteError }}
  </div>

  <AppTable
    :value="users"
    :loading="isLoading"
  >
    <AppColumn
      field="id"
      header="#"
    />

    <AppColumn header="User">
      <template #body="{ data }">
        <div class="d-flex align-items-center gap-2">
          <img
            :src="data.image"
            :alt="`${data.firstName} ${data.lastName}`"
            class="user-avatar"
          >

          <span>
            {{ data.firstName }}
            {{ data.lastName }}
          </span>
        </div>
      </template>
    </AppColumn>

    <AppColumn
      field="email"
      header="Email"
    />

    <AppColumn
      field="username"
      header="Username"
    />

    <AppColumn
      field="age"
      header="Age"
    />

    <AppColumn
      field="gender"
      header="Gender"
    />

    <AppColumn
      field="phone"
      header="Phone"
    />

    <AppColumn header="Actions">
      <template #body="{ data }">
        <div class="d-flex gap-2">
          <RouterLink
            :to="`/users/${data.id}`"
            class="p-button p-component p-button-outlined p-button-secondary p-button-sm text-decoration-none"
          >
            View
          </RouterLink>

          <AppButton
            label="Delete"
            severity="danger"
            :outlined="true"
            :loading="deletingId === data.id"
            :disabled="deletingId === data.id"
            @click="confirmDelete(data.id)"
          />
        </div>
      </template>
    </AppColumn>
  </AppTable>

  <div
    v-if="!isLoading && users.length === 0"
    class="text-secondary text-center py-4"
  >
    No users found.
  </div>
</template>

<style scoped lang="scss">
.user-avatar {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 50%;
}
</style>