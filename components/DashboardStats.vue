<template>
  <div class="grow">
    <div class="bg-white dark:bg-slate-800 p-4 shadow rounded-md flex items-center justify-between">
      <div>
        <h2 class="text-gray-700 dark:text-white capitalize">{{ collectionName }}</h2>
        <p class="text-2xl text-gray-700 font-bold dark:text-white">{{ count }}</p>
      </div>
      <div class="bg-violet-500 text-white p-2 w-12 h-12 rounded flex items-center justify-center">
        <!-- Dynamic Icon -->
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCollectionsStore } from "~/stores/collections";
import { getIconForSlug } from "@/utils/iconMappings";

const props = defineProps({
  collectionSlug: {
    type: String,
    required: true,
  },
});

const collectionsStore = useCollectionsStore();
const contentStore = useContentStore();
const count = ref(0);

// Compute a human-readable name for the collection
const collectionName = computed(() => {
  return props.collectionSlug.replace("-", " ");
});

// Dynamic Icon Assignment
const icon = computed(() => {
  const slug = props.collectionSlug;
  return getIconForSlug(slug);
});

// Fetch count for the collection
onMounted(async () => {
  await collectionsStore.fetchCollectionsForCurrentOrg();
  const collection = collectionsStore.collections.find((col) => col.slug === props.collectionSlug);

  if (collection) {
    // Fetch content count
    const contentCount = await contentStore.fetchContentCount(collection.id);
    count.value = contentCount || 0;
  }
});
</script>
