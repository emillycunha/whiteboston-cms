<template>
  <div>
    <table class="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <!-- Dynamically generate headers -->
          <th v-for="col in columns" :key="col.key" @click="setSort(col.key)">
            {{ col.label }}
            <span v-if="sortKey === col.key">
              <BarsArrowUpIcon v-if="sortOrder === 'asc'" />
              <BarsArrowDownIcon v-else />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Paginated data -->
        <tr v-for="item in paginatedData" :key="item.id">
          <td v-for="col in columns" :key="col.key">
            {{ getNestedValue(item, col.key) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex justify-between mt-4">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
});

const sortKey = ref(null);
const sortOrder = ref("asc");
const currentPage = ref(1);
const itemsPerPage = 10;

// Sorting logic
const sortedData = computed(() => {
  if (!sortKey.value) return data;
  return [...data].sort((a, b) => {
    const aVal = getNestedValue(a, sortKey.value);
    const bVal = getNestedValue(b, sortKey.value);
    return sortOrder.value === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
});

// Pagination logic
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedData.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(data.length / itemsPerPage));

// Pagination methods
const prevPage = () => currentPage.value--;
const nextPage = () => currentPage.value++;
const setSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

// Utility function
function getNestedValue(obj, path) {
  return path.split(".").reduce((o, key) => (o ? o[key] : null), obj);
}
</script>
