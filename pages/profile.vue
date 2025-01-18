<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Page Header -->
    <PageHeader title="Profile" />

    <!-- Form for Profile -->
    <BasicForm
      :fields="fields"
      :editable="true"
      @submit="saveProfile"
      @cancel="cancelProfile"
    />

    <PageFooter
      title=""
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: cancelProfile,
        },
        {
          label: 'Save Profile',
          icon: CheckCircleIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: saveProfile,
        },
      ]"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();

// Fields for profile form
const fields = ref([
  {
    key: "name",
    label: "Name",
    type: "text",
    value: authStore.name,
    isRequired: true,
    placeholder: "Enter your name",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    value: authStore.email,
    isRequired: true,
    placeholder: "Enter your email",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    value: "",
    isRequired: false,
    placeholder: "Update your password",
  },
]);

// Fetch user metadata and log details on page load
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.fetchUserMetadata();
  }
});

function cancelProfile() {
  console.log("Settings changes discarded.");
  alert("Settings reset!");
}

function saveProfile() {
  // Handle saving profile (you would likely call some API or store method here)
  console.log("Profile saved:", fields.value);
  alert("Profile saved successfully!");
}
</script>
