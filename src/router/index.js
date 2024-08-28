/* eslint-disable */
import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/SignUp.vue";
import LogIn from "../views/LogIn.vue";
import FirstPage from "../views/FirstPage.vue";
import config from "../../config.json";
import axios from "axios";
import generalView from "@/views/generalView.vue";
import chatPage from "@/components/chatPage.vue";

const routes = [
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
  },
  {
    path: "/login",
    name: "login",
    component: LogIn,
  },
  {
    path: "/",
    name: "firstpage",
    component: FirstPage,
  },

  {
    path: "/home",
    name: "home",
    component: generalView,
    meta: { requiresAuth: true },
  },

  {
    path: "/chat/:userEmail",
    component: chatPage,
    name: "chatPage",
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function checkAuth() {
  return axios.get(`${config.BACKEND_URL}/auth/check`, {
    withCredentials: true,
  });
}

router.beforeEach(async (to, from, next) => {
  console.log("Navigation triggered to:", to.name);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("Route requires authentication. Checking...");
    try {
      const response = await axios.get(`${config.BACKEND_URL}/auth/check`, {
        withCredentials: true,
      });
      console.log("Auth check response:", response.data);
      if (response.data.message === "Authenticated") {
        console.log("User is authenticated.");
        next();
      } else {
        console.log("User is not authenticated. Redirecting to login...");
        next({ name: "login" });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
