<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Add Collection</h1>

    <!-- Select Organization -->
    <div class="mb-6">
      <label for="organization" class="block font-semibold mb-2"
        >Select Client Organization</label
      >
      <select
        id="organization"
        v-model="collectionForm.organization_id"
        class="border rounded p-2 w-full"
      >
        <option value="" disabled>Select an organization</option>
        <option v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>

    <!-- Select Standard Collection -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Standard Collections</h2>
      <div
        v-for="collection in standardCollections"
        :key="collection.name"
        class="mb-2"
      >
        <button
          @click="selectStandardCollection(collection)"
          class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          {{ collection.name }}
        </button>
      </div>
    </div>

    <!-- Add Custom Collection -->
    <h2 class="text-xl font-semibold mb-4">Custom Collection</h2>
    <div class="mb-4">
      <label for="name" class="block font-semibold mb-2">Collection Name</label>
      <input
        id="name"
        v-model="collectionForm.name"
        class="border rounded p-2 w-full"
        placeholder="Enter collection name"
      />
    </div>
    <div class="mb-4">
      <label for="slug" class="block font-semibold mb-2">Slug</label>
      <input
        id="slug"
        v-model="collectionForm.slug"
        class="border rounded p-2 w-full"
        placeholder="Slug will auto-generate based on name"
        disabled
      />
    </div>
    <div class="mb-4">
      <label for="description" class="block font-semibold mb-2"
        >Description</label
      >
      <textarea
        id="description"
        v-model="collectionForm.description"
        class="border rounded p-2 w-full"
        placeholder="Enter a description (optional)"
      ></textarea>
    </div>
    <button
      @click="addCollection"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      :disabled="!collectionForm.organization_id || isLoading"
    >
      Add Collection
    </button>
    <!-- Feedback -->
    <div v-if="feedback" class="mt-4 text-blue-500">{{ feedback }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";

// Supabase client
const { $supabase } = useNuxtApp();

// State
const clients = ref<Array<{ id: string; name: string }>>([]); // List of organizations
const collectionForm = reactive({
  name: "",
  slug: "",
  description: "",
  organization_id: null as string | null,
});

const standardCollections = reactive([
  { name: "Blogs", description: "Collection for managing blog posts." },
  { name: "Leads", description: "Collection for managing potential clients." },
]);

const feedback = ref<string | null>(null);
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
    console.error("[Add Collection] Failed to fetch organizations:", err);
    feedback.value = "Failed to load organizations.";
  }
});

// Auto-generate slug based on name
watch(
  () => collectionForm.name,
  (newName) => {
    collectionForm.slug = newName
      ? newName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
          .replace(/^-+|-+$/g, "") // Trim leading and trailing hyphens
      : "";
  }
);

// Add collection to the database
const addCollection = async () => {
  if (
    !collectionForm.organization_id ||
    !collectionForm.name ||
    !collectionForm.slug
  ) {
    feedback.value = "Please fill in all required fields.";
    return;
  }

  isLoading.value = true;

  try {
    const { error } = await $supabase.from("collections").insert({
      name: collectionForm.name,
      slug: collectionForm.slug,
      description: collectionForm.description,
      organization_id: collectionForm.organization_id,
      created_at: new Date(),
    });

    if (error) throw error;

    feedback.value = `Collection "${collectionForm.name}" added successfully!`;
    collectionForm.name = "";
    collectionForm.slug = "";
    collectionForm.description = "";
    collectionForm.organization_id = null;
  } catch (err) {
    console.error("[Add Collection] Failed to add collection:", err);
    feedback.value = "Failed to add collection. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Select a standard collection to prefill the form
const selectStandardCollection = (collection: {
  name: string;
  description: string;
}) => {
  collectionForm.name = collection.name;
  collectionForm.description = collection.description;
};
</script>
