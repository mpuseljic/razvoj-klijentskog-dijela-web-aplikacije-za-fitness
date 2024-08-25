<template>
  <div class="main">
    <div class="header">
      <router-link to="/" class="btn-dark">
        <span class="btn-dark material-symbols-outlined">arrow_back_ios</span>
      </router-link>
    </div>
    <h2 class="title">Log in to your account</h2>
    <div class="input-login">
      <h3 class="label">E-mail</h3>
      <input type="email" v-model="email" class="form-control input-field" />
      <h3 class="label">Password</h3>
      <input
        type="password"
        v-model="password"
        class="form-control input-field"
      />
      <div class="submit">
        <button
          type="button"
          class="btn btn-success"
          :disabled="loading"
          @click="loginUser"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>Login</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="loading"
          @click="cancelLogin"
        >
          Cancel
        </button>
      </div>
      <div v-if="loginError" class="alert alert-danger" role="alert">
        {{ loginError }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore";

export default {
  name: "LogIn",
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const loginError = ref(null);

    const usersCollectionStore = useUsersCollectionStore();
    const router = useRouter();

    const loginUser = async () => {
      if (!email.value || !password.value) {
        loginError.value = "Please enter both email and password.";
        return;
      }

      try {
        loading.value = true;
        loginError.value = null;

        const res = await usersCollectionStore.fetchUserData(
          email.value,
          password.value
        );

        if (res?.status === 200) {
          router.push("/home");
        }
      } catch (error) {
        console.error("Login failed: ", error);
        loginError.value =
          error.response?.data?.error ||
          "Incorrect email or password. Please try again.";
      } finally {
        loading.value = false;
      }
    };

    const cancelLogin = () => {
      email.value = "";
      password.value = "";
      loginError.value = null;
    };

    return {
      email,
      password,
      loading,
      loginError,
      loginUser,
      cancelLogin,
    };
  },
};
</script>

<style scoped>
.header {
  padding-left: 15px;
}

.title {
  color: white;
  text-align: center;
}

.label {
  color: white;
}

.input-login {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.input-field {
  background-color: #d29433;
  width: 300px;
  min-width: 100px;
  padding: 8px 16px;
  border-radius: 20px;
  text-align: center;
  margin: 10px;
  color: white;
}

.submit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.btn-success,
.btn-secondary {
  border-radius: 20px;
  width: 350px;
  padding: 10px;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
  color: white;
  border: none;
}

.btn-dark {
  background-color: black;
  border: none;
  margin: 20px 0 0 10px !important;
  padding: 0 !important;
}

.btn-dark:hover {
  background-color: black;
}

.btn-dark:focus,
.btn-dark:active,
.btn-dark::-moz-focus-inner {
  border: none;
}
</style>
