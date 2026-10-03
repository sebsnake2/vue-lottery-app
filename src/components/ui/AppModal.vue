<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

const props = defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.show) {
    emit("close");
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-backdrop-custom"
      @click.self="emit('close')"
    >
      <div class="modal-dialog-custom">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-5">
              {{ title }}
            </h2>

            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="emit('close')"
            />
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            class="modal-footer gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog-custom {
  width: 100%;
  max-width: 560px;
}

.modal-content {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.25);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 1rem 1.25rem;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
}
</style>
