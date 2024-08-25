// recommendedWorkoutsCollectionStore.js
import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

export const useRecommendedWorkoutsCollectionStore = defineStore(
  "recommendedWorkoutsCollectionStore",
  {
    state: () => ({}),
    getters: {},
    actions: {
      async fetchRecommendedWorkoutsByName(workoutPlan) {
        try {
          const response = await axios.get(
            `${config.BACKEND_URL}/recommendedWorkouts/${workoutPlan}`,
            { withCredentials: true }
          );

          return response.data.data.recommendedWorkouts;
        } catch (error) {
          console.error(
            "Error fetching recommended workouts:",
            error.response?.data || error.message
          );
          throw error;
        }
      },
    },
  }
);
