<script setup lang="ts">
import { ref, computed } from "vue";
import DataTable from "@/components/DataTable.vue";
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  ChevronDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/vue/20/solid";

import { useLeadsStore } from "~/stores/leads";
import type { Lead } from "~/stores/leads";

const leadsStore = useLeadsStore();

const columns = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "interest", label: "Interest" },
  { key: "submitted_at", label: "Submission Date" },
];

// Selected leads array for export
const selectedLeads = ref<number[]>([]);

// Determine if all leads are selected
const allSelected = computed(() => {
  return (
    leadsStore.leads.length > 0 &&
    selectedLeads.value.length === leadsStore.leads.length
  );
});

// Toggle select/deselect all
function toggleSelectAll(event: Event) {
  if ((event.target as HTMLInputElement).checked) {
    selectedLeads.value = leadsStore.leads.map((lead) => lead.id);
  } else {
    selectedLeads.value = [];
  }
}

// Export selected leads as CSV
function exportSelectedContacts() {
  const selected = leadsStore.leads.filter((lead) =>
    selectedLeads.value.includes(lead.id)
  );

  if (selected.length === 0) {
    alert("No contacts selected.");
    return;
  }

  // Create CSV from selected leads
  const headers = columns.map((c) => c.label);
  const rows = selected.map((lead) => {
    return columns.map((c) => {
      let val = (lead as any)[c.key] || "";
      if (c.key === "submitted_at") {
        val = new Date(val).toLocaleDateString();
      }
      return val;
    });
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "selected_leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Sorting logic
const sortKey = ref<string | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");

// Computed property that returns the sorted leads
const sortedLeads = computed(() => {
  if (!sortKey.value) {
    return leadsStore.leads;
  }

  return [...leadsStore.leads].sort((a, b) => {
    const aVal = (a as any)[sortKey.value as string];
    const bVal = (b as any)[sortKey.value as string];

    const aStr =
      aVal === null || aVal === undefined ? "" : String(aVal).toLowerCase();
    const bStr =
      bVal === null || bVal === undefined ? "" : String(bVal).toLowerCase();

    if (aStr < bStr) return sortOrder.value === "asc" ? -1 : 1;
    if (aStr > bStr) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

function setSort(column: string) {
  if (sortKey.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = column;
    sortOrder.value = "asc";
  }
}

// Fetch data when the component is created
leadsStore.fetchLeads();

const viewLead = async (id: number) => {
  await navigateTo(`/leads/${id}`);
};
</script>

<template>
  <div class="p-2 sm:p-6 space-y-10">
    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Leads
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          @click="exportSelectedContacts"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Export Contacts
          <ChevronDownIcon class="ml-2 w-5 h-5" />
        </button>
        <button
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          Create New
          <PlusIcon class="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>

    <div
      class="mt-3 sm:mt-4 rounded-lg bg-gray-50 dark:bg-slate-800 p-4 sm:p-8 min-h-[200px] border border-gray-200 dark:border-slate-700 shadow-sm"
    >
      <!-- Display loading and error states -->
      <div v-if="leadsStore.loading">Loading leads, please wait...</div>
      <div v-else-if="leadsStore.error">Error: {{ leadsStore.error }}</div>
      <table v-else class="min-w-full divide-y divide-gray-300">
        <thead class="dark:text-white">
          <tr>
            <th class="py-3.5 px-3 text-left text-sm font-semibold w-1/12">
              <input
                type="checkbox"
                class="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                @change="toggleSelectAll($event)"
                :checked="allSelected"
              />
            </th>

            <!-- Create headers dynamically from columns definition -->
            <th
              v-for="col in columns"
              :key="col.key"
              class="py-3.5 px-3 text-left text-sm font-semibold cursor-pointer select-none"
              @click="setSort(col.key)"
            >
              {{ col.label }}
              <span v-if="sortKey === col.key">
                <template v-if="sortOrder === 'asc'">
                  <BarsArrowUpIcon
                    class="inline-block w-4 h-4 ml-1 text-gray-500"
                  />
                </template>
                <template v-else>
                  <BarsArrowDownIcon
                    class="inline-block w-4 h-4 ml-1 text-gray-500"
                  />
                </template>
              </span>
            </th>
            <th class="relative py-3.5 pl-3 pr-4 w-4">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="dark:text-gray-100">
          <!-- Use sortedLeads to display leads in sorted order -->
          <tr v-for="lead in sortedLeads" :key="lead.id">
            <td class="py-4 px-3">
              <input
                type="checkbox"
                class="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                :value="lead.id"
                v-model="selectedLeads"
              />
            </td>
            <!-- Render columns dynamically -->
            <td
              v-for="col in columns"
              :key="col.key"
              class="py-4 px-3 text-sm font-medium"
            >
              <!-- If it's a date field, format accordingly -->
              <span v-if="col.key === 'submitted_at'">
                {{ new Date(lead.submitted_at).toLocaleDateString() }}
              </span>
              <span v-else> {{ lead[col.key] }} </span>
            </td>
            <td class="py-4 px-3 text-right text-sm font-medium">
              <a
                href="#"
                class="text-violet-500 hover:text-violet-900"
                @click.prevent="viewLead(lead.id)"
              >
                View
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
