<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Submit a Ticket" />

    <!-- Ticket Submission Form -->
    <BaseForm
      :fields="fields"
      :editable="editable"
      @submit="submitTicket"
      @cancel="goBack"
      @editable="enableEdit"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const { $supabase } = useNuxtApp();
const editable = ref(true);
const fields = ref([
  {
    key: "title",
    label: "Title",
    value: "",
    fullRow: false,
    isRequired: true,
    attrs: { maxlength: 100 },
    type: "text",
    inputClass: "",
    placeholder: "Enter ticket title",
  },
  {
    key: "description",
    label: "Description",
    value: "",
    fullRow: true,
    isRequired: true,
    type: "textarea",
    rows: 4,
    inputClass: "w-full",
    placeholder: "Describe the issue",
  },
  {
    key: "category",
    label: "Category",
    value: "",
    isRequired: true,
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
    isRequired: true,
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

const submitTicket = async () => {
  // Collect the ticket data
  const ticketData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  // Add user_id from the logged-in user
  const authStore = useAuthStore();
  ticketData.user_id = authStore.id;

  console.log("Submitting Ticket:", ticketData);

  try {
    const { data, error } = await $supabase.from("tickets").insert(ticketData);

    if (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit the ticket. Please try again.");
      return;
    }

    console.log("Ticket Submitted Successfully:", data);
    alert("Ticket submitted successfully!");

    // Reset the form after successful submission
    fields.value.forEach((field) => {
      if (field.type !== "select" && !field.attrs?.required) {
        field.value = "";
      }
    });

    isEditing.value = false;
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred. Please try again.");
  }
};

const goBack = () => {
  navigateTo("/dashboard");
};
</script>
