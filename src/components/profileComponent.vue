<template>
  <div class="profile-container">
    <header class="heading">
      <img class="heading-img" src="@/assets/logorsg.jpg" alt="Logo" />
      <button class="logout-button" @click="logout">
        <span class="material-symbols-outlined logout">power_settings_new</span>
      </button>
    </header>

    <main class="main-content">
      <section class="user-info">
        <div class="user-profile">
          <span
            class="profile-pic"
            :style="{
              backgroundImage: userImage
                ? `url(${userImage})`
                : `url(${require('@/assets/profile.jpg')})`,
            }"
            @click="openModal('edit-profile-picture')"
          ></span>
          <h2 @click="openModal('edit-profile-data')">
            {{ userFullName }}
          </h2>
        </div>
      </section>

      <section class="gym-bros-section">
        <button @click="toggleGymBrosModal" class="gym-bros-btn">
          Look for MyGymBros
        </button>
      </section>

      <section class="pending-requests">
        <h2>Pending Requests</h2>
        <div v-if="pendingRequests.length > 0">
          <div
            v-for="(request, index) in pendingRequests"
            :key="index"
            class="request-item"
          >
            <p class="request-text">{{ request }}</p>
            <div class="request-actions">
              <button @click="acceptRequest(request)" class="accept-btn">
                Accept
              </button>
              <button @click="denyRequest(request)" class="deny-btn">
                Deny
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="no-requests">No pending requests.</p>
        </div>
      </section>

      <section v-if="isGymBrosModalVisible" class="gym-bros-modal">
        <h2>GymBros</h2>
        <div v-if="gymBros.length > 0">
          <ul class="gym-bros-list">
            <li v-for="bro in gymBros" :key="bro" class="gym-bros-item">
              {{ bro }}
              <span
                class="material-symbols-outlined chat-icon"
                @click="startChat(bro)"
                >chat</span
              >
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No GymBros found.</p>
        </div>
        <button @click="toggleGymBrosModal" class="close-btn">Close</button>
      </section>

      <section class="my-diaries">
        <h2 class="my-diaries-text">My Diaries</h2>
        <div v-if="diaries.length > 0">
          <div
            v-for="(diary, index) in diaries"
            :key="index"
            class="diary-entry"
          >
            <div class="diary-header">
              <div class="diary-date">
                {{ formatDate(diary.date) }}
              </div>
              <button @click="deleteDiaryEntry(diary._id)" class="delete-btn">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div class="diary-content">{{ diary.content }}</div>
          </div>
        </div>
        <div v-else>
          <p>No diary entries found.</p>
        </div>
      </section>

      <section class="saved-recipes-carousel">
        <h2>Your Saved Recipes</h2>
        <div v-if="recipes.length > 0" class="carousel-container">
          <div id="recipeCarousel" class="carousel slide carousel-custom">
            <div class="carousel-indicators">
              <button
                v-for="(recipe, index) in recipes"
                :key="'indicator-' + index"
                type="button"
                :data-bs-target="'#recipeCarousel'"
                :data-bs-slide-to="index"
                :class="{ active: index === 0 }"
                :aria-current="index === 0 ? 'true' : 'false'"
                :aria-label="'Slide ' + (index + 1)"
              ></button>
            </div>
            <div class="carousel-inner">
              <div
                v-for="(recipe, index) in recipes"
                :key="'item-' + index"
                :class="['carousel-item', { active: index === 0 }]"
                @click="showRecipeDetails('recipe-detail-modal', recipe)"
              >
                <img
                  :src="recipe.recipe.strMealThumb"
                  class="d-block w-100"
                  :alt="recipe.recipe.strMeal"
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>{{ recipe.recipe.strMeal }}</h5>
                </div>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#recipeCarousel"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#recipeCarousel"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <mainModal
      :active-modal="activeModal"
      :key="activeModal"
      @closeModal="closeModalAndShowSuccess"
    />
    <recipeDetailModal :activeModal="activeModal" />

    <div v-if="successMessage" class="toast">{{ successMessage }}</div>
    <confirmation-modal
      :isVisible="isModalVisible"
      message="Really log out?"
      @confirm="handleLogout"
      @cancel="closeModal"
      @close="closeModal"
    />
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import mainModal from "@/views/modalBody.vue";
import recipeDetailModal from "@/components/modals/recipeDetailModal.vue";
import confirmationModal from "@/components/modals/confirmationModal.vue";
import { useUserDiaryCollectionStore } from "@/stores/userDiaryCollectionStore";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";
import { useRecipesAPIStore } from "@/stores/recipesAPIStore";
import { useFriendsStore } from "@/stores/friendsStore";
import { onMounted, ref } from "vue";

export default {
  name: "profileComponent",
  components: {
    mainModal,
    confirmationModal,
    recipeDetailModal,
  },
  data() {
    return {
      activeModal: false,
      userFullName: "",
      diaries: [],
      userImage: "",
      successMessage: "",
      isModalVisible: false,
      pendingRequests: [],
      isGymBrosModalVisible: false,
      gymBros: [],
    };
  },
  setup() {
    const userDiaryCollectionStore = useUserDiaryCollectionStore();
    const usersCollectionStore = useUsersCollectionStore();
    const recipesAPIStore = useRecipesAPIStore();
    const successMessage = ref("");
    const userImage = ref("");
    const diaries = ref([]);
    const recipesAPI = useRecipesAPIStore();
    const recipes = ref([]);
    const friendsStore = useFriendsStore();
    const pendingRequests = ref([]);

    const fetchPendingRequests = async () => {
      await friendsStore.fetchRequests();
      pendingRequests.value = friendsStore.pendingRequests;
    };

    const acceptRequest = async (email) => {
      try {
        await friendsStore.acceptRequest(email);
        await fetchPendingRequests();
      } catch (error) {
        console.error("Error accepting request:", error);
      }
    };

    const denyRequest = async (email) => {
      try {
        await friendsStore.denyRequest(email);
        await fetchPendingRequests();
      } catch (error) {
        console.error("Error denying request:", error);
      }
    };

    const fetchUserDiaries = async () => {
      const diariesResponse = await userDiaryCollectionStore.getUserDiary();
      if (diariesResponse) {
        diaries.value = diariesResponse;
      }
    };
    const fetchUserRecipes = async () => {
      try {
        const response = await recipesAPI.fetchUsersRecipes();

        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.recipes
        ) {
          recipes.value = response.data.data.recipes.map((recipe) => {
            const recipeData =
              typeof recipe.recipe === "string"
                ? JSON.parse(recipe.recipe)
                : recipe.recipe;
            return {
              ...recipe,
              recipe: recipeData,
            };
          });
        }
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    };

    onMounted(() => {
      fetchUserDiaries();
      fetchUserRecipes();
      fetchPendingRequests();
    });

    const deleteDiaryEntry = async (diaryId) => {
      const res = await userDiaryCollectionStore.deleteDiaryEntry(diaryId);
      if (res) {
        diaries.value = diaries.value.filter((diary) => diary._id !== diaryId);
        successMessage.value = "Diary entry deleted successfully!";
        setTimeout(() => {
          successMessage.value = "";
        }, 1500);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
      userDiaryCollectionStore,
      usersCollectionStore,
      userImage,
      diaries,
      deleteDiaryEntry,
      formatDate,
      successMessage,
      recipes,
      pendingRequests,
      acceptRequest,
      denyRequest,
    };
  },
  methods: {
    closeModalAndShowSuccess(message) {
      this.activeModal = false;
      if (message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = "";
        }, 2000);
      }
    },
    toggleGymBrosModal() {
      this.isGymBrosModalVisible = !this.isGymBrosModalVisible;
      if (this.isGymBrosModalVisible) {
        this.fetchGymBros();
      }
    },
    async fetchGymBros() {
      try {
        const friendsStore = useFriendsStore();
        await friendsStore.fetchRequests();
        this.gymBros = friendsStore.acceptedRequests;
      } catch (error) {
        console.error("Error fetching GymBros:", error);
      }
    },
    async getUserDiary() {
      const res = await this.userDiaryCollectionStore.getUserDiary();
    },
    async getUserProfile() {
      const res = await this.usersCollectionStore.getUserProfile();
      if (res && res.data && res.data.data && res.data.data.user) {
        this.userFullName = `${res.data.data.user.firstName} ${res.data.data.user.lastName}`;
        this.userImage = res.data.data.user.imagePath;
      }
    },
    fetchNewUserData() {
      eventBus.on("success", async () => {
        await this.getUserProfile();
        await this.getUserDiary();
      });
    },

    async openModal(modalType) {
      this.activeModal = true;
      eventBus.emit("openModal", { modalType });
    },

    async getUserProfile() {
      const res = await this.usersCollectionStore.getUserProfile();
      if (res && res.data && res.data.data && res.data.data.user) {
        this.userFullName = `${res.data.data.user.firstName} ${res.data.data.user.lastName}`;
        this.userImage = res.data.data.user.imagePath;
      }
    },
    fetchNewUserData() {
      eventBus.on("success", async () => {
        await this.getUserProfile();
        await this.getUserDiary();
      });
    },
    async logout() {
      this.isModalVisible = true;
    },
    handleLogout() {
      this.isModalVisible = false;
      this.usersCollectionStore.logoutUser().then(() => {
        this.$router.push({ name: "login" });
      });
    },
    closeModal() {
      this.isModalVisible = false;
    },
    showRecipeDetails(modalType, recipe) {
      this.activeModal = true;
      eventBus.emit("openRecipeModal", { recipe });
    },
    startChat(email) {
      this.$router.push({
        name: "chatPage",
        params: { userEmail: email },
      });
    },
  },
  created() {
    eventBus.on("closeModal", (data) => {
      if (data.closeModal) this.activeModal = false;
    });
    eventBus.on("recipeMoved", (recipeId) => {
      this.recipes = this.recipes.filter((recipe) => recipe._id !== recipeId);
    });
    this.getUserProfile();
    this.getUserDiary();

    eventBus.on("updateUserImage", async (newImagePath) => {
      this.userImage = newImagePath;
      this.activeModal = false;
      this.closeModalAndShowSuccess("Profile picture updated successfully!");
    });

    eventBus.on("updateUserData", async () => {
      await this.getUserProfile();
      await this.getUserDiary();
      this.activeModal = false;
      this.closeModalAndShowSuccess("Profile updated successfully!");
    });
    eventBus.on("openRecipeModal", (data) => {
      this.recipe = data.recipe;
      this.activeModal = true;
    });
  },
};
</script>

<style scoped>
.mdi-chevron-right,
.mdi-chevron-left {
  color: black;
}
.logout-button {
  border-radius: 100%;
  background-color: black;
  border: none;
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

.heading-img {
  height: 7vh;
  width: auto;
}
.logout {
  color: red;
  scale: 1.5;
}
.page-name,
.my-profile {
  width: 100%;
  padding-left: 2.25vw;
  padding-top: 1vw;
}

.gym-bros-section {
  margin-top: 20px;
  text-align: center;
}

.pending-requests {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f97b1be2, #d29433);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pending-requests h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.my-diaries {
  margin-top: 100px;
  padding: 0 10vw;
  text-align: center;
}

.profile-pic {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}
.user-profile {
  margin-top: 50px;
  margin-left: 50px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-profile-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.user-info h2 {
  margin: 0;
  font-size: 24px;
  cursor: pointer;
}
.my-diaries-text {
  color: #d29433;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}
.card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card {
  width: 25vw;
  height: 15vh;
  background-color: white;
  padding: 1vw 2vw 1vw 2vw;
}
.card-heading {
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delete {
  color: red;
}
.class-heading-text {
  display: inline;
}
.card-text {
  font-size: 0.8rem;
  color: black;
}
.card-content {
  width: 100%;
  margin-top: 1vw;
}
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}

.profile-pic {
  display: inline-block;
  width: 200px;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}
.my-diaries {
  margin-top: 100px;
  padding: 0 10vx;
  text-align: center;
}

.diary-entry {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.diary-entry:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.diary-date {
  font-weight: bold;
  color: #333;
}

.diary-content {
  font-size: 16px;
  color: #555;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #ff0000;
}

.carousel-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.carousel {
  max-width: 300px;
  margin: 0 auto;
}

.carousel-item {
  object-fit: cover;
  width: 100%;
  height: auto;
}

.carousel-caption {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: #fff;
  text-align: center;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.carousel-control-prev,
.carousel-control-next {
  filter: invert(1);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #000;
  border-radius: 50%;
}
.saved-recipes-carousel {
  margin-top: 20px;
  text-align: center;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.request-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.request-text {
  flex-grow: 1;
  margin: 0;
  font-size: 16px;
  color: #555;
}

.request-actions {
  display: flex;
  gap: 10px;
}

.accept-btn,
.deny-btn {
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.accept-btn {
  background-color: #28a745;
}

.accept-btn:hover {
  background-color: #218838;
}

.deny-btn {
  background-color: #dc3545;
}

.deny-btn:hover {
  background-color: #c82333;
}

.no-requests {
  font-size: 16px;
  color: #666;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}
.gym-bros-btn {
  background: linear-gradient(135deg, #ff6f00, #d29433);
  color: white;
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.gym-bros-btn:hover {
  background-color: #7e591d;
}

.gym-bros-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  background-color: #a29595;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
}

.gym-bros-modal h2 {
  color: #333333;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.gym-bros-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.gym-bros-item {
  background-color: #726b6b;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
}

.gym-bros-item .chat-icon {
  color: black;
  cursor: pointer;
}

.gym-bros-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #939191;
}

.gym-bros-item span {
  font-size: 20px;
  color: #d29433;
  cursor: pointer;
  transition: color 0.3s ease;
}

.gym-bros-item span:hover {
  color: #7e591d;
}

.chat-icon {
  font-size: 24px;
  color: #d29433;
  cursor: pointer;
  transition: color 0.3s ease;
}

.chat-icon:hover {
  color: #7e591d;
}

.close-btn {
  background-color: #f44336;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  display: block;
  width: 100%;
  text-align: center;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: #c62828;
}
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
}

.chat-icon {
  font-size: 24px;
  color: white;
  background-color: #d29433;
  border-radius: 50%;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

.chat-icon:hover {
  background-color: #b57622;
}

.welcome-message {
  background: linear-gradient(135deg, #ff6f00, #d29433);
  color: #000000;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  z-index: 10;
  font-size: 14px;
  margin-right: 10px;
}
</style>
