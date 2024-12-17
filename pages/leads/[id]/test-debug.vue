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
      <div v-if="isLoading">Loading lead...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="lead">
        <RowTable :fields="fields" :editable="isEditing" />
      </div>
      <div v-else>
        <p>Lead not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useLeadsStore } from "~/stores/leads";
import type { Lead } from "~/stores/leads";
import PageHeader from "~/components/PageHeader.vue";
import RowTable from "~/components/RowTable.vue";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

interface Field {
  key: keyof Lead;
  label: string;
  value: string;
  inputClass?: string;
  placeholder?: string;
  fullRow?: boolean;
  attrs?: {
    maxlength?: number;
    required?: boolean;
    disabled?: boolean;
  };
  type?: string;
  rows?: number;
  hint?: string;
  error?: string;
}

const route = useRoute();
const leadsStore = useLeadsStore();

const lead = ref<Lead | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const errors = ref({});
const isEditing = ref(false);

const fields = ref<Field[]>([
  {
    key: "name",
    label: "Name",
    value: "",
    inputClass: "w-full",
    fullRow: false,
    error: "",
  },
  {
    key: "email",
    label: "Email",
    value: "",
    fullRow: false,
    error: "",
  },
  {
    key: "phone",
    label: "Phone",
    value: "",
    fullRow: false,
    error: "",
  },
  {
    key: "interest",
    label: "interest",
    value: "",
    inputClass: "w-full",
    fullRow: false,
    error: "",
  },
  {
    key: "submitted_at",
    label: "Date Created",
    value: "",
    inputClass: "w-full",
    fullRow: false,
    error: "",
  },
]);

onMounted(async () => {
  const idParam = route.params.id;
  const isEditMode = route.query.edit === "true";

  console.log("Is Edit Mode:", isEditMode);

  if (typeof idParam !== "string") {
    error.value = "Invalid lead ID.";
    isLoading.value = false;
    return;
  }

  const leadId = Number(idParam);

  if (isNaN(leadId)) {
    error.value = "Invalid lead ID.";
    isLoading.value = false;
    return;
  }

  try {
    lead.value = await leadsStore.fetchLeadById(leadId);
    if (lead.value) {
      fields.value = [
        {
          key: "name",
          label: "Name",
          value: lead.value.name,
          inputClass: "",
          fullRow: true,
          error: "",
          attrs: { required: true },
        },
        {
          key: "email",
          label: "Email",
          value: lead.value.email,
          inputClass: "",
          fullRow: true,
          error: "",
          attrs: { required: true },
        },
        {
          key: "phone",
          label: "Phone",
          value: lead.value.phone,
          inputClass: "",
          fullRow: true,
          error: "",
          attrs: { required: true },
        },
        {
          key: "interest",
          label: "interest",
          value: lead.value.interest,
          inputClass: " pr-8",
          fullRow: false,
          attrs: { required: true },
          error: "",
        },
        {
          key: "submitted_at",
          label: "Date Created",
          value: lead.value.submitted_at,
          inputClass: "",
          fullRow: false,
          attrs: { required: true },
          error: "",
        },
      ];
    } else {
      error.value = "Lead not found.";
    }
    isEditing.value = isEditMode; // Set edit mode on page load
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
  } finally {
    isLoading.value = false;
  }
});

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
  if (!validateFields()) {
    console.log("Validation failed:", fields.value);
    return;
  }

  interface Lead {
    title: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    tags: string;
  }

  const updatedLead: Partial<Lead> = fields.value.reduce((acc, field) => {
    acc[field.key as keyof Lead] = field.value;
    return acc;
  }, {} as Partial<Lead>);

  // Ensure `id` exists
  if (!lead.value?.id) {
    console.error("Error: Lead ID is undefined.");
    return;
  }

  try {
    await leadsStore.updateLead(updatedLead as Partial<Lead> & { id: number });
    console.log("Lead updated successfully", updatedLead);

    navigateTo(`/leads/${route.params.id}/view`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to save changes.";
    console.error(e);
  }
};

const cancelEdit = () => {
  navigateTo(`/leads/${route.params.id}/view`);
};
</script>
