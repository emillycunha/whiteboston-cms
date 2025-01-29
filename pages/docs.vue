<!-- 
  Developer Note:
  This page allows users to manage collections, including:
  - Updating collection metadata (e.g., name, slug, description).
  - Adding new fields to the collection.
  - Editing existing fields in the collection.
-->

<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader :title="`Adding Fields: ${collectionName}`" />

    <div v-if="isLoading" class="text-center">Loading collection fields...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <form v-if="!isLoading" novalidate @submit.prevent="saveChanges">
      <div class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700 mb-6">
        <div class="p-2 sm:p-4">
          <!-- Editable Fields Table -->
          <div class="p-2 sm:p-4">
            <div>
              <table class="w-full text-base table-auto">
                <thead>
                  <tr class="text-left text-gray-700 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    <th v-for="column in columns" :key="column.field" class="px-4 py-2 text-left text-sm font-semibold">
                      {{ column.label }}
                    </th>
                  </tr>
                </thead>
                <tbody class="text-sm text-gray-700 dark:text-gray-100">
                  <tr v-for="(field, index) in fields" :key="field.key">
                    <td v-for="column in columns" :key="column.field" class="px-4 py-2">
                      <template v-if="column.type === 'text'">
                        <input v-model="field[column.field]" type="text" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1" />
                      </template>
                      <template v-if="column.type === 'select'">
                        <CustomSelect v-model="field[column.field]" :options="fieldOptions" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1" />
                      </template>
                      <template v-if="column.field === 'options' && field.type === 'select'">
                        <textarea v-if="field[column.field]" v-model="optionsString" placeholder="Comma-separated values" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"></textarea>
                      </template>
                      <template v-if="column.type === 'number'">
                        <input v-model="field[column.field]" type="number" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1" />
                      </template>
                      <template v-if="column.type === 'checkbox'">
                        <input v-model="field[column.field]" type="checkbox" class="h-4 w-4 text-violet-500 border-gray-500 rounded focus:ring-violet-500 dark:focus:ring-teal-500 dark:text-teal-500" />
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Add Field Button -->
            <button type="button" class="mt-2 ml-3 px-3 py-1 bg-violet-500 text-white text-sm rounded-md" @click="addField">Add New Field</button>
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

import { XCircleIcon, CheckCircleIcon, DocumentTextIcon, BoldIcon, HashtagIcon, CalendarIcon, QueueListIcon, StopIcon, PencilSquareIcon, EnvelopeIcon, PhoneIcon, PhotoIcon } from "@heroicons/vue/24/outline";

const notificationStore = useNotificationStore();

// Route and Router
const route = useRoute();
const collectionSlug = route.params.slug;

// State and Store
const fieldsStore = useFieldsStore();

// Columns configuration
const columns = ref([
  { label: "Field Name", field: "name", type: "text" },
  { label: "Type", field: "type", type: "select" },
  { label: "Options", field: "options", type: "textarea" },
  { label: "Default Value", field: "default_value", type: "text" },
  { label: "Position", field: "position", type: "number" },
  { label: "Required", field: "is_required", type: "checkbox" },
]);

const isLoading = computed(() => fieldsStore.isLoading);
const errors = ref([]);
const error = computed(() => fieldsStore.error);
const collectionName = computed(() => collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1));

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

// Compute optionsString dynamically for any field of type 'textarea' or 'select'
const optionsString = computed(() => {
  const targetFields = fieldsStore.fields.filter((field) => field.type === "textarea" || field.type === "select");

  // Create a string for each field options
  return targetFields
    .map((field) => {
      if (field.options && Array.isArray(field.options)) {
        return `${field.options.map((option) => option.label).join(", ")}`;
      }
    })
    .join("\n");
});

console.log("Options String for textarea/select fields:", optionsString.value); // Check the computed optionsString

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
        options: null,
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
  // Create a new field with default values that are editable by the user
  fields.value.push({
    key: `new_field_${fields.value.length}`,
    name: "New Field", // Default name, can be edited by user
    type: "select", // Default type, can be selected by user
    position: fields.value.length + 1,
    is_required: false, // Default is not required, can be toggled by user
    options: null, // Default options
  });
};

const saveChanges = async () => {
  // Reset errors
  errors.value = "";

  if (hasInvalidFieldNames()) {
    handleError("Please rename all fields with the default name ('New Field') before saving.");
    return;
  }

  const { updatedFields, newFieldsToInsert } = splitFields(fields.value);

  console.log("Updated Fields:", updatedFields); // Log existing fields being updated
  console.log("New Fields to Insert:", newFieldsToInsert); // Log new fields being inserted

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
  return fields.value.some((field) => field.name === "New Field" || field.name.trim() === "");
};

const splitFields = (fields) => {
  const newFields = fields.filter((field) => !field.id);
  const existingFields = fields.filter((field) => field.id);

  // Ensure new fields have a key before insertion
  const updatedNewFields = newFields.map((field, index) => ({
    ...field,
    options: field.type === "select" ? handleOptions(field.options) : null,
  }));

  console.log("New fields to insert:", updatedNewFields);

  return {
    updatedFields: existingFields.map((field) => ({
      ...field,
      options: field.type === "select" ? handleOptions(field.options) : null,
    })),
    newFieldsToInsert: updatedNewFields,
  };
};

const handleOptions = (options) => {
  if (!options) return null;
  return options.split(",").map((opt) => ({
    label: opt.trim(),
    value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
  }));
};

const updateExistingFields = async (fields) => {
  try {
    console.log("Updating fields:", fields); // Log fields to be updated

    const { error } = await fieldsStore.updateCollectionFields(collectionSlug, fields);
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
      const { key, ...fieldWithoutKey } = field;

      return {
        ...fieldWithoutKey,
        collection_id: collectionData.id, // Ensure collection_id is added
      };
    });

    console.log("Fields to insert without 'key' for DB:", fieldsToInsert);

    const insertSuccess = await fieldsStore.addNewCollectionFields(collectionSlug, fieldsToInsert);

    if (insertSuccess) {
      console.log("New fields added successfully!");
    } else {
      console.error("Failed to insert new fields.");
      throw new Error("Failed to insert new fields.");
    }

    return true;
  } catch (err) {
    console.error("Failed to insert new fields:", err);
    return false;
  }
};

const showSuccessNotification = (messages) => {
  const finalMessage = messages.length ? messages.join(" ") : "Fields updated successfully.";
  notificationStore.showNotification("success", finalMessage);
};

watch(
  () => fields.value,
  (newFields) => {
    newFields.forEach((field) => {
      if (field.type === "select") {
        // When field type is 'select', make sure the optionsString field is visible
        console.log(`Field ${field.key} is a select field, showing options`);
      }
    });
  },
  { deep: true } // Watch deeply to detect nested changes
);

// Cancel changes
const cancelChanges = () => {
  navigateTo({
    path: `/collections/`,
  });
};
</script>
