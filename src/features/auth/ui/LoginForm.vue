<script setup lang="ts">
import { computed } from "vue";
import { useField, useForm } from "vee-validate";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";

import { useSessionStore } from "@/entities/session";
import {
  AppButton,
  AppInput,
} from "@/shared/ui";

const emit = defineEmits<{
  success: [];
}>();

const sessionStore = useSessionStore();
const toast = useToast();

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required."),

  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters.")
    .required("Password is required."),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const {
  value: username,
  errorMessage: usernameError,
} = useField<string>("username");

const {
  value: password,
  errorMessage: passwordError,
} = useField<string>("password");

const loginError = computed(
  () => sessionStore.error,
);

const submitLogin = handleSubmit(async (values) => {
  try {
    await sessionStore.login({
      username: values.username,
      password: values.password,
    });

    emit("success");
  } catch {
    toast.add({
      severity: "error",
      summary: "Login failed",
      detail: "Invalid username or password.",
      life: 4000,
    });
  }
});
</script>

<template>
  <section class="login-card card shadow-sm">
    <div class="card-body p-4">
      <h1 class="h3 mb-4">
        Login
      </h1>

      <div
        v-if="loginError"
        class="alert alert-danger"
      >
        Invalid username or password.
      </div>

      <form @submit.prevent="submitLogin">
        <div class="mb-3">
          <label
            for="username"
            class="form-label"
          >
            Username
          </label>

          <AppInput
            id="username"
            v-model="username"
            placeholder="Enter username"
            :error="usernameError"
          />
        </div>

        <div class="mb-4">
          <label
            for="password"
            class="form-label"
          >
            Password
          </label>

          <AppInput
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            :error="passwordError"
          />
        </div>

        <AppButton
          type="submit"
          class="w-100"
          :label="
            sessionStore.isLoading
              ? 'Logging in...'
              : 'Login'
          "
          severity="info"
          :loading="sessionStore.isLoading"
          :disabled="sessionStore.isLoading"
        />
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-card {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
</style>