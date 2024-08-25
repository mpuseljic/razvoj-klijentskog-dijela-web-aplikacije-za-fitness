<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
* {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: white;
  scrollbar-width: none;
}
*::-webkit-scrollbar {
  display: none;
}
body {
  background-color: #000;
}
.exit-button-modal {
  z-index: 99;
}
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}
</style>
