<template>
  <div class="p-6 space-y-10">
    <!-- Header Section -->
    <PageHeader
      title="Lead Details"
      :buttons="[
        {
          label: 'Back',
          icon: ChevronLeftIcon,
          iconPosition: 'before',
          variant: 'secondary',
          onClick: saveHandler,
        },
        {
          label: 'Edit Lead',
          icon: PencilSquareIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: cancelHandler,
        },
      ]"
    />

    <RowTable :fields="leadFields" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useLeadsStore } from "@/stores/leads";
import RowTable from "@/components/RowTable.vue";
import { ChevronLeftIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const leadId = parseInt(route.params.id, 10);

const lead = ref([
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "interest", label: "Interest" },
]);

const selectedFields = ref(["id", "name", "email", "phone", "interest"]);

const leadFields = computed(() => {
  if (!lead.value) return [];
  return Object.entries(lead.value)
    .filter(([key]) => selectedFields.value.includes(key))
    .map(([key, value]) => ({
      key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value,
    }));
});

const leadsStore = useLeadsStore();

onMounted(async () => {
  try {
    console.log(`[View Page] Fetching lead with ID: ${leadId}`);
    lead.value = await leadsStore.fetchLeadById(leadId);
    console.log(`[View Page] Fetched lead:`, lead.value);
  } catch (err) {
    console.error(`[View Page] Error fetching lead with ID ${leadId}:`, err);
  }
});

const saveHandler = () => {
  console.log("Save clicked!");
};

const cancelHandler = () => {
  console.log("Cancel clicked!");
};
</script>
