import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

export const useWorkoutPlansCollectionStore = defineStore(
  "workoutPlansCollectionStore",
  {
    state: () => ({
      userWorkouts: [],
    }),
    getters: {
      getAllUserWorkouts: (state) => state.userWorkouts,
      getUserWorkoutPlanData: (state) => (id) => {
        return Array.isArray(state.userWorkouts)
          ? state.userWorkouts.find((plan) => plan._id.toString() === id)
          : null;
      },
    },
    actions: {
      async saveNewUserWorkoutPlan(formData) {
        const response = await axios.post(
          `${config.BACKEND_URL}/workout-plan`,
          formData,
          { withCredentials: true }
        );
        return response;
      },
      async fetchUserWorkouts() {
        const response = await axios.get(`${config.BACKEND_URL}/workout-plan`, {
          withCredentials: true,
        });
        this.userWorkouts = response.data.data.workoutPlans;
      },
      async deletePlan(planId) {
        try {
          const response = await axios.delete(
            `${config.BACKEND_URL}/workout-plan/${planId}`,
            {
              withCredentials: true,
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error deleting plan:", error);
          throw new Error("Failed to delete plan");
        }
      },
    },
  }
);
