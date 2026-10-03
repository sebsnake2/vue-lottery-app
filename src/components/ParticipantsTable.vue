<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import AppButton from "./ui/AppButton.vue";
import AppInput from "./ui/AppInput.vue";
import AppModal from "./ui/AppModal.vue";
import SearchBar from "./SearchBar.vue";

import type { Participant, ParticipantFormData } from "../types/participant";

const props = defineProps<{
  participants: Participant[];
}>();

const emit = defineEmits<{
  update: [id: string, data: ParticipantFormData];
  remove: [id: string];
}>();

const editingParticipant = ref<Participant | null>(null);
const deletingParticipant = ref<Participant | null>(null);

type SortField = "name" | "dateOfBirth";
type SortDirection = "asc" | "desc";

const searchQuery = ref("");
const sortField = ref<SortField | null>(null);
const sortDirection = ref<SortDirection>("asc");

const editForm = reactive<ParticipantFormData>({
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

function openEditModal(participant: Participant) {
  editingParticipant.value = participant;

  editForm.name = participant.name;
  editForm.dateOfBirth = participant.dateOfBirth;
  editForm.email = participant.email;
  editForm.phone = participant.phone;

  clearErrors();
}

function closeEditModal() {
  editingParticipant.value = null;
  clearErrors();
}

function validateEditForm(): boolean {
  clearErrors();

  let isValid = true;

  if (!editForm.name.trim()) {
    errors.name = "Name is required.";
    isValid = false;
  }

  if (!editForm.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
    isValid = false;
  } else {
    const selectedDate = new Date(editForm.dateOfBirth);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.dateOfBirth = "Date of birth cannot be in the future.";
      isValid = false;
    }
  }

  const normalizedEmail = editForm.email.trim().toLowerCase();

  if (!normalizedEmail) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(normalizedEmail)) {
    errors.email = "Enter a valid email.";
    isValid = false;
  } else {
    const duplicate = props.participants.some(
      (participant) =>
        participant.id !== editingParticipant.value?.id &&
        participant.email.toLowerCase() === normalizedEmail,
    );

    if (duplicate) {
      errors.email = "Participant with this email already exists.";
      isValid = false;
    }
  }

  if (!editForm.phone.trim()) {
    errors.phone = "Phone number is required.";
    isValid = false;
  } else if (!phoneRegex.test(editForm.phone.trim())) {
    errors.phone = "Use format +380XXXXXXXXX.";
    isValid = false;
  }

  return isValid;
}

function saveEdit() {
  if (!editingParticipant.value || !validateEditForm()) {
    return;
  }

  emit("update", editingParticipant.value.id, {
    name: editForm.name.trim(),
    dateOfBirth: editForm.dateOfBirth,
    email: editForm.email.trim(),
    phone: editForm.phone.trim(),
  });

  closeEditModal();
}

function openDeleteModal(participant: Participant) {
  deletingParticipant.value = participant;
}

function closeDeleteModal() {
  deletingParticipant.value = null;
}

function confirmDelete() {
  if (!deletingParticipant.value) {
    return;
  }

  emit("remove", deletingParticipant.value.id);
  closeDeleteModal();
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function handleFilterByName(value: string) {
  searchQuery.value = value;
}

function setSort(field: SortField) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";

    return;
  }

  sortField.value = field;
  sortDirection.value = "asc";
}

const displayedParticipants = computed(() => {
  let result = [...props.participants];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();

    result = result.filter((participant) =>
      participant.name.toLowerCase().includes(query),
    );
  }

  if (sortField.value === "name") {
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);

      return sortDirection.value === "asc" ? comparison : -comparison;
    });
  }

  if (sortField.value === "dateOfBirth") {
    result.sort((a, b) => {
      const comparison =
        new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();

      return sortDirection.value === "asc" ? comparison : -comparison;
    });
  }

  return result;
});
</script>

<template>
  <section class="card shadow-sm mt-4">
    <div class="card-body">
      <h2 class="h5 mb-3">
        Participants
      </h2>

      <SearchBar @filter-by-name="handleFilterByName" />

      <div class="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="setSort('name')"
        >
          Name
          <span v-if="sortField === 'name'">
            {{ sortDirection === "asc" ? "↑" : "↓" }}
          </span>
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="setSort('dateOfBirth')"
        >
          Date of Birth
          <span v-if="sortField === 'dateOfBirth'">
            {{ sortDirection === "asc" ? "↑" : "↓" }}
          </span>
        </button>
      </div>

      <div
        v-if="participants.length === 0"
        class="text-secondary"
      >
        No participants yet.
      </div>

      <div
        v-else-if="displayedParticipants.length === 0"
        class="text-secondary"
      >
        No participants found.
      </div>

      <div
        v-else
        class="table-responsive"
      >
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(participant, index) in displayedParticipants"
              :key="participant.id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td>{{ formatDate(participant.dateOfBirth) }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td>
                <div class="d-flex gap-2">
                  <AppButton @click="openEditModal(participant)">
                    Edit
                  </AppButton>

                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="openDeleteModal(participant)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <AppModal
    :show="editingParticipant !== null"
    title="Edit participant"
    @close="closeEditModal"
  >
    <form @submit.prevent="saveEdit">
      <AppInput
        v-model="editForm.name"
        label="Name"
        :error="errors.name"
      />

      <AppInput
        v-model="editForm.dateOfBirth"
        label="Date of Birth"
        type="date"
        :error="errors.dateOfBirth"
      />

      <AppInput
        v-model="editForm.email"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <AppInput
        v-model="editForm.phone"
        label="Phone number"
        type="tel"
        placeholder="+380XXXXXXXXX"
        :error="errors.phone"
      />
    </form>

    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="closeEditModal"
      >
        Cancel
      </button>

      <AppButton @click="saveEdit">
        Update data
      </AppButton>
    </template>
  </AppModal>

  <AppModal
    :show="deletingParticipant !== null"
    title="Delete participant"
    @close="closeDeleteModal"
  >
    <p
      v-if="deletingParticipant"
      class="mb-0"
    >
      Are you sure you want to delete
      <strong>{{ deletingParticipant.name }}</strong>
      with email
      <strong>{{ deletingParticipant.email }}</strong>?
    </p>

    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="closeDeleteModal"
      >
        No
      </button>

      <button
        type="button"
        class="btn btn-danger"
        @click="confirmDelete"
      >
        Yes
      </button>
    </template>
  </AppModal>
</template>
