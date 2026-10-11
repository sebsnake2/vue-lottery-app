<script setup lang="ts">
import { computed } from "vue";
import { useField, useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

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
  () => authStore.error,
);

const submitLogin = handleSubmit(async (values) => {
  try {
    await authStore.login({
      username: values.username,
      password: values.password,
    });

    const redirect =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/users";

    await router.push(redirect);
  } catch {
    // Error is already stored in authStore.
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

      <form @submit="submitLogin">
        <div class="mb-3">
          <label
            for="username"
            class="form-label"
          >
            Username
          </label>

          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': usernameError }"
          >

          <div class="invalid-feedback">
            {{ usernameError }}
          </div>
        </div>

        <div class="mb-4">
          <label
            for="password"
            class="form-label"
          >
            Password
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': passwordError }"
          >

          <div class="invalid-feedback">
            {{ passwordError }}
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-info text-white w-100"
          :disabled="authStore.isLoading"
        >
          {{
            authStore.isLoading
              ? "Logging in..."
              : "Login"
          }}
        </button>
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