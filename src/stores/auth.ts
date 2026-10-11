import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ServiceProvider } from "../services/service-provider";
import type { AuthUser, LoginDto } from "../types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY),
  );

  const refreshToken = ref<string | null>(
    localStorage.getItem(REFRESH_TOKEN_KEY),
  );

  const user = ref<AuthUser | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(
    () => Boolean(accessToken.value),
  );

  function saveTokens(
    newAccessToken: string,
    newRefreshToken: string,
  ) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      newAccessToken,
    );

    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      newRefreshToken,
    );
  }

  function clearAuth() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  async function login(data: LoginDto) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await ServiceProvider.auth.login(data);

      saveTokens(
        response.accessToken,
        response.refreshToken,
      );

      user.value = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      };
    } catch (e) {
      clearAuth();

      error.value =
        e instanceof Error
          ? e.message
          : "Login failed.";

      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadCurrentUser() {
  if (!accessToken.value) {
    return;
  }

  try {
    user.value =
      await ServiceProvider.auth.getCurrentUser();

    accessToken.value =
      localStorage.getItem(ACCESS_TOKEN_KEY);

    refreshToken.value =
      localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    clearAuth();
  }
}

  function logout() {
    clearAuth();
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    loadCurrentUser,
    logout,
    saveTokens,
    clearAuth,
  };
});