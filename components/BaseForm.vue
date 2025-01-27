<template>
  <div class="">
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
              :class="[
                'flex flex-col space-y-2 p-2',
                field.fullRow
                  ? 'w-full'
                  : field.halfRow
                  ? 'w-1/2'
                  : field.thirdRow
                  ? 'w-1/3'
                  : field.quarterRow
                  ? 'w-1/4'
                  : 'w-auto',
              ]"
            >
              <label
                :for="field.key"
                class="text-sm font-bold text-gray-700 dark:text-white"
              >
                {{ field.label }}
                <span v-if="field.isRequired" class="text-red-500">*</span>
              </label>
              <span
                v-if="field.description && !editable"
                class="text-sm text-gray-500"
                >{{ field.description }}</span
              >
              <span
                v-if="field.hint && editable"
                class="text-sm text-gray-500"
                >{{ field.hint }}</span
              >

              <!-- Dynamic Field Rendering -->
              <div v-if="field.type === 'text'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  :type="field.type"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'textarea'">
                <textarea
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  :type="field.type"
                  v-bind="field.attrs || {}"
                  :rows="field.rows || 4"
                  :required="field.isRequired"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                ></textarea>
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'email'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  :type="field.type"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'password'">
                <div class="relative">
                  <input
                    v-if="editable"
                    :id="field.key"
                    v-model="field.value"
                    :type="showPassword ? 'text' : 'password'"
                    v-bind="field.attrs || {}"
                    :required="field.isRequired"
                    :placeholder="field.placeholder || `Enter ${field.label}`"
                    class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                  />
                  <button
                    type="button"
                    @click="togglePasswordVisibility"
                    class="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  >
                    <span v-if="showPassword">
                      <EyeSlashIcon class="h-5 w-5" />
                    </span>
                    <span v-else v-if="editable">
                      <EyeIcon class="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>

              <div v-else-if="field.type === 'phone'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  type="tel"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'richtexthtml'">
                <HtmlEditor
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  type="textarea"
                  :required="field.isRequired"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'richtextmarkdown'">
                <MarkdownEditor
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  type="textarea"
                  :required="field.isRequired"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'image'">
                <ImageUpload
                  v-if="editable"
                  :id="field.key"
                  type="file"
                  :required="field.isRequired"
                  :type="field.type"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.type === 'date'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  :type="field.type"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.type === 'number'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  :type="field.type"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full focus-visible:outline-violet-500"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.type === 'select'">
                <CustomSelect
                  v-if="editable"
                  v-model="field.value"
                  :options="field.options"
                  :type="field.type"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  class="text-sm w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'boolean'">
                <input
                  v-if="editable"
                  :id="field.key"
                  v-model="field.value"
                  type="checkbox"
                  v-bind="field.attrs || {}"
                  :required="field.isRequired"
                  class="h-4 w-4 accent-violet-500 dark:accent-teal-500"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.error" class="text-red-500 text-sm">
                {{ field.error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter
        v-if="editable || showCancel || showBack || showSubmit"
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
import ImageUpload from "@/components/ImageUpload.vue";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import {
  XCircleIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/vue/24/outline";

const model = defineModel();
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
  showCancel: {
    type: Boolean,
    default: false,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  showSubmit: {
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

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "");

  let formatted = "";

  if (digits.length > 0) {
    formatted += `${digits.slice(0, 3)}`;
  }
  if (digits.length > 3) {
    formatted += ` ${digits.slice(3, 6)}`;
  }
  if (digits.length > 6) {
    formatted += ` ${digits.slice(6, 10)}`;
  }

  return formatted.trim();
};

watch(
  () => props.fields.find((field) => field.type === "phone")?.value,
  (newValue, oldValue) => {
    const phoneField = props.fields.find((field) => field.type === "phone");

    if (phoneField && newValue) {
      phoneField.value = formatPhoneNumber(newValue);
    }
  }
);

const validateForm = () => {
  let isValid = true;

  props.fields.forEach((field) => {
    const { value, isRequired, label, type } = field;

    // Required Field Validation
    if (isRequired && !value) {
      field.error = `${label} is required.`;
      isValid = false;

      // Email Validation
    } else if (type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.error = `${label} must be a valid email address.`;
        isValid = false;
      } else {
        field.error = "";
      }

      // Phone Number Validation
    } else if (type === "phone" && value) {
      const sanitizedValue = value.replace(/\D/g, "");
      const phoneRegex = /^\d{10}$/; // Matches exactly 10 digits
      if (!phoneRegex.test(sanitizedValue)) {
        field.error = `${label} must be a valid phone number with exactly 10 digits.`;
        isValid = false;
      } else {
        field.error = "";
      }

      // Max Length Validation
    } else if (field.attrs?.maxlength && value.length > field.attrs.maxlength) {
      field.error = `${label} cannot exceed ${field.attrs.maxlength} characters.`;
      isValid = false;

      // Min Length Validation
    } else if (field.attrs?.minlength && value.length < field.attrs.minlength) {
      field.error = `${label} must be at least ${field.attrs.minlength} characters long.`;
      isValid = false;

      // Pattern Validation
    } else if (field.attrs?.pattern && value) {
      const patternRegex = new RegExp(field.attrs.pattern);
      if (!patternRegex.test(value)) {
        field.error = `${label} does not match the required format.`;
        isValid = false;
      } else {
        field.error = "";
      }

      // Number Validation (Range)
    } else if (type === "number" && value) {
      if (field.attrs?.min !== undefined && value < field.attrs.min) {
        field.error = `${label} must be at least ${field.attrs.min}.`;
        isValid = false;
      } else if (field.attrs?.max !== undefined && value > field.attrs.max) {
        field.error = `${label} cannot exceed ${field.attrs.max}.`;
        isValid = false;
      } else {
        field.error = "";
      }
    } else {
      field.error = "";
    }
  });

  return isValid;
};

const submitForm = () => {
  if (validateForm()) {
    emit("submit");
    emit("update:modelValue", model.value);
  }
};

const cancelEdit = () => {
  props.fields.forEach((field) => {
    field.value = field.originalValue;
  });

  emit("cancel");
};

const goBack = () => {
  emit("back");
};

const enableEdit = () => {
  emit("editable");
};

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
