import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

const BACKEND_URL = config.BACKEND_URL;

export const useWeightCollectionStore = defineStore("weightCollectionStore", {
  state: () => ({}),
  getters: {},
  actions: {
    async recordWeight(weight) {
      try {
        const token = this.getToken();
        const response = await axios.post(
          `${BACKEND_URL}/weight`,
          { weight },
          { withCredentials: true }
        );
        return response;
      } catch (error) {
        this.handleError(error, "Error saving weight");
      }
    },
    async deleteWeight(date) {
      try {
        const token = this.getToken();
        const response = await axios.delete(`${BACKEND_URL}/weight/${date}`, {
          withCredentials: true,
        });
        return response;
      } catch (error) {
        this.handleError(error, "Error deleting weight");
      }
    },
    async updateChart() {
      try {
        const token = this.getToken();
        const response = await axios.get(`${BACKEND_URL}/weight`, {
          withCredentials: true,
        });
        return response.data.data.weights;
      } catch (error) {
        this.handleError(error, "Error fetching weights");
      }
    },
    getToken() {
      return localStorage.getItem("token");
    },
    handleError(error, customMessage = "An error occurred") {
      console.error(customMessage, error.response?.data || error.message);
    },
  },
});
