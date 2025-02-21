<template>
  <div class="rounded-md bg-white shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
    <div class="p-2 sm:p-4">
      <table class="w-full text-sm table-auto">
        <thead>
          <tr class="bg-gray-100 text-left text-gray-700 dark:bg-slate-900 dark:text-white text-sm whitespace-nowrap hidden md:table-row">
            <th v-if="enableCheckbox" class="px-4 py-2 w-8">
              <input type="checkbox" :checked="allSelected" class="h-4 w-4 accent-violet-500 dark:accent-teal-500" @change="toggleAll" />
            </th>
            <th v-for="column in columns" :key="column.key" class="px-4 py-2 cursor-pointer" @click="handleSort(column.key)">
              {{ column.label }}
              <span v-if="activeSortKey === column.key">
                <BarsArrowUpIcon v-if="activeSortOrder === 'asc'" class="w-4 h-4 inline-block" />
                <BarsArrowDownIcon v-else class="w-4 h-4 inline-block" />
              </span>
            </th>
            <th v-if="actionType !== 'none'" class="px-2 py-2 w-24" />
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700 dark:text-gray-100">
          <tr v-for="row in paginatedAndSortedData" :key="row.id" class="even:bg-gray-100 dark:even:bg-slate-700">
            <td v-if="enableCheckbox" class="p-2 md:p-4 md:table-cell flex">
              <input type="checkbox" :value="row.id" :checked="selectedRows.includes(row.id)" class="h-4 w-4 accent-violet-500 dark:accent-teal-500" @change="toggleRow(row.id)" />
            </td>
            <td v-for="column in columns" :key="column.key" class="p-2 md:p-4 has-checked:text-violet-500 md:table-cell flex">
              <span class="font-semibold pr-2 md:hidden">{{ column.label }}:</span>
              {{ column.formatter ? truncateText(column.formatter(row[column.key])) : truncateText(row[column.key]) }}
            </td>
            <td v-if="actionType !== 'none'" class="px-2 md:px-4 py-2 md:table-cell flex flex-row justify-end">
              <button v-if="actionType === 'view' || actionType === 'both'" class="px-3 py-1 font-semibold text-violet-600 dark:text-teal-500" @click="onView(row)">View</button>
              <button v-if="actionType === 'edit' || actionType === 'both'" class="px-3 py-1 font-semibold text-violet-600 dark:text-teal-500" @click="onEdit(row)">Edit</button>
            </td>
          </tr>
          <tr v-if="!paginatedAndSortedData || paginatedAndSortedData.length === 0">
            <td :colspan="columns.length" class="text-center py-4">No data available.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Pagination -->
  <div class="flex justify-between items-center px-2">
    <button class="px-4 py-2 text-sm text-violet-500 dark:text-teal-500 disabled:text-gray-500 dark:disabled:text-gray-300" :disabled="currentPage === 1" @click="prevPage">Previous</button>
    <span class="text-sm text-gray-700 dark:text-gray-200">Page {{ currentPage }} of {{ totalPages }}</span>
    <button class="px-4 py-2 text-sm text-violet-500 dark:text-teal-500 disabled:text-gray-500 dark:disabled:text-gray-300" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { BarsArrowUpIcon, BarsArrowDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  enableCheckbox: {
    type: Boolean,
    default: false,
  },
  actionType: {
    type: String,
    default: "none",
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["view", "edit", "selection-change"]);

const selectedRows = ref([]);
const currentPage = ref(1);
const activeSortKey = ref("");
const activeSortOrder = ref("asc");

const truncateText = (text, maxLength = 100) => {
  if (!text) return ""; // Ensure there's no error if text is null/undefined
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const totalPages = computed(() => {
  return Math.ceil(props.data.length / props.rowsPerPage);
});

const allSelected = computed(() => {
  return paginatedAndSortedData.value.length > 0 && paginatedAndSortedData.value.every((row) => selectedRows.value.includes(row.id));
});

const paginatedAndSortedData = computed(() => {
  let sortedData = [...props.data];
  if (activeSortKey.value) {
    sortedData.sort((a, b) => {
      const valA = a[activeSortKey.value];
      const valB = b[activeSortKey.value];
      if (valA < valB) return activeSortOrder.value === "asc" ? -1 : 1;
      if (valA > valB) return activeSortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }
  const start = (currentPage.value - 1) * props.rowsPerPage;
  const end = start + props.rowsPerPage;
  return sortedData.slice(start, end);
});

const emitSelectedRows = () => {
  emit("selection-change", selectedRows.value);
};

const toggleAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = paginatedAndSortedData.value.map((row) => row.id);
  }
  emitSelectedRows();
};

const toggleRow = (rowId) => {
  if (selectedRows.value.includes(rowId)) {
    selectedRows.value = selectedRows.value.filter((id) => id !== rowId);
  } else {
    selectedRows.value.push(rowId);
  }
  emitSelectedRows();
};

const handleSort = (columnKey) => {
  if (activeSortKey.value === columnKey) {
    activeSortOrder.value = activeSortOrder.value === "asc" ? "desc" : "asc";
  } else {
    activeSortKey.value = columnKey;
    activeSortOrder.value = "asc";
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const onView = (row) => {
  emit("view", row);
};

const onEdit = (row) => {
  emit("edit", row);
};
</script>
