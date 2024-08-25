<template>
  <div
    v-if="isVisible"
    class="confirmation-modal position-fixed bottom-0 start-50 translate-middle-x"
  >
    <div class="modal-body">
      <div class="toast-body">{{ message }}</div>
      <div class="modal-buttons">
        <button @click="confirm">Yes</button>
        <button @click="cancel">No</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "confirmationModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      default: "Are you sure?",
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
      this.close();
    },
    cancel() {
      this.$emit("cancel");
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.confirmation-modal {
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
}

.modal-body {
  background-color: orange;
  color: black;
  width: 450px;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 6vh;
  position: relative;
}

.modal-buttons {
  margin-top: 10px;
}

.modal-buttons button {
  margin: 0 10px;
  color: black;
  background: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 1rem;
}

.toast-body {
  font-size: 1.2rem;
}
</style>
