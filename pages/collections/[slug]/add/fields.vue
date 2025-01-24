<!-- 
  Developer Note:
  This page allows users to manage collections, including:
  - Updating collection metadata (e.g., name, slug, description).
  - Adding new fields to the collection.
  - Editing existing fields in the collection.
-->

<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader :title="`Adding Fields: ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <form v-if="!isLoading" novalidate @submit.prevent="saveChanges">
      <div
        class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6"
      >
        <div class="p-2 sm:p-4">
          <!-- Editable Fields Table -->
          <div class="p-2 sm:p-4">
            <div
              class="grid grid-cols-[2fr,1fr,2fr,1fr,1fr] gap-4 text-sm font-semibold text-gray-700 border-b border-gray-300 dark:border-gray-600 pb-2 mb-6"
            >
              <div>Field Name</div>
              <div>Type</div>
              <div>Options</div>
              <div>Position</div>
              <div>Required</div>
            </div>
            <div
              v-for="(field, index) in fields"
              :key="field.key"
              class="grid grid-cols-[2fr,1fr,2fr,1fr,1fr] gap-4 items-start py-2"
            >
              <!-- Field Name -->
              <div class="mb-2">
                <input
                  v-model="field.name"
                  type="text"
                  placeholder="Field Name"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <!-- Type -->
              <div class="mb-2">
                <CustomSelect
                  v-model="field.type"
                  :options="fieldOptions"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
                />
              </div>

              <!-- Options -->
              <div class="mb-2">
                <textarea
                  v-if="field.type === 'select'"
                  v-model="field.optionsString"
                  placeholder="Comma-separated values"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
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
                  class="h-4 w-4 text-violet-500 border-gray-500 rounded"
                />
              </div>
            </div>

            <!-- Add Field Button -->
            <button
              type="button"
              class="mt-2 ml-3 px-3 py-1 bg-violet-500 text-white text-sm rounded-md"
              @click="addField"
            >
              Add New Field
            </button>
            <!-- Error and Success Messages -->
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
import { useRoute, useRouter } from "vue-router";
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
} from "@heroicons/vue/24/outline";

const notificationStore = useNotificationStore();

const route = useRoute();
const collectionSlug = route.params.slug;

const fieldsStore = useFieldsStore();

const isLoading = computed(() => fieldsStore.isLoading);
const errors = ref([]);
const error = computed(() => fieldsStore.error);
const collectionName = computed(
  () => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)
);

// Editable Fields
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
      // Directly assign the fields fetched from the store
      fields.value = fieldsStore.fields;
    }

    console.log("[Debug] Fields after mapping:", fields.value);
  } catch (err) {
    error.value = "Failed to load fields for collection.";
    console.error(err);
  }
});

const addField = () => {
  fields.value.push({
    key: `new_field_${fields.value.length}`,
    name: "New Field",
    type: "select",
    position: fields.value.length + 1,
    is_required: false,
    options: [],
    optionsString: "",
  });
};

const saveChanges = async () => {
  // Reset errors
  errors.value = "";

  if (hasInvalidFieldNames()) {
    handleError(
      "Please rename all fields with the default name ('New Field') before saving."
    );
    return;
  }

  const { updatedFields, newFieldsToInsert } = splitFields(fields.value);

  try {
    const messages = [];

    if (updatedFields.length) {
      const updateSuccess = await updateExistingFields(updatedFields);
      if (updateSuccess) messages.push("Field(s) updated successfully.");
    }

    if (newFieldsToInsert.length) {
      const insertSuccess = await insertNewFields(newFieldsToInsert);
      if (insertSuccess) messages.push("New field(s) added successfully.");
    }

    showSuccessNotification(messages);
  } catch (err) {
    console.error("Failed to update collection fields:", err);
    handleError("Failed to update or add collection fields.");
  }
};

const handleError = (message) => {
  notificationStore.showNotification("error", message);
  errors.value = message;
};

const hasInvalidFieldNames = () => {
  return fields.value.some(
    (field) => field.name === "New Field" || field.name.trim() === ""
  );
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

  console.log("New fields to insert:", updatedNewFields);

  return {
    updatedFields: existingFields.map((field) => ({
      ...field,
      options:
        field.type === "select" && field.optionsString // Convert optionsString for 'select' fields
          ? handleOptions(field.optionsString)
          : field.options,
    })),
    newFieldsToInsert: updatedNewFields,
  };
};

const handleOptions = (options) => {
  if (!options) return null; // Return null if no options provided

  if (typeof options === "string") {
    // Convert comma-separated string into an array of objects
    return options.split(",").map((opt) => ({
      label: opt.trim(),
      value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
    }));
  }

  // Ensure options is returned as an array if it's already in the correct format
  return Array.isArray(options) ? options : [];
};

const updateExistingFields = async (fields) => {
  try {
    console.log("Updating fields:", fields);

    // Send the fields directly to Supabase
    const { error } = await fieldsStore.updateCollectionFields(
      collectionSlug,
      fields.map((field) => ({
        ...field,
        options: Array.isArray(field.options) ? field.options : [], // Ensure options is an array
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
    console.log("Fields to insert:", fields);

    const fieldsToInsert = fields.map((field) => {
      const { key, optionsString, ...fieldWithoutKeyAndOptionsString } = field; // Exclude `key` and `optionsString`

      return {
        ...fieldWithoutKeyAndOptionsString,
        options: Array.isArray(field.options) ? field.options : [], // Ensure options is an array
        collection_id: collectionData.id, // Ensure collection_id is added
      };
    });

    console.log("Prepared fields for insertion:", fieldsToInsert);

    const insertSuccess = await fieldsStore.addNewCollectionFields(
      collectionSlug,
      fieldsToInsert
    );

    if (insertSuccess) {
      console.log("New fields added successfully!");
    } else {
      throw new Error("Failed to insert new fields.");
    }

    return true;
  } catch (err) {
    console.error("Failed to insert new fields:", err);
    return false;
  }
};

const showSuccessNotification = (messages) => {
  const finalMessage = messages.length
    ? messages.join(" ")
    : "Fields updated successfully.";
  notificationStore.showNotification("success", finalMessage);
};

// Cancel changes
const cancelChanges = () => {
  navigateTo({
    path: `/collections/`,
  });
};
</script>
