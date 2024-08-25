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
          <div v-if="recipe" class="recipe-detail">
            <h1>{{ recipe.recipe.strMeal }}</h1>
            <img
              :src="recipe?.recipe.strMealThumb"
              alt="Meal Thumbnail"
              class="recipe-thumb"
            />
            <div class="recipe-info-container">
              <h2>Ingredients</h2>
              <ul>
                <li
                  v-for="(ingredient, index) in filteredIngredients"
                  :key="index"
                >
                  <span>{{ ingredient.name }} - {{ ingredient.measure }}</span>
                </li>
              </ul>

              <h2>Instructions</h2>
              <p class="instructions">{{ recipe.recipe.strInstructions }}</p>

              <h2>Additional Information</h2>
              <ul>
                <li><strong>Area:</strong> {{ recipe.recipe.strArea }}</li>
                <li><strong>Category:</strong> {{ recipe.strCategory }}</li>
                <li>
                  <strong>Source:</strong>
                  <a :href="recipe.recipe.strSource" target="_blank">
                    Open in new tab
                  </a>
                </li>
                <li v-if="recipe.recipe.strTags">
                  <strong>Tags:</strong> {{ recipe.recipe.strTags }}
                </li>
              </ul>

              <h2>External Links</h2>
              <ul>
                <li v-if="recipe.recipe.strYoutube">
                  <strong>YouTube:</strong>
                  <a :href="recipe.recipe.strYoutube" target="_blank">
                    Open in new tab</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="move-recipe-container" type="button" @click="moveRecipe">
            <span>Move this recipe</span>
            <span class="material-symbols-outlined">delete</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import eventBus from "@/eventBus";
import { useRecipesAPIStore } from "@/stores/recipesAPIStore";

export default {
  name: "recipeDetailModal",
  data() {
    return {
      recipe: null,
      activeModal: false,
    };
  },
  setup() {
    const recipesAPI = useRecipesAPIStore();
    return { recipesAPI };
  },
  computed: {
    filteredIngredients() {
      if (!this.recipe || !this.recipe.recipe) {
        return [];
      }
      const recipeData = this.recipe.recipe;
      const ingredients = [];
      for (let i = 1; i <= 12; i++) {
        const ingredient = recipeData[`strIngredient${i}`];
        const measure = recipeData[`strMeasure${i}`] || "";
        if (ingredient) {
          ingredients.push({ name: ingredient, measure: measure });
        }
      }
      return ingredients;
    },
  },
  methods: {
    closeModal() {
      if (this.activeModal) {
        this.activeModal = false;
        this.recipe = null;
      }
    },
    async moveRecipe() {
      try {
        const response = await this.recipesAPI.deleteRecipe(this.recipe._id);
        if (response.message === "Recipe deleted successfully.") {
          eventBus.emit("recipeMoved", this.recipe._id);
          this.closeModal();
        } else {
          console.error("Failed to delete recipe:", response.message);
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    },
  },
  created() {
    eventBus.on("openRecipeModal", (data) => {
      this.recipe = data.recipe;
      this.activeModal = true;
    });
    eventBus.on("closeModal", () => {
      this.closeModal();
    });
  },
};
</script>

<style scoped>
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
  background-color: #1c1c1c;
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

.recipe-thumb {
  height: 30vh;
  width: auto;
  object-fit: contain;
}

.recipe-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-info-container {
  margin-top: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.instructions {
  max-width: 50vw;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;
}

a {
  color: #d29433;
  text-decoration: none;
}

.move-recipe-container {
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
.move-recipe-container:hover {
  background-color: #c9302c;
}
</style>
