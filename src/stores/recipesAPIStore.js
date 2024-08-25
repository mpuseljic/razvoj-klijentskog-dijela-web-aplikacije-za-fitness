import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

const BACKEND_URL = config.BACKEND_URL;

export const useRecipesAPIStore = defineStore("recipesAPIStore", {
  state: () => ({}),
  getters: {},
  actions: {
    async fetchRecipeData() {
      const res = await fetch(config.RECIPES_API_URL).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      });
      return res.meals;
    },
    async saveRecipe(recipe) {
      const res = await axios.post(
        `${BACKEND_URL}/recipe`,
        { recipe },
        { withCredentials: true }
      );
      return res;
    },
    async fetchUsersRecipes() {
      const res = await axios.get(`${BACKEND_URL}/recipe`, {
        withCredentials: true,
      });
      return res;
    },
    async deleteRecipe(recipeId) {
      try {
        const response = await axios.delete(
          `${BACKEND_URL}/recipe/${recipeId}`,
          {
            withCredentials: true,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error deleting recipe:", error);
        throw new Error("Failed to delete recipe");
      }
    },
  },
});
