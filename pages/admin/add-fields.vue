<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Manage Fields by Organization</h1>

    <!-- Feedback -->
    <div v-if="feedback" class="mb-4 text-blue-500">{{ feedback }}</div>

    <!-- Select Organization -->
    <div class="mb-6">
      <label for="organization" class="block font-semibold mb-2"
        >Select Organization</label
      >
      <select
        id="organization"
        v-model="selectedOrganization.id"
        class="border rounded p-2 w-full"
        @change="
          selectedOrganization.name =
            organizations.find((o) => o.id === selectedOrganization.id)?.name ||
            null
        "
      >
        <option value="" disabled>Select an organization</option>
        <option
          v-for="organization in organizations"
          :key="organization.id"
          :value="organization.id"
        >
          {{ organization.name }}
        </option>
      </select>
    </div>

    <!-- Select Collection -->
    <div v-if="selectedOrganization.id" class="mb-6">
      <label for="collection" class="block font-semibold mb-2"
        >Select Collection</label
      >
      <select
        id="collection"
        v-model="selectedCollection.id"
        class="border rounded p-2 w-full"
        @change="
          selectedCollection.name =
            collections.find((c) => c.id === selectedCollection.id)?.name ||
            null
        "
      >
        <option value="" disabled>Select a collection</option>
        <option
          v-for="collection in collections"
          :key="collection.id"
          :value="collection.id"
        >
          {{ collection.name }}
        </option>
      </select>
    </div>

    <!-- Display Existing Fields -->
    <div v-if="selectedCollection.id" class="mb-6">
      <h2 class="text-xl font-semibold mb-4">
        Existing Fields for "{{ selectedCollection.name }}"
      </h2>
      <ul>
        <li v-for="field in existingFields" :key="field.id" class="mb-2">
          <strong>{{ field.name }}</strong> ({{ field.type }}) - Required:
          {{ field.is_required ? "Yes" : "No" }}
        </li>
      </ul>
    </div>

    <!-- Add New Field -->
    <h2 v-if="selectedCollection.id" class="text-xl font-semibold mb-4">
      Add New Field
    </h2>
    <div v-if="selectedCollection.id" class="mb-4">
      <label for="field-name" class="block font-semibold mb-2"
        >Field Name</label
      >
      <input
        id="field-name"
        v-model="newField.name"
        class="border rounded p-2 w-full"
        placeholder="Enter field name"
      />
    </div>
    <div v-if="selectedCollection.id" class="mb-4">
      <label for="field-type" class="block font-semibold mb-2"
        >Field Type</label
      >
      <select
        id="field-type"
        v-model="newField.type"
        class="border rounded p-2 w-full"
      >
        <option v-for="type in fieldTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>
    <div v-if="selectedCollection.id" class="mb-4">
      <label for="is-required" class="block font-semibold mb-2">Required</label>
      <input type="checkbox" id="is-required" v-model="newField.is_required" />
      <label for="is-required" class="ml-2">Mark as required</label>
    </div>
    <div v-if="selectedCollection.id" class="mb-4">
      <label for="default-value" class="block font-semibold mb-2"
        >Default Value (Optional)</label
      >
      <input
        id="default-value"
        v-model="newField.default_value"
        class="border rounded p-2 w-full"
        placeholder="Enter default value"
      />
    </div>
    <button
      v-if="selectedCollection.id"
      @click="addField"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      :disabled="!selectedCollection.id || isLoading"
    >
      Add Field
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";

// Supabase client
const { $supabase } = useNuxtApp();

// State
const organizations = ref<Array<{ id: string; name: string }>>([]); // List of organizations
const selectedOrganization = reactive<{
  id: string | null;
  name: string | null;
}>({
  id: null,
  name: null,
});

const collections = ref<Array<{ id: number; name: string }>>([]); // Collections for the selected organization
const selectedCollection = reactive<{ id: number | null; name: string | null }>(
  {
    id: null,
    name: null,
  }
);
const existingFields = ref<
  Array<{
    id: number;
    name: string;
    type: string;
    is_required: boolean;
    default_value: string | null;
  }>
>([]); // Fields for the selected collection
const newField = reactive({
  name: "",
  type: "text", // Default type
  is_required: false,
  default_value: null as string | null,
});
const fieldTypes = ref(["text", "number", "date", "boolean"]); // Supported field types
const feedback = ref<string | null>(null); // Feedback for success/errors
const isLoading = ref(false);

// Fetch organizations on page load
onMounted(async () => {
  try {
    const { data, error } = await $supabase
      .from("organizations")
      .select("id, name");
    if (error) throw error;

    organizations.value = data || [];
  } catch (err) {
    console.error("[Manage Fields] Failed to fetch organizations:", err);
    feedback.value = "Failed to load organizations.";
  }
});

// Fetch collections for the selected organization
watch(
  () => selectedOrganization.id,
  async (newId) => {
    if (!newId) return;

    isLoading.value = true;

    try {
      const { data, error } = await $supabase
        .from("collections")
        .select("id, name")
        .eq("organization_id", newId);

      if (error) throw error;

      collections.value = data || [];
      selectedCollection.id = null; // Reset selected collection
      selectedCollection.name = null;
      existingFields.value = []; // Clear fields
    } catch (err) {
      console.error("[Manage Fields] Failed to fetch collections:", err);
      feedback.value = "Failed to load collections.";
    } finally {
      isLoading.value = false;
    }
  }
);

// Fetch fields for the selected collection
watch(
  () => selectedCollection.id,
  async (newId) => {
    if (!newId) return;

    isLoading.value = true;

    try {
      const { data, error } = await $supabase
        .from("fields")
        .select("id, name, type, is_required, default_value")
        .eq("collection_id", newId);

      if (error) throw error;

      existingFields.value = data || [];
    } catch (err) {
      console.error("[Manage Fields] Failed to fetch fields:", err);
      feedback.value = "Failed to load fields for the selected collection.";
    } finally {
      isLoading.value = false;
    }
  }
);

// Add a new field to the selected collection
const addField = async () => {
  if (!selectedCollection.id || !newField.name || !newField.type) {
    feedback.value = "Please fill in all required fields.";
    return;
  }

  isLoading.value = true;

  try {
    const { error } = await $supabase.from("fields").insert({
      collection_id: selectedCollection.id,
      name: newField.name,
      type: newField.type,
      is_required: newField.is_required,
      default_value: newField.default_value,
      created_at: new Date(),
    });

    if (error) throw error;

    feedback.value = `Field "${newField.name}" added successfully!`;

    // Clear the form
    newField.name = "";
    newField.type = "text";
    newField.is_required = false;
    newField.default_value = null;

    // Refresh the existing fields
    const { data, error: fieldsError } = await $supabase
      .from("fields")
      .select("id, name, type, is_required, default_value")
      .eq("collection_id", selectedCollection.id);

    if (fieldsError) throw fieldsError;

    existingFields.value = data || [];
  } catch (err) {
    console.error("[Manage Fields] Failed to add field:", err);
    feedback.value = "Failed to add field. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
