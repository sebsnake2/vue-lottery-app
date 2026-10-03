<script setup lang="ts">
import { reactive } from "vue";
import AppButton from "./ui/AppButton.vue";
import AppInput from "./ui/AppInput.vue";
import type { ParticipantFormData } from "../types/participant";

const props = defineProps<{
  existingEmails: string[];
}>();

const emit = defineEmits<{
  submit: [participant: ParticipantFormData];
}>();

const form = reactive<ParticipantFormData>({
  name: "",
  dateOfBirth: "",
  email: "",
  phone: "",
});

const errors = reactive({
  name: "",
  dateOfBirth: "",
  email: "",
  phone: "",
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

function clearErrors() {
  errors.name = "";
  errors.dateOfBirth = "";
  errors.email = "";
  errors.phone = "";
}

function validateForm(): boolean {
  clearErrors();

  let isValid = true;

  if (!form.name.trim()) {
    errors.name = "Name is required.";
    isValid = false;
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
    isValid = false;
  } else {
    const selectedDate = new Date(form.dateOfBirth);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.dateOfBirth = "Date of birth cannot be in the future.";
      isValid = false;
    }
  }

  const normalizedEmail = form.email.trim().toLowerCase();

  if (!normalizedEmail) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(normalizedEmail)) {
    errors.email = "Enter a valid email.";
    isValid = false;
  } else if (
    props.existingEmails.some(
      (email) => email.toLowerCase() === normalizedEmail,
    )
  ) {
    errors.email = "Participant with this email already exists.";
    isValid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
    isValid = false;
  } else if (!phoneRegex.test(form.phone.trim())) {
    errors.phone = "Use format +380XXXXXXXXX.";
    isValid = false;
  }

  return isValid;
}

function resetForm() {
  form.name = "";
  form.dateOfBirth = "";
  form.email = "";
  form.phone = "";
  clearErrors();
}

function submitForm() {
  if (!validateForm()) {
    return;
  }

  emit("submit", {
    name: form.name.trim(),
    dateOfBirth: form.dateOfBirth,
    email: form.email.trim(),
    phone: form.phone.trim(),
  });

  resetForm();
}
</script>

<template>
  <section class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-1">
        Register form
      </h2>

      <p class="text-secondary mb-4">
        Please fill in all the fields.
      </p>

      <form @submit.prevent="submitForm">
        <AppInput
          v-model="form.name"
          label="Name"
          placeholder="Enter your name"
          :error="errors.name"
        />

        <AppInput
          v-model="form.dateOfBirth"
          label="Date of Birth"
          type="date"
          :error="errors.dateOfBirth"
        />

        <AppInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="Enter email"
          :error="errors.email"
        />

        <AppInput
          v-model="form.phone"
          label="Phone number"
          type="tel"
          placeholder="+380XXXXXXXXX"
          :error="errors.phone"
        />

        <div class="d-flex justify-content-end">
          <AppButton type="submit">
            Save
          </AppButton>
        </div>
      </form>
    </div>
  </section>
</template>
