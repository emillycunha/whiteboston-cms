<template>
  <div class="rounded-md bg-white shadow-sm border border-gray-200">
    <div class="p-2 sm:p-4">
      <table class="w-full text-base">
        <thead>
          <tr class="bg-gray-100 text-left text-gray-700">
            <th v-if="enableCheckbox" class="px-4 py-2 w-8">
              <input
                type="checkbox"
                @change="toggleAll"
                :checked="allSelected"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-2 cursor-pointer"
              @click="handleSort(column.key)"
            >
              {{ column.label }}
              <span v-if="activeSortKey === column.key">
                {{ activeSortOrder === "asc" ? "⬆️" : "⬇️" }}
              </span>
            </th>
            <th v-if="actionType !== 'none'" class="px-4 py-2 w-24"></th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700">
          <tr
            v-for="row in paginatedAndSortedData"
            :key="row.id"
            class="even:bg-gray-50"
          >
            <td v-if="enableCheckbox" class="px-4 py-4">
              <input
                type="checkbox"
                :value="row.id"
                :checked="selectedRows.includes(row.id)"
                @change="toggleRow(row.id)"
              />
            </td>
            <td v-for="column in columns" :key="column.key" class="px-4 py-4">
              {{ row[column.key] }}
            </td>
            <td v-if="actionType !== 'none'" class="px-4 py-2">
              <button
                v-if="actionType === 'view'"
                @click="onView(row)"
                class="px-3 py-1 font-semibold text-violet-600"
              >
                View
              </button>
              <button
                v-if="actionType === 'edit'"
                @click="onEdit(row)"
                class="px-3 py-1 font-semibold text-violet-600"
              >
                Edit
              </button>
            </td>
          </tr>
          <tr
            v-if="
              !paginatedAndSortedData || paginatedAndSortedData.length === 0
            "
          >
            <td :colspan="columns.length" class="text-center py-4">
              No data available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Pagination -->
  <div class="flex justify-between items-center px-2">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm text-violet-500 disabled:text-gray-500"
    >
      Previous
    </button>
    <span class="text-sm text-gray-600">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 text-sm text-violet-500 disabled:text-gray-500"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

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
    default: "none", // 'view', 'edit', or 'none'
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["view", "edit"]);

const selectedRows = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const activeSortKey = ref("");
const activeSortOrder = ref("asc");

const totalPages = computed(() => {
  return Math.ceil(props.data.length / itemsPerPage.value);
});

const allSelected = computed(() => {
  return (
    paginatedAndSortedData.value.length > 0 &&
    paginatedAndSortedData.value.every((row) =>
      selectedRows.value.includes(row.id)
    )
  );
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
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
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

<style scoped>
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
