<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div class="card shadow-sm mt-4">
    <div class="card-body p-4">
      <h2 class="h4 mb-3">
        Edit user
      </h2>

      <p class="text-secondary mb-0">
        Editing user with ID: {{ id }}
      </p>
    </div>
  </div>
</template>