<script setup lang="ts">
import { ref, computed } from "vue";
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  ChevronDownIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/20/solid";

import { useClientsStore } from "~/stores/clients";
import type { Client } from "~/stores/clients";

const clientsStore = useClientsStore();

// Define columns dynamically (no 'source' column).
// key: field on the client object
// label: column header text
// We assume each of these keys exists on the client object.
const columns: { key: keyof Client; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
];

// Selected clients array for export
const selectedClients = ref<number[]>([]);

const allSelected = computed(() => {
  return (
    clientsStore.clients.length > 0 &&
    selectedClients.value.length === clientsStore.clients.length
  );
});

function toggleSelectAll(event: Event) {
  if ((event.target as HTMLInputElement).checked) {
    // Provide a type to client
    selectedClients.value = clientsStore.clients.map(
      (client: Client) => client.id
    );
  } else {
    selectedClients.value = [];
  }
}

// Export selected clients as CSV
function exportSelectedContacts() {
  const selected = clientsStore.clients.filter((client: Client) =>
    selectedClients.value.includes(client.id)
  );

  if (selected.length === 0) {
    alert("No contacts selected.");
    return;
  }

  const headers = columns.map((col) => col.label);
  const rows = selected.map((client: Client) => {
    return columns.map((col) => {
      let val = client[col.key];
      if (col.key === "created_at") {
        val = new Date(val as string).toLocaleDateString() || "";
      }
      return val || "";
    });
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "selected_contacts.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Sorting logic
const sortKey = ref<string | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");

// Computed property that returns the sorted clients
const sortedClients = computed(() => {
  if (!sortKey.value) {
    return clientsStore.clients;
  }

  return [...clientsStore.clients].sort((a, b) => {
    const aVal = a[sortKey.value as keyof typeof a];
    const bVal = b[sortKey.value as keyof typeof b];

    const aStr = aVal == null ? "" : String(aVal).toLowerCase();
    const bStr = bVal == null ? "" : String(bVal).toLowerCase();

    if (aStr < bStr) return sortOrder.value === "asc" ? -1 : 1;
    if (aStr > bStr) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

function setSort(column: string) {
  if (sortKey.value === column) {
    // Toggle the sort order if the same column is clicked again
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Set a new column to sort by
    sortKey.value = column;
    sortOrder.value = "asc";
  }
}

// Fetch data when the component is created.
clientsStore.fetchClients();

const viewContact = async (id: number) => {
  await navigateTo(`/contacts/${id}`);
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
          Contacts
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
      <div v-if="clientsStore.loading">Loading client list, please wait...</div>
      <div v-else-if="clientsStore.error">Error: {{ clientsStore.error }}</div>
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
          <tr v-for="client in sortedClients" :key="client.id">
            <!-- Checkbox column cell -->
            <td class="py-4 px-3">
              <input
                type="checkbox"
                class="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                :value="client.id"
                v-model="selectedClients"
              />
            </td>
            <!-- Dynamic columns -->
            <td
              v-for="col in columns"
              :key="col.key"
              class="py-4 px-3 text-sm font-medium"
            >
              <span v-if="col.key === 'created_at'">
                {{ new Date(client.created_at).toLocaleDateString() }}
              </span>
              <span v-else>
                {{ client[col.key] }}
              </span>
            </td>
            <td class="py-4 px-3 text-right text-sm font-medium">
              <a
                href="#"
                class="text-violet-500 hover:text-violet-900"
                @click.prevent="viewContact(client.id)"
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
