<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Post Details"
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: goBack,
        },
        {
          label: 'Edit Post',
          icon: PencilSquareIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: enableEdit,
        },
      ]"
    />

    <div v-if="isLoading">Loading blog...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="blog">
      <div
        class="rounded-md bg-white dark:bg-slate-800 shadow-sm border border-gray-200"
      >
        <div class="flex flex-col gap-y-4 p-4 sm:p-10">
          <h2 class="text-2xl font-bold mb-4 dark:text-white">
            {{ blog.title }}
          </h2>
          <!-- Render Markdown as HTML -->
          <div
            v-html="renderMarkdown(blog.content)"
            class="prose max-w-full dark:prose-invert"
          ></div>
          <div class="mt-4 border-t border-gray-200 pt-4">
            <p class="text-gray-700 dark:text-gray-400 text-base font-light">
              {{ blog.category }}
            </p>
            <p class="text-gray-700 dark:text-gray-400 text-base font-light">
              {{ blog.tags }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Blog not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";
import markdownIt from "markdown-it";
import PageHeader from "~/components/PageHeader.vue";
import { PencilSquareIcon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const navigateTo = useRouter().push;
const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const renderMarkdown = (markdown: string) => {
  const md = markdownIt();
  const renderedHTML = md.render(markdown);
  return renderedHTML;
};

onMounted(async () => {
  const idParam = route.params.id;

  console.log("Route Param (ID):", idParam);

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
    console.log("Fetched Blog:", blog.value);
    if (!blog.value) error.value = "Blog not found.";
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
    console.error("Error fetching blog:", e);
  } finally {
    isLoading.value = false;
  }
});

const goBack = () => {
  navigateTo("/posts");
};

const enableEdit = () => {
  const postId = blog.value?.id;
  if (postId) {
    navigateTo(`/posts/${postId}/edit?edit=true`);
  }
};
</script>
