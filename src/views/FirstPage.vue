<template>
  <div id="wrapper" class="wrapper" :style="myStyle">
    <h2 id="naslov">READYSET<span class="gym">GYM</span></h2>
    <p id="text" class="text-white font-weight-bold pb-5">
      Become stronger with our workout plans
    </p>
    <router-link to="/signup" class="btn btn-primary">Get started</router-link>
    <router-link to="/login" class="btn btn-secondary">Login</router-link>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FirstPage",
  setup() {
    const backgroundImage = require("@/assets/login.jpg");

    const myStyle = computed(() => ({
      backgroundImage: `url(${backgroundImage})`,
    }));

    return {
      myStyle,
    };
  },
});
</script>

<style scoped>
#wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  padding-bottom: 100px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  margin-top: 0;
}

#wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

#wrapper > * {
  position: relative;
  z-index: 2;
}

#naslov,
#text {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

#naslov {
  color: white;
  padding-bottom: 20px;
  white-space: nowrap;
}

.gym {
  color: #d29433;
  font-weight: bold;
  white-space: nowrap;
  font-size: 35px;
}

#text {
  color: white;
  padding-bottom: 5px;
  font-size: 20px;
}

.btn {
  width: 350px;
  padding: 10px;
  font-size: 15px;
  margin: 10px;
  text-align: center;
  white-space: nowrap;
}

.btn-primary {
  background-color: #555050;
  border: none;
  border-radius: 10px;
}

.btn-primary:hover {
  background-color: #d29433;
}

.btn-secondary {
  border-radius: 10px;
}

.btn-secondary:hover {
  background-color: #d29433;
}
</style>
