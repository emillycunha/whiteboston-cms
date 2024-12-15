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
          onClick: exportToCSV,
          disabled: selectedLeads.length === 0,
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
      @selection-change="updateSelectedLeads"
      :actionType="'view'"
      :rowsPerPage="10"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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

const buttonHandlerTwo = () => {
  console.log("Cancel clicked!");
};

// Selected Rows
const selectedLeads = ref([]);

// Update Selected Rows
const updateSelectedLeads = (selected) => {
  selectedLeads.value = selected;
};

// Export to CSV
const exportToCSV = () => {
  if (selectedLeads.value.length === 0) return;

  // Filter the selected data
  const selectedData = leads.value.filter((row) =>
    selectedLeads.value.includes(row.id)
  );

  // Convert to CSV
  const csvContent = [
    ["ID", "Name", "Email"], // Header row
    ...selectedData.map((row) => [row.id, row.name, row.email]),
  ]
    .map((e) => e.join(",")) // Convert each row to CSV format
    .join("\n"); // Join rows with newline

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
