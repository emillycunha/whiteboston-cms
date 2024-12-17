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
          label: 'Save Contact',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveChanges,
        },
      ]"
    />

    <div class="">
      <div v-if="isLoading">Loading contact...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="contact">
        <RowTable :fields="fields" :editable="isEditing" />
      </div>
      <div v-else>
        <p>Contact not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useContactsStore } from "~/stores/contacts";
import type { Contact } from "~/stores/contacts";
import PageHeader from "~/components/PageHeader.vue";
import RowTable from "~/components/RowTable.vue";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

interface Field {
  key: keyof Contact;
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
const contactsStore = useContactsStore();

const contact = ref<Contact | null>(null);
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
    key: "created_at",
    label: "Date Created",
    value: "",
    inputClass: "w-full",
    fullRow: false,
    attrs: { disabled: true },
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
    key: "notes",
    label: "Notes",
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
    error.value = "Invalid contact ID.";
    isLoading.value = false;
    return;
  }

  const contactId = Number(idParam);

  if (isNaN(contactId)) {
    error.value = "Invalid contact ID.";
    isLoading.value = false;
    return;
  }

  try {
    contact.value = await contactsStore.fetchContactById(contactId);
    if (contact.value) {
      fields.value = [
        {
          key: "name",
          label: "Name",
          value: contact.value.name,
          inputClass: "",
          fullRow: false,
          error: "",
          attrs: { required: true },
        },
        {
          key: "created_at",
          label: "Date Created",
          value: contact.value.created_at,
          inputClass: " text-gray-500 bg-gray-100 !border-gray-100",
          fullRow: false,
          attrs: { disabled: true },
          error: "",
        },
        {
          key: "email",
          label: "Email",
          value: contact.value.email,
          inputClass: "",
          fullRow: true,
          error: "",
          attrs: { required: true },
        },
        {
          key: "phone",
          label: "Phone",
          value: contact.value.phone,
          inputClass: "",
          fullRow: false,
          error: "",
          attrs: { required: true },
        },
        {
          key: "notes",
          label: "Notes",
          value: contact.value.notes,
          inputClass: " pr-8",
          fullRow: false,
          attrs: { required: true },
          error: "",
        },
      ];
    } else {
      error.value = "Contact not found.";
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

  interface Contact {
    title: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    tags: string;
  }

  const updatedContact: Partial<Contact> = fields.value.reduce((acc, field) => {
    acc[field.key as keyof Contact] = field.value;
    return acc;
  }, {} as Partial<Contact>);

  // Ensure `id` exists
  if (!contact.value?.id) {
    console.error("Error: Contact ID is undefined.");
    return;
  }

  try {
    await contactsStore.updateContact(
      updatedContact as Partial<Contact> & { id: number }
    );
    console.log("Contact updated successfully", updatedContact);

    navigateTo(`/contacts/${route.params.id}/view`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to save changes.";
    console.error(e);
  }
};

const cancelEdit = () => {
  navigateTo(`/contacts/${route.params.id}/view`);
};
</script>
