<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this workout plan?</p>
      <div class="modal-buttons">
        <button @click="onConfirm">Yes, Delete</button>
        <button @click="onCancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "deletePlanModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onConfirm() {
      this.$emit("confirm");
    },
    onCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: rgb(3, 2, 2);
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-buttons {
  margin-top: 20px;
}

.modal-buttons button {
  background: #d9534f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.modal-buttons button:hover {
  background: #c9302c;
}

.modal-buttons button:last-child {
  background: #6c757d;
}

.modal-buttons button:last-child:hover {
  background: #5a6268;
}
</style>
