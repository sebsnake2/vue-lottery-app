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
    class="btn btn-primary"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
