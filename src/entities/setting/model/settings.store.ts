import { defineStore } from "pinia";
import { ref } from "vue";

export type AppTheme = "light" | "dark";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const theme = ref<AppTheme>("light");

    function applyTheme() {
      document.documentElement.classList.toggle(
        "app-dark",
        theme.value === "dark",
      );
    }

    function toggleTheme() {
      theme.value =
        theme.value === "light"
          ? "dark"
          : "light";

      applyTheme();
    }

    return {
      theme,
      applyTheme,
      toggleTheme,
    };
  },
  {
    persist: true,
  },
);