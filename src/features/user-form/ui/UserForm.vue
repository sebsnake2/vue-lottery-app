<script setup lang="ts">
import { watch } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import type { CreateUserDto } from "@/entities/user";
import {
  AppButton,
  AppInput,
} from "@/shared/ui";

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<CreateUserDto>;
    submitLabel?: string;
  }>(),
  {
    initialValues: () => ({}),
    submitLabel: "Save",
  },
);

const emit = defineEmits<{
  submit: [data: CreateUserDto];
}>();

const defaultValues: CreateUserDto = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  age: 18,
  gender: "male",
  phone: "",
};

const schema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("First name is required."),

  lastName: yup
    .string()
    .trim()
    .required("Last name is required."),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email.")
    .required("Email is required."),

  username: yup
    .string()
    .trim()
    .required("Username is required."),

  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters.")
    .required("Password is required."),

  age: yup
    .number()
    .typeError("Age is required.")
    .integer("Age must be an integer.")
    .min(1, "Age must be greater than 0.")
    .max(120, "Enter a valid age.")
    .required("Age is required."),

  gender: yup
    .string()
    .required("Gender is required."),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required."),
});

const {
  handleSubmit,
  resetForm,
} = useForm<CreateUserDto>({
  validationSchema: schema,
  initialValues: defaultValues,
});

const {
  value: firstName,
  errorMessage: firstNameError,
} = useField<string>("firstName");

const {
  value: lastName,
  errorMessage: lastNameError,
} = useField<string>("lastName");

const {
  value: email,
  errorMessage: emailError,
} = useField<string>("email");

const {
  value: username,
  errorMessage: usernameError,
} = useField<string>("username");

const {
  value: password,
  errorMessage: passwordError,
} = useField<string>("password");

const {
  value: age,
  errorMessage: ageError,
} = useField<number>("age");

const {
  value: gender,
  errorMessage: genderError,
} = useField<string>("gender");

const {
  value: phone,
  errorMessage: phoneError,
} = useField<string>("phone");

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values: {
        ...defaultValues,
        ...values,
      },
    });
  },
  {
    immediate: true,
    deep: true,
  },
);

const submitForm = handleSubmit((values) => {
  emit("submit", values);
});
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="row g-3">
      <div class="col-md-6">
        <label
          for="first-name"
          class="form-label"
        >
          First name
        </label>

        <AppInput
          id="first-name"
          v-model="firstName"
          :error="firstNameError"
        />
      </div>

      <div class="col-md-6">
        <label
          for="last-name"
          class="form-label"
        >
          Last name
        </label>

        <AppInput
          id="last-name"
          v-model="lastName"
          :error="lastNameError"
        />
      </div>

      <div class="col-md-6">
        <label
          for="email"
          class="form-label"
        >
          Email
        </label>

        <AppInput
          id="email"
          v-model="email"
          type="email"
          :error="emailError"
        />
      </div>

      <div class="col-md-6">
        <label
          for="username"
          class="form-label"
        >
          Username
        </label>

        <AppInput
          id="username"
          v-model="username"
          :error="usernameError"
        />
      </div>

      <div class="col-md-6">
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
          :error="passwordError"
        />
      </div>

      <div class="col-md-6">
        <label
          for="age"
          class="form-label"
        >
          Age
        </label>

        <AppInput
          id="age"
          :model-value="age"
          type="number"
          :error="ageError"
          @update:model-value="age = Number($event)"
        />
      </div>

      <div class="col-md-6">
        <label
          for="gender"
          class="form-label"
        >
          Gender
        </label>

        <select
          id="gender"
          v-model="gender"
          class="form-select"
          :class="{ 'is-invalid': genderError }"
        >
          <option value="male">
            Male
          </option>

          <option value="female">
            Female
          </option>
        </select>

        <div
          v-if="genderError"
          class="invalid-feedback"
        >
          {{ genderError }}
        </div>
      </div>

      <div class="col-md-6">
        <label
          for="phone"
          class="form-label"
        >
          Phone
        </label>

        <AppInput
          id="phone"
          v-model="phone"
          :error="phoneError"
        />
      </div>
    </div>

    <div class="d-flex justify-content-end mt-4">
      <AppButton
        type="submit"
        :label="submitLabel"
        severity="info"
      />
    </div>
  </form>
</template>