<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader
      title="Submit a Ticket"
      :buttons="[
        {
          label: isEditing ? 'Submit' : 'Back',
          icon: isEditing ? CheckCircleIcon : ChevronLeftIcon,
          iconPosition: isEditing ? 'after' : 'before',
          variant: isEditing ? 'primary' : 'secondary',
          onClick: isEditing ? submitTicket : goBack,
        },
      ]"
    />

    <!-- Ticket Submission Form -->
    <RowTable :fields="fields" :editable="isEditing" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PageHeader from "~/components/PageHeader.vue";
import RowTable from "~/components/RowTable.vue";

import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const isEditing = ref(true);
const fields = ref([
  {
    key: "title",
    label: "Title",
    value: "",
    required: true,

    inputClass: "w-full",
    placeholder: "Enter ticket title",
  },
  {
    key: "description",
    label: "Description",
    value: "",
    required: true,

    type: "textarea",
    rows: 4,
    inputClass: "w-full",
    placeholder: "Describe the issue",
  },
  {
    key: "category",
    label: "Category",
    value: "",
    required: true,
    type: "select",
    options: [
      { value: "", label: "Choose One" },
      { value: "bug", label: "Bug" },
      { value: "feature_request", label: "Feature Request" },
      { value: "general", label: "General Inquiry" },
    ],
    inputClass: "w-full",
  },
  {
    key: "priority",
    label: "Priority",
    value: "",
    required: true,

    type: "select",
    options: [
      { value: "", label: "Choose One" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
    inputClass: "w-full",
  },
]);

const enableEdit = () => {
  isEditing.value = true;
};

const goBack = () => {
  navigateTo("/dashboard");
};

const submitTicket = () => {
  // Validate required fields
  const missingFields = fields.value.filter(
    (field) => field.required && (!field.value || field.value.trim() === "")
  );

  if (missingFields.length > 0) {
    alert(
      `Please fill out the required fields: ${missingFields
        .map((f) => f.label)
        .join(", ")}`
    );
    return;
  }

  // Collect the ticket data
  const ticketData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  console.log("Ticket Submitted:", ticketData);

  // Add your logic to save the ticket to the database or send it via an API
  isEditing.value = false;

  // Example: Reset fields after submission
  fields.value.forEach((field) => {
    if (field.type !== "select" && !field.required) {
      field.value = "";
    }
  });
};
</script>
