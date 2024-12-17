<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Contact Details"
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: goBack,
        },
        {
          label: 'Edit Contact',
          icon: PencilSquareIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: enableEdit,
        },
      ]"
    />

    <div v-if="isLoading">Loading contact...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="contact">
      <div
        class="rounded-md bg-white dark:bg-slate-800 shadow-sm border border-gray-200"
      >
        <div class="flex flex-col gap-y-4 p-4 sm:p-10">
          <h2 class="text-2xl font-bold mb-2 dark:text-white">
            {{ contact.name }}
          </h2>
          <div class="mt-2 border-t border-gray-200 pt-4">
            <p class="text-gray-700 dark:text-gray-400 text-base font-light">
              {{ contact.email }}
            </p>
            <p
              class="mt-2 text-gray-700 dark:text-gray-400 text-base font-light"
            >
              {{ contact.phone }}
            </p>
            <p
              class="mt-2 text-gray-700 dark:text-gray-400 text-base font-light"
            >
              <span class="font-medium">Notes:</span> {{ contact.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Contact not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useContactsStore } from "~/stores/contacts";
import type { Contact } from "~/stores/contacts";
import PageHeader from "~/components/PageHeader.vue";
import { PencilSquareIcon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const navigateTo = useRouter().push;
const contactsStore = useContactsStore();

const contact = ref<Contact | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const idParam = route.params.id;

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
    console.log("Fetched Contact:", contact.value);

    // If contact is null or undefined, set the error
    if (!contact.value) {
      error.value = "Contact not found.";
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error.";
    console.error("Error fetching contact:", e);
  } finally {
    isLoading.value = false;
  }
});

const goBack = () => {
  navigateTo("/contacts");
};

const enableEdit = () => {
  const postId = contact.value?.id;
  if (postId) {
    navigateTo(`/contacts/${postId}/edit?edit=true`);
  }
};
</script>
