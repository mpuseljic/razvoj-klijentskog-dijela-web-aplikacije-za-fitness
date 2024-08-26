import { shallowMount } from "@vue/test-utils";
import calculateBMIComponent from "@/components/calculateBMIComponent.vue";

describe("calculateBMIComponent.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(calculateBMIComponent);
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("calculates BMI correctly", async () => {
    await wrapper.setData({ height: 170, weight: 70 });
    await wrapper.find(".btn-success").trigger("click");
    expect(wrapper.vm.bmi).toBe("24.22");
  });

  it("displays correct BMI message for underweight", async () => {
    await wrapper.setData({ height: 170, weight: 50 });
    await wrapper.find(".btn-success").trigger("click");
    expect(wrapper.vm.bmiMessage).toBe(
      "You are undernourished. Consult your doctor to increase body weight."
    );
  });

  it("displays correct BMI message for normal weight", async () => {
    await wrapper.setData({ height: 170, weight: 70 });
    await wrapper.find(".btn-success").trigger("click");
    expect(wrapper.vm.bmiMessage).toBe(
      "You have a normal body weight. Eat healthily and engage in physical activity to maintain it."
    );
  });

  it("displays correct BMI message for overweight", async () => {
    await wrapper.setData({ height: 170, weight: 90 });
    await wrapper.find(".btn-success").trigger("click");
    expect(wrapper.vm.bmiMessage).toBe(
      "You have excess body weight. Consult a doctor to reduce it."
    );
  });

  it("correctly sets the active gender button", async () => {
    await wrapper.find(".btn-male").trigger("click");
    expect(wrapper.vm.male).toBe(true);
    expect(wrapper.vm.female).toBe(false);
    expect(wrapper.find(".btn-male").classes()).toContain("active");
    expect(wrapper.find(".btn-female").classes()).not.toContain("active");

    await wrapper.find(".btn-female").trigger("click");
    expect(wrapper.vm.male).toBe(false);
    expect(wrapper.vm.female).toBe(true);
    expect(wrapper.find(".btn-female").classes()).toContain("active");
    expect(wrapper.find(".btn-male").classes()).not.toContain("active");
  });
});
