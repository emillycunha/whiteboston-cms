<template>
  <div class="px-1 md:px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader v-if="editable === true" title="Profile" />
    <PageHeader
      v-if="editable === false"
      title="Profile"
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: goBack,
        },
        {
          label: 'Edit',
          icon: PencilSquareIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: enableEdit,
        },
      ]"
    />

    <!-- Form for Profile -->
    <BaseForm :fields="fields" :editable="editable" @submit="saveProfile" @cancel="cancelEdit" @back="goBack" @editable="enableEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { ChevronLeftIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const editable = ref(false);

// Fields for profile form
const fields = ref([
  {
    key: "name",
    label: "Name",
    type: "text",
    value: authStore.name,
    fullRow: true,
    originalValue: authStore.name,
    isRequired: true,
    placeholder: "Enter your name",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    value: authStore.email,
    fullRow: true,
    originalValue: authStore.email,
    isRequired: true,
    placeholder: "Enter your email",
  },
  {
    key: "password",
    label: "Password",
    description: "Click edit to change your password",
    hint: "Leave blank to keep the same",
    type: "password",
    value: "",
    fullRow: true,
    originalValue: "",
    isRequired: false,
    placeholder: "Enter your NEW password",
  },
]);

// Fetch user metadata and log details on page load
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.fetchUserMetadata();
  }
});

function goBack() {
  navigateTo({
    path: `/dashboard`,
  });
}

function cancelEdit() {
  editable.value = false;
}

const enableEdit = () => {
  editable.value = true;
  const passwordField = fields.value.find((field) => field.type === "password");
  if (passwordField) {
    passwordField.value = "";
  }
};

async function saveProfile() {
  const newName = fields.value.find((field) => field.key === "name").value;
  const newEmail = fields.value.find((field) => field.key === "email").value;
  const newPassword = fields.value.find((field) => field.key === "password").value;

  const updatedFields = {};

  // Check if name has changed
  if (newName !== authStore.name) {
    updatedFields.name = newName;
  }

  // Check if email has changed
  if (newEmail !== authStore.email) {
    updatedFields.email = newEmail;
  }

  // Check if password has changed
  if (newPassword) {
    updatedFields.password = newPassword;
  } else {
    console.log("Password left blank, not updating.");
  }

  // If any field was updated, call the save function
  if (Object.keys(updatedFields).length > 0) {
    await authStore.saveProfile(updatedFields);

    // Show success notification
    const notificationStore = useNotificationStore();
    notificationStore.showNotification("success", "Profile updated successfully!");

    editable.value = false;
  } else {
    // Show no changes notification
    const notificationStore = useNotificationStore();
    notificationStore.showNotification("info", "No changes made to profile.");
    editable.value = false;
  }
}
</script>
