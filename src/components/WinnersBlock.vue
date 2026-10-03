<script setup lang="ts">
import WinnerItem from "./WinnerItem.vue";
import type { Participant } from "../types/participant";

defineProps<{
  winners: Participant[];
  canPickWinner: boolean;
}>();

const emit = defineEmits<{
  pick: [];
  remove: [id: string];
}>();
</script>

<template>
  <section class="winners-panel">
    <div class="winners-field">
      <WinnerItem
        v-for="winner in winners"
        :id="winner.id"
        :key="winner.id"
        :name="winner.name"
        @remove="emit('remove', $event)"
      />

      <span class="winners-placeholder"> Winners </span>
    </div>

    <button
      type="button"
      class="btn btn-info text-white fw-semibold px-4"
      :disabled="!canPickWinner"
      @click="emit('pick')"
    >
      New winner
    </button>
  </section>
</template>

<style scoped lang="scss">
.winners-panel {
  display: flex;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.winners-field {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.4rem;
  min-height: 38px;
  padding: 0.35rem 0.65rem;
  overflow: hidden;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.winners-placeholder {
  color: #999;
}

@media (max-width: 576px) {
  .winners-panel {
    flex-direction: column;
  }
}
</style>
