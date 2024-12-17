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
          onClick: addPost,
        },
      ]"
    />

    <DataTable
      :data="latestBlogs"
      :columns="tableColumns"
      :enableCheckbox="false"
      :actionType="'view'"
      @view="handleView"
      :rowsPerPage="10"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from "~/components/DataTable.vue";
import { useBlogsStore } from "@/stores/blogs";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const blogs = ref([]);

const tableColumns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  {
    key: "created_at",
    label: "Created",
    formatter: (dateString) => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
  },
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

// Header Buttons
const buttonHandlerOne = () => {
  console.log("Save clicked!");
};

const addPost = () => {
  navigateTo("/posts/add-post");
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
