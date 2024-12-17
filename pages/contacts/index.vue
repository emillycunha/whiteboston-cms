<template>
  <div class="px-6 py-4 space-y-6">
    <!-- Header Section -->
    <PageHeader
      title="Contacts"
      :buttons="[
        {
          label: 'Export Contacts',
          icon: ArrowDownTrayIcon,
          iconPosition: 'after',
          variant: 'secondary',
          onClick: exportToCSV,
          disabled: selectedContacts.length === 0,
        },
        {
          label: 'Add Contact',
          icon: PlusIcon,
          iconPosition: 'after',
          variant: 'primary',
          onClick: buttonHandlerTwo,
        },
      ]"
    />

    <DataTable
      :data="contacts"
      :columns="tableColumns"
      :enableCheckbox="true"
      @selection-change="updateSelectedContacts"
      @view="handleView"
      :actionType="'view'"
      :rowsPerPage="10"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from "~/components/DataTable.vue";
import { useContactsStore } from "@/stores/contacts";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const contacts = ref([]);

const tableColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "interest", label: "Interest" },
];

const contactsStore = useContactsStore();
onMounted(async () => {
  console.log("[Parent] Fetching contacts...");
  if (process.client) {
    await contactsStore.fetchContacts();
    contacts.value = contactsStore.contacts;
    console.log("[Parent] contacts after fetch:", contacts.value);
  }
});

const buttonHandlerTwo = () => {
  console.log("Cancel clicked!");
};

// Selected Rows
const selectedContacts = ref([]);

// Update Selected Rows
const updateSelectedContacts = (selected) => {
  selectedContacts.value = selected;
};

// Export to CSV
const exportToCSV = () => {
  if (selectedContacts.value.length === 0) return;

  // Filter the selected data
  const selectedData = contacts.value.filter((row) =>
    selectedContacts.value.includes(row.id)
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
  link.setAttribute("download", "contacts.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleView = (row) => {
  const blogId = row.id;
  if (blogId) {
    router.push(`/contacts/${blogId}/view`);
  } else {
    console.error("Contact ID not found in row:", row);
  }
};
</script>
