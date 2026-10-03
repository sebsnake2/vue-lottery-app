<script setup lang="ts">
defineProps<{
  id: string;
  name: string;
}>();

const emit = defineEmits<{
  remove: [id: string];
}>();
</script>

<template>
  <span class="winner-badge">
    {{ name }}

    <button
      type="button"
      class="winner-remove"
      aria-label="Remove winner"
      @click="emit('remove', id)"
    >
      ×
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  background: #35b5dc;
  border-radius: 0.2rem;
}

.winner-remove {
  padding: 0;
  color: inherit;
  font: inherit;
  line-height: 1;
  background: transparent;
  border: 0;
  cursor: pointer;
}
</style>
