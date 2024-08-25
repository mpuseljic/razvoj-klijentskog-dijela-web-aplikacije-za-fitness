<template>
  <div class="container" v-if="workoutPlanData">
    <div class="image-container">
      <img
        class="heading-img"
        :src="workoutPlanData.titleImagePath"
        alt="Workout Image"
      />
    </div>
    <h1 style="color: #d29433">{{ workoutPlanData.planName }}</h1>
    <div v-if="workoutPlanData.exercisesArray" class="exercise-container">
      <div
        v-for="exercise in workoutPlanData.exercisesArray"
        :key="exercise"
        class="exercise-card"
      >
        <img :src="exercise.img_url" alt="Exercise Image" />
        <h4>{{ exercise.title }}</h4>
      </div>
    </div>
    <div
      class="move-plan-container"
      type="button"
      @click="showDeleteModal = true"
    >
      <span>DELETE PLAN</span>
      <span class="material-symbols-outlined">delete</span>
    </div>
    <deletePlanModal
      :isVisible="showDeleteModal"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import deletePlanModal from "@/components/modals/deletePlanModal.vue";
import { useWorkoutPlansCollectionStore } from "@/stores/workoutPlansCollectionStore";

export default {
  name: "userWorkoutPlanModalBody",
  components: {
    deletePlanModal,
  },
  props: {
    workoutPlan: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      workoutPlanData: null,
      showDeleteModal: false,
    };
  },
  setup() {
    const workoutPlansCollectionStore = useWorkoutPlansCollectionStore();
    return { workoutPlansCollectionStore };
  },
  watch: {
    workoutPlan: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          this.workoutPlanData =
            await this.workoutPlansCollectionStore.getUserWorkoutPlanData(
              newVal
            );
        }
      },
    },
  },
  methods: {
    async closeModal() {
      this.workoutPlanData = null;
      this.$emit("close");
    },
    async handleDelete() {
      try {
        await this.workoutPlansCollectionStore.deletePlan(
          this.workoutPlanData._id
        );
        eventBus.emit("success", "Plan deleted successfully");
        this.$emit("close");
        eventBus.emit("refreshWorkoutPlans");
      } catch (error) {
        console.error("Error deleting workout plan:", error);
      } finally {
        this.showDeleteModal = false;
      }
    },
  },
};
</script>

<style scoped>
.container h1 {
  text-align: center;
  margin-bottom: 20px;
}
.exercise-container {
  align-items: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.exercise-card {
  margin-top: 2vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 350px;
}

.exercise-container img {
  max-width: 200px;
  height: auto;
  margin-right: 20px;
}

.exercise-container h2 {
  text-align: center;
  margin: 0;
}

.image-container {
  text-align: center;
}
.heading-img {
  width: 50%;
  max-height: 400px;
  object-fit: cover;
}

.move-plan-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background-color: #d9534f;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
}
.move-plan-container:hover {
  background-color: #c9302c;
}
</style>
