<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

const emit = defineEmits<{
  "filter-by-name": [value: string];
}>();

const searchValue = ref("");
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchValue, (value) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    emit("filter-by-name", value.trim());
  }, 300);
});

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <div class="mb-3">
    <label
      for="participant-search"
      class="form-label fw-semibold"
    >
      Search by name
    </label>

    <input
      id="participant-search"
      v-model="searchValue"
      type="text"
      class="form-control"
      placeholder="Enter participant name"
    >
  </div>
</template>
