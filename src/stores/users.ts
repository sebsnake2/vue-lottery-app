import { defineStore } from "pinia";
import { ref } from "vue";
import { ServiceProvider } from "../services/service-provider";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from "../types/user";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const usersById = ref<Record<number, User>>({});
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadedKey = ref("");
  const deletedIds = ref<number[]>([]);

  async function loadUsers(
    page: number,
    query: string,
    limit = 10,
  ) {
    const key = `${page}:${query}`;

    if (loadedKey.value === key && users.value.length > 0) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const skip = (page - 1) * limit;

      const data = query
        ? await ServiceProvider.users.search(query, {
            limit,
            skip,
          })
        : await ServiceProvider.users.getList({
            limit,
            skip,
          });

      users.value = data.users
    .filter((user) => !deletedIds.value.includes(user.id))
    .map((user) => {
        return usersById.value[user.id] ?? user;
    });

      total.value = data.total;

      users.value.forEach((user) => {
        usersById.value[user.id] = user;
      });

      loadedKey.value = key;
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : "Failed to load users.";
    } finally {
      isLoading.value = false;
    }
  }

  async function loadUser(id: number): Promise<User> {
    const cached = usersById.value[id];

    if (cached) {
      return cached;
    }

    const user = await ServiceProvider.users.getById(id);

    usersById.value[id] = user;

    return user;
  }

  async function createUser(
    data: CreateUserDto,
  ): Promise<User> {
    const created = await ServiceProvider.users.create(data);

    usersById.value[created.id] = created;
    users.value = [created, ...users.value];

    total.value += 1;

    return created;
  }

  async function updateUser(
    id: number,
    data: UpdateUserDto,
  ): Promise<User> {
    const updated = await ServiceProvider.users.update(id, data);

    const current =
      usersById.value[id] ??
      users.value.find((user) => user.id === id);

    const merged = {
      ...current,
      ...updated,
    } as User;

    usersById.value[id] = merged;

    const index = users.value.findIndex(
      (user) => user.id === id,
    );

    if (index !== -1) {
      users.value[index] = merged;
    }

    return merged;
  }

  async function deleteUser(id: number): Promise<void> {
  await ServiceProvider.users.delete(id);

  if (!deletedIds.value.includes(id)) {
    deletedIds.value.push(id);
  }

  users.value = users.value.filter(
    (user) => user.id !== id,
  );

  delete usersById.value[id];

  if (total.value > 0) {
    total.value -= 1;
  }
}

  return {
    users,
    usersById,
    deletedIds,
    total,
    isLoading,
    error,
    loadUsers,
    loadUser,
    createUser,
    updateUser,
    deleteUser,
  };
});