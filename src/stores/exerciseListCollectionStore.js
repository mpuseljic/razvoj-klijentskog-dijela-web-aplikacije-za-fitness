import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

export const useExerciseLiseCollectionStore = defineStore(
  "exerciseListCollectionStore",
  {
    state: () => ({}),
    getters: {},
    actions: {
      async getExercises() {
        const response = await axios.get(`${config.BACKEND_URL}/exercises`, {
          withCredentials: true,
        });
        return response;
      },
    },
  }
);
