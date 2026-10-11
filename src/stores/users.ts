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

      users.value = data.users.map((user) => {
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

  return {
    users,
    usersById,
    total,
    isLoading,
    error,
    loadUsers,
    loadUser,
    createUser,
    updateUser,
  };
});