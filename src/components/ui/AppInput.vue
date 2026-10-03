<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
  }>(),
  {
    type: "text",
    placeholder: "",
    error: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <div class="mb-3">
    <label class="form-label">
      {{ label }}
    </label>

    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="form-control"
      :class="{ 'is-invalid': error }"
      @input="updateValue"
    >

    <div
      v-if="error"
      class="invalid-feedback"
    >
      {{ error }}
    </div>
  </div>
</template>
