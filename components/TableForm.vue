<template>
  <div>
    <!-- Custom Form -->
    <form v-if="fields.length" novalidate @submit.prevent="submitForm">
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-4 sm:p-8">
          <div class="flex flex-wrap gap-y-4">
            <div
              v-for="(field, index) in fields"
              :key="field.key || `fallback_${index}`"
              class="flex flex-col space-y-2 p-2 w-full"
            >
              <label
                :for="field.key"
                class="font-bold text-gray-700 dark:text-white"
              >
                {{ field.label }}
                <span v-if="field.isRequired" class="text-red-500">*</span>
              </label>

              <!-- Simple text input rendering -->
              <div v-if="field.type === 'text'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  :type="field.type"
                  :required="field.isRequired"
                  :placeholder="`Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter
        title=""
        :buttons="[
          {
            label: editable ? 'Cancel' : 'Back',
            icon: editable ? XCircleIcon : ChevronLeftIcon,
            iconPosition: editable ? 'after' : 'before',
            variant: 'secondary',
            onClick: editable ? cancelEdit : goBack,
          },
          {
            label: editable ? 'Save' : 'Edit',
            icon: editable ? CheckCircleIcon : PencilSquareIcon,
            iconPosition: 'after',
            variant: 'primary',
            onClick: editable ? submitForm : enableEdit,
          },
        ]"
      />
    </form>
  </div>
</template>

<script setup>
import PageFooter from "@/components/PageFooter.vue";
import {
  XCircleIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => [],
  },
  editable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  "submit",
  "cancel",
  "editable",
  "back",
  "update:modelValue",
]);

// Validate form before submission
const validateForm = () => {
  let isValid = true;

  props.fields.forEach((field) => {
    if (field.isRequired && !field.value) {
      field.error = `${field.label} is required.`;
      isValid = false;
    } else {
      field.error = "";
    }
  });

  return isValid;
};

// Handle form submission
const submitForm = () => {
  if (validateForm()) {
    emit("submit");
    emit("update:modelValue", props.modelValue);
  }
};

// Handle cancel action (reset fields)
const cancelEdit = () => {
  props.fields.forEach((field) => {
    field.value = field.originalValue;
  });

  emit("cancel");
};

// Handle going back
const goBack = () => {
  emit("back");
};

// Enable editing
const enableEdit = () => {
  emit("editable");
};
</script>
