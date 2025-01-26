<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader
      :title="`Adding Fields: ${collectionName}`"
      :buttons="[
        {
          label: 'Manage Collections',
          icon: Cog6ToothIcon,
          iconPosition: 'after',
          variant: 'secondary',
          requiredRole: ['admin', ''],
          onClick: manageCollections,
        },
        {
          label: 'Add Field',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          requiredRole: ['admin', ''],
          onClick: addField,
        },
      ]"
    />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>

    <form v-if="!isLoading" novalidate @submit.prevent="saveChanges">
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-2 sm:p-4">
          <!-- Editable Fields Table -->
          <div class="p-2 sm:p-4">
            <div
              class="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-700 border-b border-gray-300 dark:border-gray-600 pb-2 mb-6"
            >
              <div class="col-span-2">Field Name</div>
              <div class="col-span-2">Type</div>
              <div>Position</div>
              <div class="text-center">Required</div>
            </div>
            <div
              v-for="(field, index) in fields"
              :key="field.key"
              class="grid grid-cols-6 gap-4 items-start py-2"
            >
              <!-- Field Name -->
              <div class="col-span-2 mb-2">
                <input
                  v-model="field.name"
                  type="text"
                  placeholder="Field Name"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <!-- Type -->
              <div class="col-span-2 mb-2">
                <CustomSelect
                  v-model="field.type"
                  :options="fieldOptions"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
                />

                <textarea
                  v-if="field.type === 'select'"
                  v-model="field.optionsString"
                  placeholder="Comma-separated values"
                  class="mt-2 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                ></textarea>
              </div>

              <!-- Position -->
              <div class="mb-2">
                <input
                  v-model="field.position"
                  type="number"
                  placeholder="Position"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <!-- Required -->
              <div class="flex items-center justify-center space-x-2">
                <input
                  v-model="field.is_required"
                  type="checkbox"
                  class="h-4 w-4 accent-violet-500 dark:accent-teal-500"
                />
              </div>
            </div>

            <!-- Add Field Button -->
            <button
              type="button"
              class="mt-2 ml-3 px-3 py-1 bg-violet-500 text-white text-sm rounded-md"
              @click="addField"
            >
              Add New Field -- DELETE THIS BUTTON
            </button>
            <!-- Error -->
            <div>
              <div v-if="errors.length" class="mt-4 p-2 text-red-500 text-sm">
                {{ errors }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <PageFooter
        title=""
        :buttons="[
          {
            label: 'Cancel',
            icon: XCircleIcon,
            iconPosition: 'after',
            variant: 'secondary',
            onClick: cancelChanges,
            type: 'button',
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useFieldsStore } from "~/stores/fields";

import {
  XCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  BoldIcon,
  HashtagIcon,
  CalendarIcon,
  QueueListIcon,
  StopIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
  PlusIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

const notificationStore = useNotificationStore();

const route = useRoute();
const fieldsStore = useFieldsStore();
const collectionSlug = route.params.slug;
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

const isLoading = computed(() => fieldsStore.isLoading);
const errors = ref([]);

const fields = ref([]);
const collectionData = ref("");

// Define the available options for the custom dropdown
const fieldOptions = [
  { label: "Text", icon: BoldIcon, value: "text" },
  { label: "Number", icon: HashtagIcon, value: "number" },
  { label: "Date", icon: CalendarIcon, value: "date" },
  { label: "Image", icon: PhotoIcon, value: "image" },
  { label: "Email", icon: EnvelopeIcon, value: "email" },
  { label: "Phone", icon: PhoneIcon, value: "phone" },
  { label: "Select", icon: QueueListIcon, value: "select" },
  { label: "Boolean", icon: StopIcon, value: "boolean" },
  { label: "Textarea", icon: DocumentTextIcon, value: "textarea" },
  { label: "Rich Text (HTML)", icon: PencilSquareIcon, value: "richtexthtml" },
  {
    label: "Rich Text (Markdown)",
    icon: PencilSquareIcon,
    value: "richtextmarkdown",
  },
];

onMounted(async () => {
  try {
    await fieldsStore.fetchCollectionFields(collectionSlug);

    // Check if fields are available or need to be initialized
    if (fieldsStore.fields.length === 0) {
      fields.value.push({
        key: "new_field_1",
        name: "New Field",
        type: "text",
        position: 1,
        is_required: false,
        options: [],
        optionsString: "",
      });
    } else {
      fields.value = fieldsStore.fields;
    }
  } catch (err) {
    const errorMessage = "Failed to load fields for collection.";
    console.error("[Mounted] Error:", err);
    notificationStore.showNotification(NotificationType.Error, errorMessage);
  }
});

const addField = () => {
  fields.value.push({
    key: `new_field_${fields.value.length}`,
    name: "New Field",
    type: "text",
    position: fields.value.length + 1,
    is_required: false,
    options: [],
    optionsString: "",
  });
};

const saveChanges = async () => {
  errors.value = "";

  if (fieldsHaveInvalidNames()) {
    errors.value =
      "Please rename all fields with the default name ('New Field') before saving.";
    showErrorNotification(errors.value);
    return;
  }

  const { updatedFields, newFieldsToInsert } = splitFields(fields.value);

  if (updatedFields.length) {
    await updateExistingFields(updatedFields);
  }

  if (newFieldsToInsert.length) {
    await insertNewFields(newFieldsToInsert);
  }
};

const fieldsHaveInvalidNames = () => {
  let hasErrors = false;

  fields.value = fields.value.map((field) => {
    if (field.name === "New Field" || field.name.trim() === "") {
      hasErrors = true;
      return { ...field, error: "Please rename this field." };
    } else {
      return { ...field, error: null }; // Clear previous errors
    }
  });

  return hasErrors;
};

const splitFields = (fields) => {
  const newFields = fields.filter((field) => !field.id);
  const existingFields = fields.filter((field) => field.id);

  const updatedNewFields = newFields.map((field) => ({
    ...field,
    options:
      field.type === "select" && field.optionsString
        ? handleOptions(field.optionsString)
        : [],
  }));

  return {
    updatedFields: existingFields.map((field) => ({
      ...field,
      options:
        field.type === "select" && field.optionsString
          ? handleOptions(field.optionsString)
          : field.options,
    })),
    newFieldsToInsert: updatedNewFields,
  };
};

const handleOptions = (options) => {
  if (!options) return null;

  if (typeof options === "string") {
    return options.split(",").map((opt) => ({
      label: opt.trim(),
      value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
    }));
  }
  return Array.isArray(options) ? options : [];
};

const updateExistingFields = async (fields) => {
  try {
    const { error } = await fieldsStore.updateCollectionFields(
      collectionSlug,
      fields.map((field) => ({
        ...field,
        options: Array.isArray(field.options) ? field.options : [],
      }))
    );

    if (error) throw error;

    return true;
  } catch (err) {
    console.error("Failed to update existing fields:", err);
    return false;
  }
};

const insertNewFields = async (fields) => {
  try {
    const fieldsToInsert = fields.map((field) => {
      const { key, optionsString, ...fieldWithoutKeyAndOptionsString } = field;

      return {
        ...fieldWithoutKeyAndOptionsString,
        options: Array.isArray(field.options) ? field.options : [],
        collection_id: collectionData.id,
      };
    });

    const insertSuccess = await fieldsStore.addNewCollectionFields(
      collectionSlug,
      fieldsToInsert
    );

    return insertSuccess;
  } catch (err) {
    console.error("Failed to insert new fields:", err.message || err);
    return false;
  }
};

const cancelChanges = () => {
  navigateTo({
    path: `/collections/`,
  });
};

const manageCollections = () => {
  navigateTo({ path: "/collections" });
};
</script>
