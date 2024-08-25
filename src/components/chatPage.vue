<template>
  <div class="chat-page">
    <div class="chat-area">
      <div class="chat-header">
        <div class="header-content">
          <img
            :src="recipientImage"
            alt="User Profile Picture"
            class="user-icon"
          />
          <h2>{{ recipientName }}</h2>
        </div>
      </div>
      <div class="chat-body" ref="chatBody">
        <div
          class="message"
          v-for="(message, index) in messages"
          :key="index"
          :class="{
            'my-message': message.isMine,
            'their-message': !message.isMine,
          }"
        >
          <span class="profile-icon material-symbols-outlined"> person </span>
          <div class="message-content">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
      <div class="chat-footer">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import webSocketManager from "@/services/WebSocketManager";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";
import { useChatLogsCollectionStore } from "@/stores/chatLogCollectionStore";

export default {
  name: "ChatPage",
  props: ["userEmail", "userImage"],
  data() {
    return {
      conversations: [],
      recipientName: "",
      messages: [],
      newMessage: "",
      searchQuery: "",
      filteredConversations: [],
      recipientEmail: "",
      recipientImage: "",
    };
  },
  setup() {
    const usersCollectionStore = useUsersCollectionStore();
    const chatLogsCollectionStore = useChatLogsCollectionStore();

    return {
      usersCollectionStore,
      chatLogsCollectionStore,
    };
  },
  async created() {
    this.filteredConversations = this.conversations;
    await this.getChatLogs();
    this.getGymBrosData();
    webSocketManager.onMessage((message) => {
      this.messages.push(message);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    });
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
  },
  methods: {
    async getChatLogs() {
      const response = await this.chatLogsCollectionStore.getUsersChatLogs(
        this.userEmail
      );
      this.messages = response.map((message) => {
        return {
          ...message,
          isMine: message.sender !== this.userEmail,
        };
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    async getGymBrosData() {
      const response = await this.usersCollectionStore.fetchGymBrosData(
        this.userEmail
      );
      this.recipientName = `${response.firstName} ${response.lastName}`;
      this.recipientImage = response.imagePath
        ? response.imagePath
        : require("@/assets/profile.jpg");
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      const message = {
        recipient: this.userEmail,
        content: this.newMessage,
        timestamp: new Date(),
        isMine: true,
      };
      webSocketManager.sendMessage(message);
      this.messages.push(message);
      this.newMessage = "";
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const chatBody = this.$refs.chatBody;
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    },
    selectConversation(conversation) {
      this.userEmail = conversation.userEmail;
      this.messages = conversation.messages;
    },
  },
};
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
}

.sidebar {
  width: 300px;
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
}

.sidebar h3 {
  margin-top: 0;
  font-size: 20px;
  font-weight: 600;
  color: #d29433;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 25px;
  background-color: #333;
  color: #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar li:hover {
  background-color: #333;
  color: #fff;
}

.sidebar li.selected {
  background-color: #444;
  color: #d29433;
  font-weight: bold;
}

.chat-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: #e0e0e0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.chat-header {
  padding: 15px;
  background: linear-gradient(135deg, #ff6f00, #d29433);
  color: #fff;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  border-bottom: 1px solid #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  border-radius: 0 0 15px 15px;
}

.header-content {
  display: flex;
}

.user-icon {
  font-size: 36px;
  margin-right: 10px;
  color: #fff;
}

.chat-body {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.profile-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-right: 12px;
  color: #e0e0e0;
}

.message-content {
  max-width: 75%;
  padding: 12px;
  border-radius: 15px;
  color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.my-message {
  display: flex;
  justify-content: flex-end;
}

.my-message .profile-icon {
  order: 2;
}

.my-message .message-content {
  background-color: #d29433;
  border-radius: 15px 15px 0 15px;
}

.their-message {
  display: flex;
  align-items: flex-start;
  margin-right: auto;
}

.their-message .profile-icon {
  margin-right: 6px;
}

.their-message .message-content {
  background-color: #333;
  border-radius: 15px 15px 15px 0;
}

.chat-footer {
  padding: 10px;
  background-color: #d29433;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
}

.chat-footer input {
  flex-grow: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background-color: #333;
  color: #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.chat-footer button {
  background-color: #000;
  color: #d29433;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  margin-left: 10px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s, transform 0.2s;
}

.chat-footer button:hover {
  background-color: #333;
  transform: scale(1.05);
}

.user-icon,
.profile-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.user-icon {
  margin-right: 10px;
  border: 2px solid #fff;
}
</style>
