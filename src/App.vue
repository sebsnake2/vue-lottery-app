<script setup lang="ts">
import { computed, ref } from "vue";
import RegistrationForm from "./components/RegistrationForm.vue";
import ParticipantsTable from "./components/ParticipantsTable.vue";
import WinnersBlock from "./components/WinnersBlock.vue";
import type { Participant, ParticipantFormData } from "./types/participant";

const participants = ref<Participant[]>([]);
const winnerIds = ref<string[]>([]);

const existingEmails = computed(() =>
  participants.value.map((participant) => participant.email),
);

const winners = computed(() =>
  winnerIds.value
    .map((id) =>
      participants.value.find((participant) => participant.id === id),
    )
    .filter(
      (participant): participant is Participant => participant !== undefined,
    ),
);

const availableParticipants = computed(() =>
  participants.value.filter(
    (participant) => !winnerIds.value.includes(participant.id),
  ),
);

const canPickWinner = computed(
  () => winners.value.length < 3 && availableParticipants.value.length > 0,
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

  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id);
}

function pickWinner() {
  if (!canPickWinner.value) {
    return;
  }

  const randomIndex = Math.floor(
    Math.random() * availableParticipants.value.length,
  );

  const winner = availableParticipants.value[randomIndex];

  if (!winner) {
    return;
  }

  winnerIds.value.push(winner.id);
}

function removeWinner(id: string) {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id);
}
</script>

<template>
  <main class="container py-5">
    <div class="lottery-app">
      <WinnersBlock
        :winners="winners"
        :can-pick-winner="canPickWinner"
        @pick="pickWinner"
        @remove="removeWinner"
      />

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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
}
</style>
