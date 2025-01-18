<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Submit a Ticket" />

    <!-- Ticket Submission Form -->
    <RowTable :fields="fields" :editable="isEditing" />

    <PageFooter
      title=""
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import RowTable from "~/components/BasicForm.vue";
import { CheckCircleIcon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const { $supabase } = useNuxtApp();

const isEditing = ref(true);
const fields = ref([
  {
    key: "title",
    label: "Title",
    value: "",
    fullRow: false,
    attrs: { maxlength: 100, required: true },
    type: "text",
    inputClass: "",
    placeholder: "Enter ticket title",
  },
  {
    key: "description",
    label: "Description",
    value: "",
    fullRow: true,
    attrs: { required: true },
    type: "textarea",
    rows: 4,
    inputClass: "w-full",
    placeholder: "Describe the issue",
  },
  {
    key: "category",
    label: "Category",
    value: "",
    attrs: { required: true },
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
    attrs: { required: true },
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
  // Validate required fields
  const missingFields = fields.value.filter(
    (field) =>
      field.attrs?.required && (!field.value || field.value.trim() === "")
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
