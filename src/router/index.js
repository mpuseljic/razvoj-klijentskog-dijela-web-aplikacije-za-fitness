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

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    checkAuth()
      .then((response) => {
        if ((response.data.message = "Authenticated")) {
          next();
        } else {
          next({ name: "login" });
        }
      })
      .catch((error) => {
        console.error("Auth check error:", error);
        next({ name: "login" });
      });
  } else {
    next();
  }
});

export default router;
