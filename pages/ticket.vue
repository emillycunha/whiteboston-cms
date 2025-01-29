<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <PageHeader title="Submit a Ticket" />

    <BaseForm :fields="fields" :editable="editable" @submit="submitTicket" @cancel="goBack" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const { $supabase } = useNuxtApp();
const notificationStore = useNotificationStore();
const editable = ref(true);
const fields = ref([
  {
    key: "title",
    label: "Title",
    value: "",
    halfRow: true,
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
    halfRow: true,
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
    halfRow: true,
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
  const ticketData = fields.value.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  const authStore = useAuthStore();
  ticketData.user_id = authStore.id;

  try {
    const { data, error } = await $supabase.from("tickets").insert(ticketData);

    if (error) {
      notificationStore.showNotification("error", "Failed to submit the ticket. Please try again.");
      return;
    }

    notificationStore.showNotification("success", "Ticket submitted successfully!");

    fields.value.forEach((field) => {
      if (field.type !== "select" && !field.attrs?.required) {
        field.value = "";
      }
    });

    isEditing.value = false;
  } catch (err) {
    console.error("Unexpected error:", err);
    notificationStore.showNotification("error", "An unexpected error occurred. Please try again.");
  }
};

const goBack = () => {
  navigateTo("/dashboard");
};
</script>
