<template>
  <div>
    <header class="heading">
      <img class="heading-img" src="@/assets/logorsg.jpg" alt="Logo" />
    </header>
    <main class="main">
      <section class="gender">
        <h1 class="title">BMI CALCULATOR</h1>
        <div class="gender-buttons">
          <button @click="selectGender('male')" class="gender-btn btn-male">
            <span class="material-symbols-outlined gender-icon">male</span>
          </button>
          <button @click="selectGender('female')" class="gender-btn btn-female">
            <span class="material-symbols-outlined gender-icon">female</span>
          </button>
        </div>
      </section>
      <section class="bmi">
        <div class="input">
          <input
            v-model="height"
            type="number"
            placeholder="Height (cm)"
            class="form-control"
          />
          <input
            v-model="weight"
            type="number"
            placeholder="Weight (kg)"
            class="form-control"
          />
          <input
            v-model="age"
            type="number"
            placeholder="Age"
            class="form-control"
          />
        </div>
        <button class="btn btn-success" @click="calculateBMI">Calculate</button>
        <div v-if="bmi !== null" class="result">
          <h2>Your BMI: {{ bmi }}</h2>
          <p class="message">{{ bmiMessage }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "CalculateBMIComponent",
  data() {
    return {
      height: null,
      weight: null,
      age: null,
      bmi: null,
      male: false,
      female: false,
    };
  },
  computed: {
    bmiMessage() {
      if (this.bmi === null) return "";
      if (this.bmi < 18.5)
        return "You are undernourished. Consult your doctor to increase body weight.";
      if (this.bmi > 24.9)
        return "You have excess body weight. Consult a doctor to reduce it.";
      return "You have a normal body weight. Eat healthily and engage in physical activity to maintain it.";
    },
  },
  methods: {
    calculateBMI() {
      if (this.height && this.weight) {
        const heightInMeters = this.height / 100;
        this.bmi = (this.weight / heightInMeters ** 2).toFixed(2);
      } else {
        this.bmi = null;
      }
    },
    selectGender(gender) {
      this.male = gender === "male";
      this.female = gender === "female";

      if (gender === "male") {
        document.querySelector(".btn-male").classList.add("active");
        document.querySelector(".btn-female").classList.remove("active");
      } else if (gender === "female") {
        document.querySelector(".btn-female").classList.add("active");
        document.querySelector(".btn-male").classList.remove("active");
      }
    },
  },
};
</script>

<style scoped>
.heading {
  margin: 0;
  padding: 1vw 5vw 0 2vw;
  height: 9vh;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.heading-img {
  height: 7vh;
  width: auto;
  cursor: pointer;
}

.main {
  background-color: #121212;
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 93vh;
}

.gender {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
}

.gender-buttons {
  display: flex;
  gap: 30px;
}

.gender-btn {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.gender-btn:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
}

.gender-icon {
  font-size: 3rem;
  color: white;
}

.btn-male {
  background-color: #00bfff;
}

.btn-female {
  background-color: #ff69b4;
}

.bmi {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-control {
  background-color: #2c2c2c;
  max-width: 300px;
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  margin: 10px;
  color: white;
  border: 2px solid #d29433;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.form-control::placeholder {
  color: #b0b0b0;
  opacity: 1;
}

.form-control:focus {
  border-color: #ffc107;
  outline: none;
}

.btn {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  width: 300px;
  border-radius: 20px;
  padding: 10px;
  margin: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.title {
  color: #ffc107;
  font-size: 2rem;
  margin-bottom: 10px;
}

.result {
  color: white;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  text-align: center;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message {
  color: #ffc107;
  margin-top: 10px;
  font-size: 1rem;
}

.btn-male.active {
  transform: scale(1.15);
  box-shadow: 0px 8px 20px rgba(0, 191, 255, 0.5);
  border: 3px solid #00bfff;
}

.btn-female.active {
  transform: scale(1.15);
  box-shadow: 0px 8px 20px rgba(255, 105, 180, 0.5);
  border: 3px solid #ff69b4;
}

.gender-btn.active .gender-icon {
  transform: scale(1.3);
}
</style>
