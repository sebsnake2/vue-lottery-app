<script setup lang="ts">
import Button from "primevue/button";

withDefaults(
  defineProps<{
    label?: string;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    disabled?: boolean;
    severity?:
      | "secondary"
      | "success"
      | "info"
      | "warn"
      | "help"
      | "danger"
      | "contrast";
    outlined?: boolean;
  }>(),
  {
    label: "",
    type: "button",
    loading: false,
    disabled: false,
    severity: undefined,
    outlined: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <Button
    :label="label"
    :type="type"
    :loading="loading"
    :disabled="disabled"
    :severity="severity"
    :outlined="outlined"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>