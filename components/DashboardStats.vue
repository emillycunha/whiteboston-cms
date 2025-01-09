<template>
  <div class="grow">
    <div
      class="bg-white p-4 shadow rounded-md flex items-center justify-between"
    >
      <div>
        <h2 class="text-gray-600 capitalize">{{ collectionName }}</h2>
        <p class="text-2xl font-bold">{{ count }}</p>
      </div>
      <div
        class="bg-violet-500 text-white p-2 w-12 h-12 rounded flex items-center justify-center"
      >
        <!-- Dynamic Icon -->
        <component :is="icon" class="w-6 h-6"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useCollectionsStore } from "~/stores/collections";

// Import Heroicons or any other icon library
import {
  UsersIcon,
  DocumentIcon,
  FolderIcon,
  QueueListIcon,
  ShoppingCartIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  FolderPlusIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  collectionSlug: {
    type: String,
    required: true,
  },
});

const collectionsStore = useCollectionsStore();
const count = ref(0);

// Compute a human-readable name for the collection
const collectionName = computed(() => {
  return props.collectionSlug.replace("-", " ");
});

// Determine the appropriate icon based on the collection slug
const icon = computed(() => {
  const slug = props.collectionSlug.toLowerCase();

  if (["blogs", "posts", "blog", "post"].includes(slug)) {
    return ChatBubbleLeftIcon; // Chat or Comment Icon
  } else if (["leads", "contacts", "lead", "contact"].includes(slug)) {
    return UsersIcon; // User or Contact Icon
  } else if (["tasks", "lists", "task", "list"].includes(slug)) {
    return QueueListIcon; // Task or Checklist Icon
  } else if (["reviews", "feedback", "review"].includes(slug)) {
    return StarIcon; // Star Icon for Reviews
  } else if (["products", "items", "product", "item"].includes(slug)) {
    return ShoppingCartIcon; // Shopping Cart Icon for Products
  } else if (["files", "documents", "file", "document"].includes(slug)) {
    return DocumentIcon; // Document Icon for Files
  } else if (["calendar", "events", "schedule", "event"].includes(slug)) {
    return CalendarIcon; // Calendar Icon for Events
  } else {
    return FolderIcon; // Default Folder Icon
  }
});

// Fetch count for the collection
onMounted(async () => {
  await collectionsStore.fetchCollectionsForCurrentOrg();
  const collection = collectionsStore.collections.find(
    (col) => col.slug === props.collectionSlug
  );

  if (collection) {
    // Fetch content count
    const contentCount = await collectionsStore.fetchContentCount(
      collection.id
    );
    count.value = contentCount || 0;
  }
});
</script>
