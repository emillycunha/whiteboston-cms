<!-- pages/posts/[id]/[slug].vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";
import markdownIt from "markdown-it";

const route = useRoute();
console.log(route.params.id);

const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const title = ref<string>("");
const category = ref<string | null>(null);
const content_md = ref<string>("");
const tags = ref<string | null>(null);

const parsedContent = ref<string>("");

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
      tags.value = blog.value.tags ? blog.value.tags.join(", ") : null;
      content_md.value = blog.value.content_md;

      // Parse Markdown content
      parsedContent.value = markdownParser.render(blog.value.content_md);
    } else {
      error.value = "Blog not found.";
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
  } finally {
    isLoading.value = false;
  }
});

const markdownParser = new markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  xhtmlOut: true,
});
</script>

<template>
  <div
    class="px-6 py-10 sm:py-16 sm:px-8 max-w-4xl border border-gray-200 rounded-lg shadow-lg mx-auto bg-white"
  >
    <div v-if="isLoading">Loading blog...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="blog">
      <h1 class="text-3xl font-bold">{{ blog.title }}</h1>
      <div class="mt-4 prose dark:prose-dark">
        <!-- Render parsed Markdown content as HTML -->
        <div v-html="parsedContent"></div>
      </div>
      <div class="py-4 border-t border-gray-200 dark:border-slate-700"></div>
      <p class="text-gray-600">
        <strong>Category: </strong>
        <span
          v-for="category in blog.category"
          :key="category"
          class="bg-slate-100 px-2 py-1 mr-2 rounded"
        >
          {{ category || "Uncategorized" }}
        </span>
      </p>
      <p class="mt-6 text-sm text-gray-100">
        <span
          v-for="tag in blog.tags"
          :key="tag"
          class="bg-violet-500 px-2 py-1 mr-2 rounded"
        >
          {{ tag }}
        </span>
      </p>
    </div>
    <div v-else>
      <p>Blog not found.</p>
    </div>
  </div>
</template>
