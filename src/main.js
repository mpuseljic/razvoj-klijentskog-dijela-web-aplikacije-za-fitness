import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA07qV9a2WV_ZHswzJ5z3aX6pEWDzTzBfw",
  authDomain: "fitnessapp-448c7.firebaseapp.com",
  projectId: "fitnessapp-448c7",
  storageBucket: "fitnessapp-448c7.appspot.com",
  messagingSenderId: "759431144786",
  appId: "1:759431144786:web:31187370d92cba0b4a468b",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const pinia = createPinia();
const app = createApp(App);

app.provide("firebaseStorage", storage);
app.use(router);
app.use(pinia);
app.mount("#app");
