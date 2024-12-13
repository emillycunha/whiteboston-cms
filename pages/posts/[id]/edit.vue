<!-- pages/posts/[id]/edit.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";

import { EyeIcon, ChevronLeftIcon } from "@heroicons/vue/24/solid";

const route = useRoute();
console.log(route.params.id);

const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const title = ref<string>("");
const category = ref<string | null>(null);
const tags = ref<string | null>(null);
const description = ref<string | null>(null);
const content_md = ref<string>("");
const slug = ref<string | null>(null);

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
      tags.value = blog.value.tags ? blog.value.tags.join(", ") : null;
      description.value = blog.value.description;
      slug.value = blog.value.slug;
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

  // Implement the save logic, e.g., updating the blog in the database
  try {
    const updatedBlog = await blogsStore.updateBlog({
      id: blog.value.id,
      title: title.value,
      category: blog.value.category || null,
      tags: blog.value.tags || null,
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
  <div class="p-2 sm:p-6 space-y-10">
    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between mb-4">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Editing Posts
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ChevronLeftIcon class="mr-2 w-5 h-5" />
          Back
        </button>
        <a
          href="/posts/add-post"
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          Preview Blog
          <EyeIcon class="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>

    <div v-if="isLoading">Loading blog...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="blog">
      <form @submit.prevent="saveBlog">
        <div
          class="space-y-12 mt-3 sm:mt-4 rounded-lg bg-gray-50 dark:bg-slate-800 p-4 sm:p-8 min-h-[200px] border border-gray-200 dark:border-slate-700 shadow-sm"
        >
          <div
            class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12"
          >
            <!-- Title -->
            <div class="sm:col-span-4">
              <label
                class="block text-base font-medium text-gray-700 dark:text-white"
                >Post Title</label
              >
              <div class="mt-2">
                <input
                  type="text"
                  name="Post-title"
                  id="Post-title"
                  v-model="title"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 text-base mb-1"
                  required
                />
                <span class="text-sm text-gray-500 ml-1">/{{ slug }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="col-span-full">
              <label
                class="block text-base font-medium text-gray-700 dark:text-white"
                >Description</label
              >
              <div class="mt-2">
                <textarea
                  v-model="description"
                  name="Post-description"
                  id="Post-description"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 text-base"
                ></textarea>
              </div>
            </div>

            <!-- Content -->
            <div class="col-span-full">
              <label
                class="block text-base font-medium text-gray-700 dark:text-white"
                >Content</label
              >
              <div class="mt-2">
                <textarea
                  v-model="content_md"
                  id="content"
                  name="content"
                  rows="10"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 text-base"
                ></textarea>
              </div>
            </div>

            <!-- Category -->
            <div class="mb-4 sm:col-span-3">
              <label
                class="block text-base font-medium text-gray-700 dark:text-white"
                >Category</label
              >
              <div class="mt-2">
                <select
                  id="category"
                  name="category"
                  class="block w-full rounded-md border-gray-300 text-sm text-gray-900 focus:ring-violet-600 focus:border-violet-600"
                >
                  <option value="">Select category</option>
                  <option value="tech">Tech</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            <!-- Tags -->
            <div class="sm:col-span-3">
              <label
                for="tags"
                class="block text-base font-medium text-gray-700 dark:text-white"
                >Tags</label
              >
              <div class="mt-2">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  placeholder="e.g., vue, tailwind, Postging"
                  class="block w-full rounded-md border-gray-300 text-sm text-gray-900 focus:ring-violet-600 focus:border-violet-600"
                />
              </div>
              <p class="mt-2 text-sm text-gray-600">
                Separate tags with commas.
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              class="inline-flex items-center rounded-md border border-transparent bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <p>Blog not found.</p>
    </div>
  </div>
</template>
