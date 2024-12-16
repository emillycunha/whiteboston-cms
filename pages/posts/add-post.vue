<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Add Blog"
      :buttons="[
        {
          label: 'Cancel',
          icon: XCircleIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: cancelAdd,
        },
        {
          label: 'Publish Post',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveBlog,
        },
      ]"
    />

    <div>
      <RowTable :fields="fields" :editable="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import PageHeader from "~/components/PageHeader.vue";
import RowTable from "~/components/RowTable.vue";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const blogsStore = useBlogsStore();
const errors = ref({});

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
    placeholder: "Add Post Title",
    fullRow: false,
    attrs: { maxlength: 100, required: true },
  },
  {
    key: "slug",
    label: "Slug",
    value: "",
    inputClass: " text-gray-500 bg-gray-100 !border-gray-100",
    placeholder: "The URL is auto-generated based on title",
    fullRow: false,
    attrs: { disabled: true },
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Add Post Description",
    rows: 4,
    value: "",
    fullRow: true,
    attrs: { required: true },
  },
  {
    key: "content",
    label: "Content",
    type: "textarea",
    placeholder:
      "Write your blog content here in Markdown... e.g., # Heading, ## Subheading, ### Sub-subheading, etc.",
    rows: 10,
    value: "",
    fullRow: true,
    attrs: { required: true },
    hint: "For Markdown syntax, visit https://www.markdownguide.org/cheat-sheet/",
  },
  {
    key: "category",
    label: "Category",
    value: "",
    inputClass: "w-full",
    placeholder: "Frontend, Web Development",
    fullRow: false,
    attrs: { required: true },
    hint: "For multiple categories, separate with commas. E.g., Frontend, Web Development",
  },
  {
    key: "tags",
    label: "Tags",
    value: "",
    inputClass: "w-full",
    fullRow: false,
    placeholder: "web-development, coding",
    attrs: { required: true },
    hint: "For multiple tags, separate with commas. Use hyphens for multiple words in a tag. E.g., web-development, coding",
  },
]);

// Auto-update slug when title changes
watch(
  () => fields.value.find((field) => field.key === "title")?.value,
  (newTitle) => {
    const slugField = fields.value.find((field) => field.key === "slug");
    if (slugField && newTitle) {
      slugField.value = slugify(newTitle);
    }
  }
);

// Auto-format tags
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

// Auto-format categories
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

// Validate required fields
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

// Save the new blog
const saveBlog = async () => {
  if (!validateFields()) {
    console.log("Validation failed:", fields.value);
    return;
  }

  // Reduce fields into a new blog object
  const newBlog = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  try {
    // Save the new blog through the store
    await blogsStore.createBlog(newBlog);
    console.log("Blog created successfully", newBlog);

    // Redirect to the blog list or a success page
    navigateTo("/posts");
  } catch (e) {
    // Log a user-friendly error
    console.error("Error saving blog:", e instanceof Error ? e.message : e);
  }
};

// Cancel adding blog
const cancelAdd = () => {
  navigateTo("/posts"); // Navigate back to blog list
};
</script>
