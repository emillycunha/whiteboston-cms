<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Posts"
      :buttons="[
        {
          label: 'Export Leads',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: buttonHandlerOne,
        },
        {
          label: 'Add Lead',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: buttonHandlerTwo,
        },
      ]"
    />

    <div>
      <RowTable :fields="fields" :editable="isEditing" />
    </div>
    <!-- Buttons for editing and saving -->
    <div class="flex justify-end mb-4">
      <button
        v-if="!isEditing"
        @click="enableEdit"
        class="text-blue-500 hover:text-blue-700"
      >
        Edit
      </button>
      <button
        v-if="isEditing"
        @click="saveChanges"
        class="text-green-500 hover:text-green-700"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import RowTable from "~/components/RowTable.vue";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/solid";

// Define fields
const fields = ref([
  {
    key: "title",
    label: "Title",
    value: "Sample Blog Post",
    inputClass: "w-full",
  },
  {
    key: "category",
    label: "Category",
    value: "Technology",
    inputClass: "w-1/2",
  },
  {
    key: "tags",
    label: "Tags",
    value: "vuejs, frontend, development",
    inputClass: "w-full",
  },
]);

const isEditing = ref(false);

const enableEdit = () => {
  isEditing.value = true;
};

const saveChanges = () => {
  isEditing.value = false;

  // Perform additional save logic, such as API calls
  console.log("Saved fields:", fields.value);
};

// Header Buttons
const buttonHandlerOne = () => {
  console.log("Save clicked!");
};

const buttonHandlerTwo = () => {
  console.log("Cancel clicked!");
};
</script>
