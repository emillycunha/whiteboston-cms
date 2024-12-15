<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Post Details"
      :buttons="[
        {
          label: isEditing ? 'Cancel' : 'Back',
          icon: isEditing ? CheckCircleIcon : ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: isEditing ? cancelEdit : goBack,
        },
        {
          label: isEditing ? 'Save Post' : 'Edit Post',
          icon: isEditing ? CheckCircleIcon : PencilSquareIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: isEditing ? saveChanges : enableEdit,
        },
      ]"
    />

    <div class="">
      <div v-if="isLoading">Loading blog...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="blog">
        <RowTable :fields="fields" :editable="isEditing" />
      </div>
      <div v-else>
        <p>Blog not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";
import markdownIt from "markdown-it";
import PageHeader from "~/components/PageHeader.vue";
import RowTable from "~/components/RowTable.vue";

import {
  PencilSquareIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const isEditing = ref(false);

const fields = ref([
  { key: "title", label: "Title", value: "", inputClass: "w-full" },
  { key: "category", label: "Category", value: "", inputClass: "w-1/2" },
  { key: "tags", label: "Tags", value: "", inputClass: "w-full" },
  { key: "content", label: "Content", value: "", inputClass: "w-full" },
]);

onMounted(async () => {
  const idParam = route.params.id;

  // Validate the blog ID
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
      // Populate fields for editing
      fields.value = [
        {
          key: "title",
          label: "Title",
          value: blog.value.title,
          inputClass: "w-full",
        },
        {
          key: "category",
          label: "Category",
          value: "Technology",
          type: "select",
          inputClass: "w-1/2",
          options: [
            { value: "Technology", label: "Technology" },
            { value: "Health", label: "Health" },
            { value: "Education", label: "Education" },
          ],
        },
        {
          key: "tags",
          label: "Tags",
          value: blog.value.tags,
          inputClass: "w-full",
        },
        {
          key: "content",
          label: "Content",
          value: blog.value.content,
          type: "textarea",
          rows: 6,
          inputClass: "w-full",
        },
      ];
    } else {
      error.value = "Blog not found.";
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
  } finally {
    isLoading.value = false;
  }
});

const enableEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const saveChanges = async () => {
  isEditing.value = false;

  // Prepare updated data to save
  const updatedBlog = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {} as Partial<Blog>);

  try {
    await blogsStore.updateBlog(updatedBlog);
    console.log("Blog updated successfully", updatedBlog);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to save changes.";
  }
};

const goBack = () => {
  navigateTo("/posts");
};
</script>
