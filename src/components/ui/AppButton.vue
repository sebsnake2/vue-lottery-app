<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "button" | "submit";
    disabled?: boolean;
  }>(),
  {
    type: "button",
    disabled: false,
  },
);
</script>

<template>
  <button
    :type="type"
    class="btn btn-info text-white fw-semibold px-4"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
