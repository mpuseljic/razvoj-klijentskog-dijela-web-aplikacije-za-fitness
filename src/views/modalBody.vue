<template>
  <transition name="modal-animation">
    <div v-show="activeModal" class="modal-outer">
      <span
        class="material-symbols-outlined exit-button-modal"
        @click="closeModal"
      >
        close
      </span>
      <div class="modal-inner">
        <div class="modal-content">
          <!-- Modal content components -->
          <editProfileDataModalBody v-if="modalType === 'edit-profile-data'" />
          <editProfilePictureModalBody
            v-if="modalType === 'edit-profile-picture'"
          />
          <addNewWorkoutPlanModalBody
            v-if="modalType === 'add-new-workout-plan'"
          />
          <recommendedWorkoutPlanModalBody
            :workoutPlan="workoutPlan"
            v-if="modalType === 'recommended-workout-plan'"
          />
          <userWorkoutPlanModalBody
            :workoutPlan="workoutPlan"
            v-if="modalType === 'user-workout-plan'"
          />
          <recipeDetailModal v-if="modalType === 'recipe-detail-modal'" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import eventBus from "@/eventBus";
import editProfileDataModalBody from "@/components/modals/editProfileDataModalBody.vue";
import editProfilePictureModalBody from "@/components/modals/editProfilePictureModalBody.vue";
import addNewWorkoutPlanModalBody from "@/components/modals/addNewWorkoutPlanModalBody.vue";
import recommendedWorkoutPlanModalBody from "@/components/modals/recommendedWorkoutPlanModalBody.vue";
import userWorkoutPlanModalBody from "@/components/modals/userWorkoutPlanModalBody.vue";
import recipeDetailModal from "@/components/modals/recipeDetailModal.vue";

export default {
  name: "mainModal",
  data() {
    return {
      modalType: "",
      workoutPlan: "",
      activeModal: false,
    };
  },
  components: {
    editProfileDataModalBody,
    editProfilePictureModalBody,
    addNewWorkoutPlanModalBody,
    recommendedWorkoutPlanModalBody,
    userWorkoutPlanModalBody,
    recipeDetailModal,
  },
  created() {
    eventBus.on("openModal", (data) => {
      this.modalType = data.modalType;
      this.workoutPlan = data.workoutPlan || "";
      this.activeModal = true;
    });

    eventBus.on("closeModal", () => {
      console.log("CLOSE MODAL");
      this.closeModal();
    });
  },
  methods: {
    closeModal() {
      if (this.activeModal) {
        this.activeModal = false;
        this.modalType = "";
        this.workoutPlan = "";
        eventBus.emit("closeModal", { closeModal: true });
      }
    },
  },
};
</script>

<style>
.modal-outer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1c1c1c;
  z-index: 9999;
  opacity: 0.98;
}

.modal-inner {
  position: relative;
  width: 90%;
  padding: 20px;
  height: 90%;
  overflow: auto;
}

.modal-content {
  border: none;
  background-color: #fff0;
}

.exit-button-modal {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 27px;
  scale: 1.7;
  color: #fff;
  cursor: pointer;
}
</style>
