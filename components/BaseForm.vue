<template>
  <div class="">
    <!-- Custom Form -->
    <form v-if="fields.length" @submit.prevent="submitForm">
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
                field.fullRow ? 'w-full' : 'w-1/2',
              ]"
            >
              <label
                :for="field.key"
                class="font-bold text-gray-700 dark:text-white"
              >
                {{ field.label }}
                <span v-if="field.isRequired" class="text-red-500">*</span>
              </label>

              <!-- Dynamic Field Rendering -->
              <div v-if="field.type === 'text'">
                <input
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  :type="field.type"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'textarea'">
                <textarea
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  :rows="field.rows || 4"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                ></textarea>
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'email'">
                <input
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  type="email"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'phone'">
                <input
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  type="tel"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'richtexthtml'">
                <HtmlEditor
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'richtextmarkdown'">
                <MarkdownEditor
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'image'">
                <ImageUpload
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.type === 'date'">
                <input
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  type="date"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.type === 'number'">
                <input
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  type="number"
                  :placeholder="field.placeholder || `Enter ${field.label}`"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md p-2 w-full"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-if="field.type === 'select'">
                <CustomSelect
                  v-if="editable"
                  v-model="field.value"
                  :options="field.options"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                />
                <p v-else>{{ field.value }}</p>
              </div>

              <div v-else-if="field.type === 'boolean'">
                <input
                  v-if="editable"
                  v-model="field.value"
                  :id="field.key"
                  type="checkbox"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
        title=""
        :buttons="[
          {
            label: 'Cancel',
            icon: XCircleIcon,
            iconPosition: 'before',
            variant: 'secondary',
            onClick: cancelEdit,
          },
          {
            label: 'Save',
            icon: CheckCircleIcon,
            iconPosition: 'after',
            variant: 'primary',
            type: 'submit',
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
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const model = defineModel();
const props = defineProps({
  fields: {
    type: Array,
    required: true,
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

// Emit form data back to parent on save
const emit = defineEmits(["submit", "cancel", "update:modelValue"]);

const cancelEdit = () => {
  emit("cancel");
};

const submitForm = () => {
  emit("submit");
  emit("update:modelValue", model.value);
};
</script>
