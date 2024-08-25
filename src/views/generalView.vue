<template>
  <div id="generalCarousel" class="carousel slide">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <span
          v-for="(item, index) in carouselItems"
          :key="index"
          @click="changeSlide(index)"
          :class="{
            'navbar-icons material-symbols-outlined': true,
            active: activeSlide === index,
          }"
        >
          {{ item.name }}
        </span>
      </div>
    </nav>
    <div class="carousel-inner">
      <div :class="{ 'carousel-item': true, active: activeSlide === 0 }">
        <homePageComponent />
      </div>
      <div :class="{ 'carousel-item': true, active: activeSlide === 1 }">
        <calculateBMIComponent />
      </div>
      <div :class="{ 'carousel-item': true, active: activeSlide === 2 }">
        <recipesComponent />
      </div>
      <div :class="{ 'carousel-item': true, active: activeSlide === 3 }">
        <diaryComponent />
      </div>
      <div :class="{ 'carousel-item': true, active: activeSlide === 4 }">
        <profileComponent />
      </div>
    </div>

    <div
      v-if="showToast"
      class="toast-container position-fixed bottom-0 start-50 translate-middle-x"
    >
      <div
        id="toast"
        class="custom-toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-body">{{ successMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import homePageComponent from "@/components/homePageComponent.vue";
import profileComponent from "@/components/profileComponent.vue";
import DiaryComponent from "@/components/diaryComponent.vue";
import calculateBMIComponent from "@/components/calculateBMIComponent.vue";
import recipesComponent from "@/components/recipesComponent.vue";
import eventBus from "@/eventBus";

export default {
  name: "generalView",
  data() {
    return {
      successMessage: "",
      activeSlide: 0,
      carouselItems: [
        { name: "home" },
        { name: "insert_chart" },
        { name: "restaurant" },
        { name: "description" },
        { name: "person" },
      ],
      showToast: false,
    };
  },
  components: {
    homePageComponent,
    profileComponent,
    DiaryComponent,
    calculateBMIComponent,
    recipesComponent,
  },
  created() {
    eventBus.on("success", (data) => {
      this.successMessage = data;
      this.showToastSuccess();
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    });
  },
  methods: {
    showToastSuccess() {
      const toastSuccess = document.getElementById("toast");
      if (toastSuccess) {
        const toastBootstrap = new bootstrap.Toast(toastSuccess, {
          autohide: true,
          delay: 5000,
        });
        toastBootstrap.show();
      }
    },
    changeSlide(index) {
      this.activeSlide = index;
    },
  },
};
</script>

<style scoped>
.toast-container {
  z-index: 1050;
}
.custom-toast {
  background-color: orange;
  color: black;
  width: 450px;
  text-align: center;
  margin-bottom: 6vh;
  height: 70px;
}
.toast-body {
  font-size: 1.2rem;
}
.navbar {
  height: 5.5vh;
  z-index: 10;
}
.navbar-icons {
  cursor: pointer;
  font-size: 1.7rem;
}
.active {
  color: orange;
}
.carousel-inner {
  height: calc(100vh - 5.5vh);
}
.carousel-item {
  height: 100%;
  background-color: #000;
  overflow: auto;
}
</style>
