<template>
  <section class="bg-white shadow rounded-md overflow-hidden h-full p-4">
    <div class="">
      <h2 class="mx-4 py-2 border-b border-gray-200 font-bold text-gray-800">
        Recent Posts
      </h2>
      <ul class="mt-2 p-4 space-y-8">
        <li
          v-for="blog in latestBlogs"
          :key="blog.id"
          class="text-sm text-gray-800"
        >
          <div class="flex items-top">
            <div class="mr-4 p-1">
              <ChatBubbleLeftRightIcon class="size-6 text-teal-500" />
            </div>
            <div class="inline-block">
              <span class="font-semibold">{{ blog.title }}</span>
              <span class="mx-2 text-teal-400">•</span>
              <span>{{ blog.description }}</span>
              <span class="mx-2 text-teal-400">•</span>
              <span>{{ formatDate(blog.created_at) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useBlogsStore } from "@/stores/blogs";
import { ChatBubbleLeftRightIcon } from "@heroicons/vue/24/solid";

const blogs = ref([]);

const blogsStore = useBlogsStore();
onMounted(async () => {
  console.log("[Parent] Fetching blogs...");
  if (process.client) {
    await blogsStore.fetchBlogs();
    blogs.value = blogsStore.blogs;
    console.log("[Parent] blogs after fetch:", blogs.value);
  }
});

// Compute the latest 3 leads based on submission date
const latestBlogs = computed(() => {
  return blogs.value
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);
});

// Format date for display
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};
</script>
