<script setup lang="ts">
import { computed, ref } from "vue";
import RegistrationForm from "./components/RegistrationForm.vue";
import type { Participant, ParticipantFormData } from "./types/participant";
import ParticipantsTable from "./components/ParticipantsTable.vue";

const participants = ref<Participant[]>([]);

const existingEmails = computed(() =>
  participants.value.map((participant) => participant.email),
);

function addParticipant(data: ParticipantFormData) {
  participants.value.push({
    id: crypto.randomUUID(),
    ...data,
  });
}

function updateParticipant(id: string, data: ParticipantFormData) {
  const participant = participants.value.find((item) => item.id === id);

  if (!participant) {
    return;
  }

  Object.assign(participant, data);
}

function removeParticipant(id: string) {
  participants.value = participants.value.filter(
    (participant) => participant.id !== id,
  );
}
</script>

<template>
  <main class="container py-5">
    <div class="lottery-app">
      <h1 class="mb-4">
        Lottery App
      </h1>

      <RegistrationForm
        :existing-emails="existingEmails"
        @submit="addParticipant"
      />

      <ParticipantsTable
        :participants="participants"
        @update="updateParticipant"
        @remove="removeParticipant"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.lottery-app {
  max-width: 720px;
  margin: 0 auto;
}
</style>
