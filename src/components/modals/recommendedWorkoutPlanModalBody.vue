<template>
  <div class="container" v-if="workoutPlanData">
    <div class="image-container">
      <img
        class="heading-img"
        :src="workoutPlanData.image"
        alt="Workout Image"
      />
    </div>
    <h1 style="color: #d29433">{{ workoutPlanData.title }}</h1>
    <div v-if="workoutPlanData.exercises" class="exercise-container">
      <div
        v-for="(exercise, index) in workoutPlanData.exercises"
        :key="index"
        class="exercise-card"
      >
        <img :src="exercise.img_url" alt="Exercise Image" />
        <h4>{{ exercise.name }}</h4>
      </div>
    </div>
  </div>
</template>
<script>
import { useRecommendedWorkoutsCollectionStore } from "@/stores/recommendedWorkoutsCollectionStore";

export default {
  name: "recommendedWorkoutPlanModalBody",
  data() {
    return {
      workoutPlanData: null,
    };
  },
  props: {
    workoutPlan: {
      type: String,
      required: true,
    },
  },
  setup() {
    const recommendedWorkoutsCollectionStore =
      useRecommendedWorkoutsCollectionStore();
    return { recommendedWorkoutsCollectionStore };
  },
  async created() {
    if (this.workoutPlan) {
      this.workoutPlanData =
        await this.recommendedWorkoutsCollectionStore.fetchRecommendedWorkoutsByName(
          this.workoutPlan
        );
    }
  },
};
</script>
<style scoped>
.container h1 {
  text-align: center;
  margin-bottom: 50px;
  margin-top: 20px;
}

.image-container {
  text-align: center;
}

.heading-img {
  width: 70%;
  max-height: 400px;
  object-fit: cover;
}

.exercise-container {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exercise-card {
  display: flex;
  align-items: center;
  margin: 1vw 0;
  width: 100%;
  width: 350px;
  box-sizing: border-box;
}

.exercise-card img {
  width: 250px;
  height: auto;
  margin-right: 15px;
}

.exercise-card h4 {
  margin: 0;
  text-align: left;
}
</style>
