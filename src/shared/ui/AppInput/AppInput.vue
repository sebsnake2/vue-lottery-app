<script setup lang="ts">
import InputText from "primevue/inputtext";

withDefaults(
  defineProps<{
    modelValue?: string | number;
    id?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
  }>(),
  {
    modelValue: "",
    id: undefined,
    type: "text",
    placeholder: "",
    disabled: false,
    error: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="app-input">
    <InputText
      :id="id"
      :model-value="String(modelValue ?? '')"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="Boolean(error)"
      class="w-100"
      @update:model-value="
        emit('update:modelValue', String($event ?? ''))
      "
    />

    <small
      v-if="error"
      class="app-input__error"
    >
      {{ error }}
    </small>
  </div>
</template>

<style scoped lang="scss">
.app-input {
  width: 100%;
}

.app-input__error {
  display: block;
  margin-top: 0.25rem;
  color: var(--p-red-500);
}
</style>