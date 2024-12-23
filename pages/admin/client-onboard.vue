<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Client Onboarding</h1>

    <!-- Feedback -->
    <div v-if="feedback" class="mb-4 text-blue-500">{{ feedback }}</div>

    <!-- Select Client -->
    <div class="mb-6">
      <label for="client" class="block font-semibold mb-2"
        >Select Client Organization</label
      >
      <select
        id="client"
        v-model="selectedClientId"
        class="border rounded p-2 w-full"
        @change="
          selectedClientName =
            clients.find((client) => client.id === selectedClientId)?.name ||
            null
        "
      >
        <option value="" disabled>Select a client</option>
        <option v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>

    <!-- Add Default Collections and Fields -->
    <button
      @click="addDefaultCollections"
      class="bg-green-500 text-white px-4 py-2 rounded mb-6"
      :disabled="!selectedClientId || isLoading"
    >
      Add Default Collections and Fields
    </button>

    <!-- Add Custom Collection -->
    <h2 class="text-xl font-bold mb-4">Add Custom Fields</h2>
    <div v-for="(field, index) in customFields" :key="index" class="mb-4">
      <label class="block font-semibold mb-2">Field Name</label>
      <input
        v-model="field.name"
        class="border rounded p-2 w-full"
        placeholder="Enter field name"
      />
      <label class="block font-semibold mb-2">Field Type</label>
      <select v-model="field.type" class="border rounded p-2 w-full">
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="boolean">Boolean</option>
      </select>
      <label class="block font-semibold mb-2">Required</label>
      <input type="checkbox" v-model="field.is_required" />
    </div>
    <button
      @click="
        customFields.push({
          name: '',
          type: 'text',
          is_required: false,
          default_value: null,
        })
      "
      class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
      Add Another Field
    </button>
    <button
      @click="addCustomCollectionWithFields"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      :disabled="!selectedClientId || isLoading"
    >
      Add Custom Collection with Fields
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// Supabase client
const { $supabase } = useNuxtApp();

// State
const clients = ref<Array<{ id: string; name: string }>>([]); // List of organizations
const selectedClientId = ref<string | null>(null); // Selected organization ID
const selectedClientName = ref<string | null>(null); // Selected organization name
const defaultCollectionsWithFields = reactive([
  {
    name: "Posts",
    slug: "posts",
    description: "Default collection for posts",
    fields: [
      { name: "Title", type: "text", is_required: true, default_value: null },
      {
        name: "Content",
        type: "text",
        is_required: false,
        default_value: null,
      },
      {
        name: "Published Date",
        type: "date",
        is_required: false,
        default_value: null,
      },
    ],
  },
  {
    name: "Contacts",
    slug: "contacts",
    description: "Default collection for contacts",
    fields: [
      {
        name: "First Name",
        type: "text",
        is_required: true,
        default_value: null,
      },
      {
        name: "Last Name",
        type: "text",
        is_required: true,
        default_value: null,
      },
      { name: "Email", type: "text", is_required: true, default_value: null },
      {
        name: "Phone Number",
        type: "text",
        is_required: false,
        default_value: null,
      },
    ],
  },
  {
    name: "Leads",
    slug: "leads",
    description: "Default collection for leads",
    fields: [
      { name: "Name", type: "text", is_required: true, default_value: null },
      { name: "Email", type: "text", is_required: false, default_value: null },
      { name: "Status", type: "text", is_required: false, default_value: null },
    ],
  },
  {
    name: "Tasks",
    slug: "tasks",
    description: "Default collection for tasks",
    fields: [
      {
        name: "Task Name",
        type: "text",
        is_required: true,
        default_value: null,
      },
      {
        name: "Due Date",
        type: "date",
        is_required: false,
        default_value: null,
      },
      {
        name: "Completed",
        type: "boolean",
        is_required: false,
        default_value: "false",
      },
    ],
  },
]);
const customCollection = reactive({
  name: "",
  slug: "",
  description: "",
});
const customFields = reactive<
  Array<{
    name: string;
    type: string;
    is_required: boolean;
    default_value: string | null;
  }>
>([{ name: "", type: "text", is_required: false, default_value: null }]);
const feedback = ref<string | null>(null); // Feedback message
const isLoading = ref(false);

// Fetch organizations on page load
onMounted(async () => {
  try {
    const { data, error } = await $supabase
      .from("organizations")
      .select("id, name");

    if (error) throw error;

    clients.value = data || [];
  } catch (err) {
    console.error("[Onboarding Page] Failed to fetch organizations:", err);
    feedback.value = "Failed to load organizations.";
  }
});

// Add default collections and their fields
const addDefaultCollections = async () => {
  if (!selectedClientId.value) {
    feedback.value = "Please select a client.";
    return;
  }

  isLoading.value = true;

  try {
    // Step 1: Insert default collections
    const collectionInserts = defaultCollectionsWithFields.map(
      (collection) => ({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        organization_id: selectedClientId.value,
        created_at: new Date(),
      })
    );

    const { data: insertedCollections, error: collectionError } =
      await $supabase
        .from("collections")
        .insert(collectionInserts)
        .select("id, slug");

    if (collectionError) throw collectionError;

    // Step 2: Insert fields for each collection
    const fieldInserts: Array<{
      collection_id: number;
      name: string;
      type: string;
      is_required: boolean;
      default_value: string | null;
      created_at: Date;
    }> = [];
    insertedCollections.forEach((collection) => {
      const fields = defaultCollectionsWithFields.find(
        (item) => item.slug === collection.slug
      )?.fields;
      if (fields) {
        fields.forEach((field) => {
          fieldInserts.push({
            collection_id: collection.id,
            name: field.name,
            type: field.type,
            is_required: field.is_required,
            default_value: field.default_value,
            created_at: new Date(),
          });
        });
      }
    });

    const { error: fieldsError } = await $supabase
      .from("fields")
      .insert(fieldInserts);
    if (fieldsError) throw fieldsError;

    feedback.value = "Default collections and fields added successfully!";
  } catch (err) {
    console.error(
      "[Onboarding Page] Failed to add default collections and fields:",
      err
    );
    feedback.value = "Failed to add default collections and fields.";
  } finally {
    isLoading.value = false;
  }
};

// Add a custom collection and its fields
const addCustomCollectionWithFields = async () => {
  if (
    !selectedClientId.value ||
    !customCollection.name ||
    !customCollection.slug
  ) {
    feedback.value = "Please fill in all required fields and select a client.";
    return;
  }

  isLoading.value = true;

  try {
    // Step 1: Insert custom collection
    const { data: insertedCollection, error: collectionError } = await $supabase
      .from("collections")
      .insert({
        name: customCollection.name,
        slug: customCollection.slug,
        description: customCollection.description,
        organization_id: selectedClientId.value,
        created_at: new Date(),
      })
      .select("id")
      .single();

    if (collectionError) throw collectionError;

    // Step 2: Insert fields for the custom collection
    const fieldInserts = customFields.map((field) => ({
      collection_id: insertedCollection.id,
      name: field.name,
      type: field.type,
      is_required: field.is_required,
      default_value: field.default_value,
      created_at: new Date(),
    }));

    const { error: fieldsError } = await $supabase
      .from("fields")
      .insert(fieldInserts);
    if (fieldsError) throw fieldsError;

    feedback.value = `Collection "${customCollection.name}" and fields added successfully!`;
    customCollection.name = "";
    customCollection.slug = "";
    customCollection.description = "";
    customFields.splice(0, customFields.length, {
      name: "",
      type: "text",
      is_required: false,
      default_value: null,
    });
  } catch (err) {
    console.error(
      "[Onboarding Page] Failed to add custom collection and fields:",
      err
    );
    feedback.value = "Failed to add custom collection and fields.";
  } finally {
    isLoading.value = false;
  }
};
</script>
