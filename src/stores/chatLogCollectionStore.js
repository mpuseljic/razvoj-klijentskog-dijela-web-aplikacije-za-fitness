import { defineStore } from "pinia";
import config from "../../config.json";

import axios from "axios";

export const useChatLogsCollectionStore = defineStore(
  "chatLogsCollectionStore",
  {
    actions: {
      async getUsersChatLogs(recipient) {
        try {
          const response = await axios.get(
            `${config.BACKEND_URL}/chat-logs/${recipient}`,
            {
              withCredentials: true,
            }
          );
          return response.data.data.chatLog.messages;
        } catch (error) {
          console.error(error.response.data);
        }
      },
    },
  }
);
