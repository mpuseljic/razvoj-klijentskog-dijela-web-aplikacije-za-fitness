import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import recipesComponent from "@/components/recipesComponent.vue";
import { useRecipesAPIStore } from "@/stores/recipesAPIStore";
import eventBus from "@/eventBus";

// Mock the necessary modules
jest.mock("@/stores/recipesAPIStore", () => ({
  useRecipesAPIStore: jest.fn(() => ({
    fetchRecipeData: jest.fn(),
    saveRecipe: jest.fn(),
    fetchUsersRecipes: jest.fn(),
  })),
}));

jest.mock("@/eventBus", () => ({
  emit: jest.fn(),
}));

describe("recipesComponent.vue", () => {
  let wrapper;
  let mockFetchRecipeData;
  let mockSaveRecipe;
  let mockFetchUsersRecipes;
  let mockEmit;

  beforeEach(() => {
    // Initialize Pinia
    setActivePinia(createPinia());

    mockFetchRecipeData = jest.fn();
    mockSaveRecipe = jest.fn();
    mockFetchUsersRecipes = jest.fn();
    mockEmit = jest.fn();

    // Mock the recipesAPIStore
    useRecipesAPIStore.mockReturnValue({
      fetchRecipeData: mockFetchRecipeData,
      saveRecipe: mockSaveRecipe,
      fetchUsersRecipes: mockFetchUsersRecipes,
    });

    // Mock eventBus
    eventBus.emit = mockEmit;

    // Create wrapper with Pinia store
    wrapper = shallowMount(recipesComponent, {
      global: {
        plugins: [createPinia()],
      },
    });
  });

  it("saves the recipe on save button click", async () => {
    const mockRecipe = {
      strMeal: "Spaghetti Carbonara",
      strMealThumb: "thumb.jpg",
      strInstructions: "Cook the pasta.",
      strArea: "Italian",
      strCategory: "Main Course",
      strSource: "http://source.com",
      strYoutube: "http://youtube.com",
      strTags: "pasta,italian",
      strIngredient1: "Spaghetti",
      strMeasure1: "200g",
    };

    wrapper.setData({ recipe: mockRecipe });
    mockSaveRecipe.mockResolvedValue(true);

    await wrapper.vm.$nextTick(); // Ensure Vue has updated DOM
    const saveButton = wrapper.find(".save-button-container");

    expect(saveButton.exists()).toBe(true); // Check if element exists
    await saveButton.trigger("click");

    await wrapper.vm.$nextTick(); // Ensure Vue has updated data

    expect(mockSaveRecipe).toHaveBeenCalledWith(mockRecipe);
    expect(mockEmit).toHaveBeenCalledWith(
      "success",
      "Recipe saved successfully!"
    );
    expect(wrapper.vm.savedMessage).toBe(true);
  });

  it("loads a saved recipe on creation", async () => {
    const mockSavedRecipe = {
      strMeal: "Spaghetti Carbonara",
      strMealThumb: "thumb.jpg",
      strInstructions: "Cook the pasta.",
      strArea: "Italian",
      strCategory: "Main Course",
      strSource: "http://source.com",
      strYoutube: "http://youtube.com",
      strTags: "pasta,italian",
      strIngredient1: "Spaghetti",
      strMeasure1: "200g",
    };

    // Ensure the mock response structure matches the expected structure
    mockFetchUsersRecipes.mockResolvedValue({
      data: {
        data: {
          recipes: [{ recipe: mockSavedRecipe }],
        },
      },
    });

    await wrapper.vm.loadSavedRecipe();

    expect(mockFetchUsersRecipes).toHaveBeenCalled();
    expect(wrapper.vm.recipe).toEqual(mockSavedRecipe);
  });
});
