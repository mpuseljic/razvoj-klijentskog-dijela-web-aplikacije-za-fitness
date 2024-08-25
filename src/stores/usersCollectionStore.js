import { defineStore } from "pinia";
import config from "../../config.json";
import webSocketManager from "@/services/WebSocketManager";
import axios from "axios";

export const useUsersCollectionStore = defineStore("usersCollectionStore", {
  state: () => ({
    searchResults: [],
    searchLoading: false,
    userEmail: "",
  }),
  getters: {
    getUserEmail: (state) => state.userEmail,
  },
  actions: {
    async updateUserProfilePicture(formData) {
      try {
        const response = await axios.patch(
          `${config.BACKEND_URL}/user`,
          formData,
          {
            withCredentials: true,
          }
        );
        return response;
      } catch (error) {
        console.error("Error updating profile picture:", error.response?.data);
      }
    },
    async updateUserData(formData) {
      try {
        const response = await axios.patch(
          `${config.BACKEND_URL}/user`,
          formData,
          {
            withCredentials: true,
          }
        );
        return response;
      } catch (error) {
        console.error("Error updating user data:", error.response?.data);
      }
    },
    async fetchUserData(email, password) {
      try {
        const response = await axios.post(
          `${config.BACKEND_URL}/auth/login`,
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        return response;
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data);
      }
    },
    async logoutUser() {
      try {
        await axios.post(
          `${config.BACKEND_URL}/auth/logout`,
          {},
          { withCredentials: true }
        );
        webSocketManager.close();
      } catch (error) {
        console.error("Error logging out:", error.response?.data);
      }
    },
    async registerUser(firstName, lastName, email, password) {
      try {
        const response = await axios.post(`${config.BACKEND_URL}/auth/signup`, {
          firstName,
          lastName,
          email,
          password,
        });
        return response;
      } catch (error) {
        console.error("Error registering user:", error.response?.data);
      }
    },
    async getUserProfile() {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/user`, {
          withCredentials: true,
        });
        this.userEmail = response.data.data.user.email;
        webSocketManager.connect(this.userEmail);
        return response;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    async searchUsers(query) {
      this.searchLoading = true;
      try {
        const response = await axios.get(
          `${config.BACKEND_URL}/users/search/${query}`,
          {
            withCredentials: true,
          }
        );
        this.searchResults = response.data.data.users;
      } catch (error) {
        console.error("Error searching users:", error.response?.data);
      } finally {
        this.searchLoading = false;
      }
    },
    async fetchGymBrosData(email) {
      try {
        const response = await axios.get(
          `${config.BACKEND_URL}/user/${email}`,
          {
            withCredentials: true,
          }
        );
        return response.data.data.user;
      } catch (error) {
        console.error("Error fetching Gym Bros data:", error);
      }
    },
  },
});
