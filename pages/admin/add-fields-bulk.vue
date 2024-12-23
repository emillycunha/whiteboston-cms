<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Add Multiple Fields</h2>

    <!-- Dynamic Field Form -->
    <div v-for="(field, index) in newFields" :key="index" class="mb-4">
      <div class="flex items-center gap-4">
        <input
          v-model="field.name"
          class="border rounded p-2 flex-1"
          placeholder="Field Name"
        />
        <select v-model="field.type" class="border rounded p-2">
          <option v-for="type in fieldTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="field.is_required" />
          Required
        </label>
        <button @click="removeFieldRow(index)" class="text-red-500">
          Remove
        </button>
      </div>
      <input
        v-model="field.default_value"
        class="border rounded p-2 w-full mt-2"
        placeholder="Default Value (Optional)"
      />
    </div>

    <!-- Add Row Button -->
    <button
      @click="addFieldRow"
      class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
    >
      Add Another Field
    </button>

    <!-- Submit Button -->
    <button
      @click="addFields(selectedCollection.id)"
      class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      :disabled="isLoading"
    >
      Add Fields
    </button>

    <!-- Feedback -->
    <div v-if="feedback" class="text-blue-500 mt-4">{{ feedback }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

// Supabase client
const { $supabase } = useNuxtApp();

// State for the dynamic form
const newFields = ref<
  Array<{
    name: string;
    type: string;
    is_required: boolean;
    default_value: string | null;
  }>
>([{ name: "", type: "text", is_required: false, default_value: null }]);

const fieldTypes = ref(["text", "number", "date", "boolean"]); // Supported field types
const feedback = ref<string | null>(null); // Feedback message
const isLoading = ref(false);

// Add a new empty field to the form
const addFieldRow = () => {
  newFields.value.push({
    name: "",
    type: "text",
    is_required: false,
    default_value: null,
  });
};

// Remove a specific field row
const removeFieldRow = (index: number) => {
  newFields.value.splice(index, 1);
};

// Submit all fields to the database
const addFields = async (collectionId: number) => {
  if (!collectionId || newFields.value.length === 0) {
    feedback.value = "Please add at least one field.";
    return;
  }

  isLoading.value = true;

  try {
    const formattedFields = newFields.value.map((field) => ({
      collection_id: collectionId,
      name: field.name,
      type: field.type,
      is_required: field.is_required,
      default_value: field.default_value,
      created_at: new Date(),
    }));

    const { error } = await $supabase.from("fields").insert(formattedFields);

    if (error) throw error;

    feedback.value = "Fields added successfully!";
    newFields.value = [
      { name: "", type: "text", is_required: false, default_value: null },
    ]; // Reset form
  } catch (err) {
    console.error("[Add Fields] Failed to add fields:", err);
    feedback.value = "Failed to add fields. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
