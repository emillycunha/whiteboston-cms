<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Posts"
      :buttons="[
        {
          label: 'More Actions',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: buttonHandlerOne,
        },
        {
          label: 'Add Post',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: buttonHandlerTwo,
        },
      ]"
    />

    <DataTable
      :data="blogs"
      :columns="tableColumns"
      :enableCheckbox="false"
      :actionType="'view'"
      @view="handleView"
      :rowsPerPage="10"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import DataTable from "~/components/DataTable.vue";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/solid";

import { useBlogsStore } from "@/stores/blogs";

const router = useRouter();
const blogs = ref([]);

const tableColumns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "created_at", label: "Created" },
];

const blogsStore = useBlogsStore();
onMounted(async () => {
  console.log("[Parent] Fetching blogs...");
  if (process.client) {
    await blogsStore.fetchBlogs();
    blogs.value = blogsStore.blogs;
    console.log("[Parent] blogs after fetch:", blogs.value);
  }
});

// Header Buttons
const buttonHandlerOne = () => {
  console.log("Save clicked!");
};

const buttonHandlerTwo = () => {
  console.log("Cancel clicked!");
};

const handleView = (row) => {
  const blogId = row.id;
  if (blogId) {
    router.push(`/posts/${blogId}/view`);
  } else {
    console.error("Blog ID not found in row:", row);
  }
};
</script>
