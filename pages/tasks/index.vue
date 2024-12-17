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
      :data="tasks"
      :columns="tableColumns"
      :enableCheckbox="false"
      :actionType="'view'"
      @view="handleView"
      :rowsPerPage="10"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import DataTable from "~/components/DataTable.vue";
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/vue/20/solid";

import { useTasksStore } from "~/stores/tasks";

const router = useRouter();
const tasks = ref([]);

const tableColumns = [
  { key: "title", label: "Title" },
  { key: "description", label: "Dategory" },
  { key: "due_at", label: "Due" },
];

const tasksStore = useTasksStore();
onMounted(async () => {
  console.log("[Parent] Fetching tasks...");
  if (process.client) {
    await tasksStore.fetchTasks();
    tasks.value = tasksStore.tasks;
    console.log("[Parent] blogs after fetch:", tasks.value);
  }
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
