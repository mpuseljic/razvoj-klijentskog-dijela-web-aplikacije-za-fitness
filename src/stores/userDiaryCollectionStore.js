import { defineStore } from "pinia";
import config from "../../config.json";
import axios from "axios";

const BACKEND_URL = config.BACKEND_URL;

export const useUserDiaryCollectionStore = defineStore(
  "userDiaryCollectionStore",
  {
    state: () => ({}),
    getters: {},
    actions: {
      async getUserDiary() {
        try {
          const token = this.getToken();
          const response = await axios.get(`${BACKEND_URL}/diary`, {
            withCredentials: true,
          });
          return response.data.data.diaries;
        } catch (error) {
          this.handleError(error);
        }
      },
      async saveDiaryEntry(content, date) {
        try {
          const token = this.getToken();
          const response = await axios.post(
            `${BACKEND_URL}/diary`,
            { content, date },
            {
              withCredentials: true,
            }
          );
          return response;
        } catch (error) {
          this.handleError(error, "Error saving diary entry");
        }
      },
      async deleteDiaryEntry(diaryId) {
        try {
          const token = this.getToken();
          const response = await axios.delete(
            `${BACKEND_URL}/diary/${diaryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          return response;
        } catch (error) {
          this.handleError(error);
        }
      },
      getToken() {
        return localStorage.getItem("token");
      },
      handleError(error, customMessage = "An error occurred") {
        console.error(customMessage, error.response?.data || error.message);
      },
    },
  }
);
