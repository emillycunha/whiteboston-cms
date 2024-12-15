<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Leads"
      :buttons="[
        {
          label: 'Export Leads',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: buttonHandlerOne,
        },
        {
          label: 'Add Lead',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: buttonHandlerTwo,
        },
      ]"
    />

    <DataTable
      :data="leads"
      :columns="tableColumns"
      :enableCheckbox="true"
      :actionType="'view'"
      :rowsPerPage="10"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import DataTable from "~/components/DataTable.vue";
import { useLeadsStore } from "@/stores/leads";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/solid";

const leads = ref([]);

const tableColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "interest", label: "Interest" },
];

const leadsStore = useLeadsStore();
onMounted(async () => {
  console.log("[Parent] Fetching leads...");
  if (process.client) {
    await leadsStore.fetchLeads();
    leads.value = leadsStore.leads;
    console.log("[Parent] leads after fetch:", leads.value);
  }
});

// Header Buttons
const buttonHandlerOne = () => {
  console.log("Save clicked!");
};

const buttonHandlerTwo = () => {
  console.log("Cancel clicked!");
};
</script>
