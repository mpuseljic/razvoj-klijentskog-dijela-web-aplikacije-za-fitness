<template>
  <div class="main-container">
    <header class="heading">
      <img class="heading-img" src="@/assets/logorsg.jpg" alt="Logo" />
    </header>

    <main class="main">
      <section class="title">
        <h1>My Progress</h1>
      </section>

      <section class="form-group">
        <label for="datePicker" class="form-label">Select a Date:</label>
        <input
          id="datePicker"
          type="date"
          v-model="date"
          class="form-control"
        />
      </section>

      <section class="form-group">
        <label for="diaryEntry" class="form-label">Diary Entry:</label>
        <textarea
          id="diaryEntry"
          v-model="diaryContent"
          class="form-control"
          rows="4"
          placeholder="Write your thoughts..."
        ></textarea>
        <div class="button-group">
          <button @click="clearForm" class="btn btn-danger">Clear</button>
          <button @click="saveEntry" class="btn btn-success">Save</button>
        </div>
      </section>

      <section class="form-group">
        <label for="weightInput" class="form-label">Enter Weight (kg):</label>
        <input
          id="weightInput"
          type="number"
          step="0.1"
          v-model="weightInput"
          class="form-control"
        />
        <button @click="addWeight" class="btn btn-success">
          Record Weight
        </button>
      </section>

      <section v-if="weights.length > 0" class="weight-progress">
        <header class="weight-progress-header">
          <h2>Weight Progress</h2>
        </header>
        <div class="canvas-box">
          <canvas ref="weightChartEl"></canvas>
        </div>
        <div class="weight-history">
          <h2>Weight History</h2>
          <ul>
            <li
              v-for="weight in weights"
              :key="weight.date"
              @click="removeWeight(weight.date)"
            >
              <span>{{ weight.weight }} kg</span>
              <small>{{ new Date(weight.date).toLocaleDateString() }}</small>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import eventBus from "@/eventBus";
import { ref, nextTick, onMounted } from "vue";
import { useUserDiaryCollectionStore } from "@/stores/userDiaryCollectionStore";
import { useWeightCollectionStore } from "@/stores/weightCollectionStore";

const date = ref("");
const diaryContent = ref("");
const weightInput = ref(0);
const weights = ref([]);

const weightChartEl = ref(null);
const weightChart = ref(null);

const userDiaryCollectionStore = useUserDiaryCollectionStore();
const weightCollectionStore = useWeightCollectionStore();

const clearForm = () => {
  date.value = "";
  diaryContent.value = "";
  weightInput.value = 0;
};

const saveEntry = async () => {
  const res = await userDiaryCollectionStore.saveDiaryEntry(
    diaryContent.value,
    date.value
  );
  if (res) {
    clearForm();
    eventBus.emit("success", "Diary entry added successfully!");
  }
};

const addWeight = async () => {
  weights.value.push({
    weight: weightInput.value,
    date: new Date().getTime(),
  });
  await weightCollectionStore.recordWeight(weightInput.value);
  updateChart();
  clearForm();
  eventBus.emit("success", "Weight recorded successfully!");
};

const removeWeight = async (date) => {
  try {
    await weightCollectionStore.deleteWeight(date);
    weights.value = weights.value.filter((weight) => weight.date !== date);
    updateChart();
    eventBus.emit("success", "Weight removed successfully!");
  } catch (error) {
    eventBus.emit("error", "Failed to remove weight.");
  }
};

const renderChart = (weights) => {
  nextTick(() => {
    const ctx = weightChartEl.value?.getContext("2d");
    if (!ctx) {
      return;
    }

    if (weightChart.value) {
      weightChart.value.destroy();
    }

    weightChart.value = new Chart(ctx, {
      type: "line",
      data: {
        labels: weights.map((entry) =>
          new Date(entry.date).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Weight Progress",
            data: weights.map((entry) => entry.weight),
            borderWidth: 2,
            backgroundColor: "rgba(210, 148, 51, 0.2)",
            borderColor: "#d29433",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
};

const updateChart = async () => {
  try {
    const response = await weightCollectionStore.updateChart();
    if (Array.isArray(response)) {
      weights.value = response;
      renderChart(weights.value);
    }
  } catch (error) {
    console.error("Error updating chart:", error);
  }
};

onMounted(() => {
  nextTick(() => {
    updateChart();
  });
});
</script>

<style scoped>
.main-container {
  padding: 1rem;
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 2rem auto;
  background: linear-gradient(135deg, #ff6f00, #d29433);
}

.heading {
  padding: 1rem 5%;
  background: linear-gradient(135deg, #ff6f00, #d29433);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.heading-img {
  height: 60px;
  cursor: pointer;
}

.main {
  margin-top: 2rem;
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #444;
  font-size: 1.75rem;
}

.form-group {
  margin: 1.5rem auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-family: "Lucida Sans", Geneva, Verdana, sans-serif;
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.form-control {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-success {
  background-color: #28a745;
}

.btn:hover {
  opacity: 0.9;
}

#weightInput,
#diaryEntry {
  margin-bottom: 1rem;
}

.weight-progress {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weight-progress-header {
  margin-bottom: 1rem;
  text-align: center;
}
.weight-progress-header h2 {
  color: #444;
}

.canvas-box {
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.canvas-box canvas {
  width: 100%;
  height: 300px;
}

.weight-history {
  width: 100%;
  max-width: 700px;
}
.weight-history h2 {
  color: #444;
}

.weight-history ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.weight-history ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  transition: background-color 0.3s ease;
}

.weight-history ul li:nth-child(even) {
  background-color: #f9f9f9;
}

.weight-history ul li:hover {
  background-color: #f1f1f1;
}

.weight-history ul li span {
  font-size: 1.125rem;
  font-weight: 600;
  color: #444;
}

.weight-history ul li small {
  color: #777;
  font-style: italic;
}
</style>
