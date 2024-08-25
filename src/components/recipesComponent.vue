<template>
  <div>
    <div class="heading">
      <img class="heading-img" src="@/assets/logorsg.jpg" alt="Logo" />
    </div>
    <div class="main">
      <div class="gender">
        <h1 class="naslov">Get the finest recipes</h1>
      </div>
      <div class="fetch-button-container" type="button" @click="fetchRecipe">
        <span> Fetch a recipe </span>
        <span class="material-symbols-outlined"> ads_click </span>
      </div>

      <div v-if="recipe" class="recipe">
        <h1>{{ recipe.strMeal }}</h1>
        <img
          :src="recipe.strMealThumb"
          alt="Meal Thumbnail"
          class="recipe-thumb"
        />
        <div class="recipe-info-container">
          <h2>Ingredients</h2>
          <ul>
            <li v-for="(ingredient, index) in filteredIngredients" :key="index">
              <span>{{ ingredient.name }} - {{ ingredient.measure }}</span>
            </li>
          </ul>

          <h2>Instructions</h2>
          <p class="instructions">{{ recipe.strInstructions }}</p>

          <h2>Additional Information</h2>
          <ul>
            <li><strong>Area:</strong> {{ recipe.strArea }}</li>
            <li><strong>Category:</strong> {{ recipe.strCategory }}</li>
            <li>
              <strong>Source:</strong>
              <a :href="recipe.strSource" target="_blank"> Open in new tab </a>
            </li>
            <li v-if="recipe.strTags">
              <strong>Tags:</strong> {{ recipe.strTags }}
            </li>
          </ul>

          <h2>External Links</h2>
          <ul>
            <li v-if="recipe.strYoutube">
              <strong>YouTube:</strong>
              <a :href="recipe.strYoutube" target="_blank"> Open in new tab</a>
            </li>
          </ul>
        </div>
        <div class="save-button-container" type="button" @click="saveRecipe">
          <span> Save this recipe </span>
          <span class="material-symbols-outlined"> save </span>
        </div>
        <div v-if="savedMessage" class="save-message">
          Recipe saved successfully!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import { useRecipesAPIStore } from "@/stores/recipesAPIStore";

export default {
  name: "recipesComponent",
  data() {
    return {
      recipe: null,
      savedMessage: false,
    };
  },
  setup() {
    const recipesAPI = useRecipesAPIStore();
    return { recipesAPI };
  },
  computed: {
    filteredIngredients() {
      if (!this.recipe) return [];
      return Object.keys(this.recipe)
        .filter((key) => key.startsWith("strIngredient") && this.recipe[key])
        .map((key, index) => ({
          name: this.recipe[key],
          measure: this.recipe["strMeasure" + (index + 1)],
        }));
    },
  },
  methods: {
    async fetchRecipe() {
      const res = await this.recipesAPI.fetchRecipeData();
      this.recipe = res[0];
      this.savedMessage = false;
    },
    async saveRecipe() {
      const res = await this.recipesAPI.saveRecipe(this.recipe);

      eventBus.emit("success", "Recipe saved successfully!");
    },
    async loadSavedRecipe() {
      const res = await this.recipesAPI.fetchUsersRecipes();
      if (res.data.data.recipes.length > 0) {
        const savedRecipe = res.data.data.recipes[0].recipe;

        if (typeof savedRecipe === "string") {
          this.recipe = JSON.parse(savedRecipe);
        } else {
          this.recipe = savedRecipe;
        }
      }
    },
  },
  created() {
    this.loadSavedRecipe();
  },
};
</script>

<style scoped>
.heading-img {
  height: 7vh;
  width: auto;
}
.heading {
  margin: 0;
  padding: 1vw 5vw 0 2vw;
  height: 7vh;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recipe-thumb {
  height: 30vh;
  width: auto;
  object-fit: contain;
  overflow: hidden;
}
.recipe {
  margin-top: 3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10vh;
}
.fetch-button-container,
.save-button-container {
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  padding: 1vw;
  background-color: #1c1c1c;
  border: 1px solid white;
  border-radius: 10px;
  cursor: pointer;
  color: white;
}
.instructions {
  max-width: 50vw;
}
.recipe-info-container {
  margin-top: 1vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
.note {
  font-size: 0.7rem;
  font-style: italic;
  text-align: center;
  margin-top: 1vw;
}
.naslov {
  text-align: center;
}
.save-message {
  color: green;
  font-size: 1rem;
  margin-top: 1vw;
}

.recipe-info-container ul:last-of-type {
  margin-bottom: 2vw;
}
</style>
