<template>
  <div class="main">
    <div class="header" :style="{ paddingLeft: '15px' }">
      <router-link to="/" class="btn-dark" style="width: 100px">
        <span class="btn-dark material-symbols-outlined"> arrow_back_ios </span>
      </router-link>
    </div>
    <h2 :style="{ color: 'white', textAlign: 'center' }">
      Create your account
    </h2>

    <div class="input-signup">
      <h3 class="naziv">First name</h3>
      <input type="text" v-model="userName" class="input-field" />
      <h3 class="naziv">Last name</h3>
      <input type="text" v-model="surname" class="input-field" />
      <h3 class="naziv">E-mail</h3>
      <input type="email" v-model="email" class="input-field" />
      <h3 class="naziv">Password</h3>
      <input type="password" v-model="password" class="input-field" />

      <div class="submit">
        <button
          type="button"
          class="btn btn-success"
          :style="btnStyleGreen"
          @click="registerUser"
        >
          Create account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersCollectionStore } from "@/stores/usersCollectionStore.js";

export default defineComponent({
  name: "SignUp",
  setup() {
    const userName = ref("");
    const surname = ref("");
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const usersCollectionStore = useUsersCollectionStore();

    const btnStyleGreen = {
      borderRadius: "20px",
      width: "300px",
      marginTop: "10px",
      border: "none",
    };

    const registerUser = async () => {
      const res = await usersCollectionStore.registerUser(
        userName.value,
        surname.value,
        email.value,
        password.value
      );
      if (res) {
        router.push("/login");
      }
    };

    return {
      userName,
      surname,
      email,
      password,
      btnStyleGreen,
      registerUser,
    };
  },
});
</script>

<style scoped>
.naziv {
  color: white;
}

.input-signup {
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
}

.submit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.btn-success {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 10px;
  font-size: 15px;
  width: 350px;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-dark {
  background-color: black;
  border: none;
  margin: 20px 0 0 10px !important;
  padding: 0 !important;
}

.btn-dark:focus,
.btn-dark:active,
.btn-dark::-moz-focus-inner {
  border: none;
}
</style>
