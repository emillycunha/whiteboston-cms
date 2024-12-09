<!-- pages/posts/[id]/edit.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";

const route = useRoute();
console.log(route.params.id);

const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const title = ref<string>("");
const category = ref<string | null>(null);
const tags = ref<string | null>(null);
const content_md = ref<string>("");

onMounted(async () => {
  const idParam = route.params.id;

  // Validate that 'id' exists and is a string
  if (typeof idParam !== "string") {
    error.value = "Invalid blog ID.";
    isLoading.value = false;
    return;
  }

  const blogId = Number(idParam);

  if (isNaN(blogId)) {
    error.value = "Invalid blog ID.";
    isLoading.value = false;
    return;
  }

  try {
    blog.value = await blogsStore.fetchBlogById(blogId);
    if (blog.value) {
      title.value = blog.value.title;
      category.value = blog.value.category
        ? blog.value.category.join(", ")
        : null;
      content_md.value = blog.value.content_md;
    } else {
      error.value = "Blog not found.";
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
  } finally {
    isLoading.value = false;
  }
});

async function saveBlog() {
  if (!blog.value) return;

  // Implement the save logic, e.g., updating the blog in Supabase
  try {
    const updatedBlog = await blogsStore.updateBlog({
      id: blog.value.id,
      title: title.value,
      category: blog.value.category || null,
      content_md: content_md.value,
    });

    if (updatedBlog) {
      alert("Blog updated successfully!");
      navigateTo(`/posts/${updatedBlog.id}/view`);
    }
  } catch (e) {
    alert("Failed to update blog.");
    console.error("Update Error:", e);
  }
}
</script>

<template>
  <div class="p-4 sm:p-6">
    <div v-if="isLoading">Loading blog...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="blog">
      <h1 class="text-3xl font-bold mb-4">Edit Blog: {{ blog.title }}</h1>
      <form @submit.prevent="saveBlog">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            v-model="title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Category</label
          >
          <input
            type="text"
            v-model="category"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            v-model="content_md"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            rows="10"
          ></textarea>
        </div>
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </form>
    </div>
    <div v-else>
      <p>Blog not found.</p>
    </div>
  </div>
</template>
