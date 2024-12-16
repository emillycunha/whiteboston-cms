<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Post Details"
      :buttons="[
        {
          label: 'Cancel',
          icon: XCircleIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: cancelEdit,
        },
        {
          label: 'Save Post',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveChanges,
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
import { ref, onMounted, watch } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";
import markdownIt from "markdown-it";
import PageHeader from "~/components/PageHeader.vue";
import RowTable from "~/components/RowTable.vue";

import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const blogsStore = useBlogsStore();

const blog = ref<Blog | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const errors = ref({});
const isEditing = ref(false);

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const capitalizeWords = (text: string): string =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const fields = ref([
  {
    key: "title",
    label: "Title",
    value: "",
    inputClass: "w-full",
    fullRow: false,
  },
  {
    key: "slug",
    label: "Slug",
    value: "",
    inputClass: "w-full",
    fullRow: false,
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    rows: 4,
    value: "",
    fullRow: true,
  },
  {
    key: "content",
    label: "Content",
    type: "textarea",
    rows: 4,
    value: "",
    fullRow: true,
  },
  {
    key: "tags",
    label: "Tags",
    value: "",
    inputClass: "w-full",
    fullRow: false,
  },
  {
    key: "category",
    label: "Category",
    value: "",
    inputClass: "w-full",
    fullRow: false,
  },
]);

onMounted(async () => {
  const idParam = route.params.id;
  const isEditMode = route.query.edit === "true"; // Check query param

  console.log("Is Edit Mode:", isEditMode);

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
      fields.value = [
        {
          key: "title",
          label: "Title",
          value: blog.value.title,
          inputClass: "",
          fullRow: true,

          attrs: { maxlength: 100, required: true },
        },
        {
          key: "slug",
          label: "Slug",
          value: blog.value.slug,
          inputClass: " text-gray-500 bg-gray-100 !border-gray-100",
          fullRow: true,

          attrs: { disabled: true },
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          rows: 3,
          value: blog.value.description,
          inputClass: "",
          fullRow: true,

          attrs: { required: true },
        },
        {
          key: "content",
          label: "Content",
          value: blog.value.content,
          type: "textarea",
          rows: 10,
          inputClass: "",
          fullRow: true,

          attrs: { required: true },
        },
        {
          key: "category",
          label: "Category",
          value: blog.value.category,
          inputClass: " pr-8",
          attrs: { required: true },
          hint: "For multiple categories, separate with commas. Best practice is to use 1-2 words per category. E.g., Website, Frontend, Web Development",
        },
        {
          key: "tags",
          label: "Tags",
          value: blog.value.tags,
          inputClass: "",
          attrs: { required: true },
          hint: "For multiple tags, separate with commas. For multiple words in a tag, separate with hyphens. Best practice is to use 1-2 words per tag. E.g., website, frontend, web-development",
        },
      ];
    } else {
      error.value = "Blog not found.";
    }
    isEditing.value = isEditMode; // Set edit mode on page load
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
  } finally {
    isLoading.value = false;
  }
});

watch(
  () => fields.value.find((field) => field.key === "title")?.value,
  (newTitle) => {
    const slugField = fields.value.find((field) => field.key === "slug");
    if (slugField && newTitle) {
      slugField.value = slugify(newTitle);
    }
  }
);

watch(
  () => fields.value.find((field) => field.key === "category")?.value,
  (newCategory) => {
    const categoryField = fields.value.find(
      (field) => field.key === "category"
    );
    if (categoryField && newCategory) {
      categoryField.value = capitalizeWords(newCategory);
    }
  }
);

watch(
  () => fields.value.find((field) => field.key === "tags")?.value,
  (newTags) => {
    const tagsField = fields.value.find((field) => field.key === "tags");
    if (tagsField && newTags) {
      tagsField.value = newTags
        .split(",")
        .map((tag) => tag.trim())
        .join(", ");
    }
  }
);

// Validation function
const validateFields = () => {
  fields.value.forEach((field) => {
    if (field.attrs?.required && (!field.value || !field.value.trim())) {
      field.error = `${field.label} is required.`;
    } else {
      field.error = "";
    }
  });

  return fields.value.every((field) => !field.error);
};

const saveChanges = async () => {
  console.log("Before validation, errors:", errors.value);

  if (!validateFields()) {
    console.log("Validation failed:", fields.value);
    return;
  }

  console.log("Form is valid:", fields.value);

  const updatedBlog = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {} as Partial<Blog>);

  try {
    updatedBlog.id = blog.value?.id;

    await blogsStore.updateBlog(updatedBlog);
    console.log("Blog updated successfully", updatedBlog);

    navigateTo(`/posts/${route.params.id}/view`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to save changes.";
    console.error(e);
  }
};

const cancelEdit = () => {
  navigateTo(`/posts/${route.params.id}/view`);
};
</script>
