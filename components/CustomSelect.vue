<template>
  <div class="relative" ref="dropdownContainer">
    <!-- Button to trigger dropdown -->
    <button
      @click="toggleDropdown"
      type="button"
      class="w-full px-2 py-1 text-left flex justify-between items-center"
    >
      <div class="flex-1">{{ selectedOptionLabel || "Select Option" }}</div>
      <div><ChevronDownIcon class="w-4 h-4" /></div>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-2 rounded-md shadow-md"
    >
      <ul class="p-2 flex flex-wrap">
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="px-2 py-1 cursor-pointer bg-gray-200 rounded-md m-1 hover:bg-gray-300 dark:hover:bg-gray-700 flex flex-row text-sm items-center align-middle"
        >
          <div v-if="option.icon" class="mr-2">
            <component :is="option.icon" class="w-4 h-4" />
          </div>
          <div>
            {{ option.label }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const isOpen = ref(false);
const selectedOption = ref("");

const selectedOptionLabel = computed(() => {
  const selectedOptionObj = props.options.find(
    (option) => option.value === selectedOption.value
  );
  return selectedOptionObj ? selectedOptionObj.label : null;
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== selectedOption.value) {
      selectedOption.value = newVal;
    }
  },
  { immediate: true }
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  if (selectedOption.value !== option.value) {
    selectedOption.value = option.label;
    emit("update:modelValue", option.value);
  }
  isOpen.value = false;
};

// Close dropdown if clicked outside
const dropdownContainer = ref(null);

const closeDropdown = (event) => {
  if (!dropdownContainer.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Add event listener to close dropdown on outside click
onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

// Clean up the event listener on unmount
onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
