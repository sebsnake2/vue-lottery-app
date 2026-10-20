<script setup lang="ts">
import { watch } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import type { CreateUserDto } from "@/entities/user";

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
  <form @submit="submitForm">
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">
          First name
        </label>

        <input
          v-model="firstName"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': firstNameError }"
        >

        <div class="invalid-feedback">
          {{ firstNameError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Last name
        </label>

        <input
          v-model="lastName"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': lastNameError }"
        >

        <div class="invalid-feedback">
          {{ lastNameError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Email
        </label>

        <input
          v-model="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': emailError }"
        >

        <div class="invalid-feedback">
          {{ emailError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Username
        </label>

        <input
          v-model="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': usernameError }"
        >

        <div class="invalid-feedback">
          {{ usernameError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Password
        </label>

        <input
          v-model="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': passwordError }"
        >

        <div class="invalid-feedback">
          {{ passwordError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Age
        </label>

        <input
          v-model.number="age"
          type="number"
          min="1"
          max="120"
          class="form-control"
          :class="{ 'is-invalid': ageError }"
        >

        <div class="invalid-feedback">
          {{ ageError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Gender
        </label>

        <select
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

        <div class="invalid-feedback">
          {{ genderError }}
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">
          Phone
        </label>

        <input
          v-model="phone"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': phoneError }"
        >

        <div class="invalid-feedback">
          {{ phoneError }}
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-4">
      <button
        type="submit"
        class="btn btn-info text-white fw-semibold px-4"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>