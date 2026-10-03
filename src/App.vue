<script setup lang="ts">
import { computed, ref } from "vue";
import RegistrationForm from "./components/RegistrationForm.vue";
import type { Participant, ParticipantFormData } from "./types/participant";

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

      <div class="mt-4">
        <strong>Participants: {{ participants.length }}</strong>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.lottery-app {
  max-width: 720px;
  margin: 0 auto;
}
</style>
