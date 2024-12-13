<!-- pages/posts/[id]/[slug].vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";
import markdownIt from "markdown-it";

import { PencilSquareIcon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
console.log(route.params.id);

const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const title = ref<string>("");
const category = ref<string>("");
const content = ref<string>("");
const tags = ref<string>("");

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
      category.value = blog.value.category;
      tags.value = blog.value.tags;
      content.value = blog.value.content;

      // Parse Markdown content
      parsedContent.value = markdownParser.render(blog.value.content);
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

function editBlog(blogId: number) {
  console.log("Edit blog:", blogId);
  // Navigate to /blogs/[id]/edit
  navigateTo(`/posts/${blogId}/edit`);
}
</script>

<template>
  <div class="p-6 space-y-10">
    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between mb-20">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Post Preview
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <a
          href="/posts"
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ChevronLeftIcon class="mr-2 w-5 h-5" />
          Back
        </a>
        <a
          href="/posts/preview-post"
          type="button"
          @click.prevent="editBlog(blog!.id)"
          class="mx-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit Post
          <PencilSquareIcon class="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>
    <div
      class="px-6 py-10 sm:py-16 sm:px-8 max-w-3xl border border-gray-200 rounded-lg shadow-md mx-auto bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
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
          <span>
            {{ blog.category || "Uncategorized" }}
          </span>
        </p>
        <p class="mt-6 text-sm text-gray-100">
          <span>
            {{ blog.tags }}
          </span>
        </p>
      </div>
      <div v-else>
        <p>Blog not found.</p>
      </div>
    </div>
  </div>
</template>
