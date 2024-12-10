<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

import {
  ChevronLeftIcon,
  PlusIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/20/solid";

import { useTasksStore } from "~/stores/tasks";
import type { Task } from "~/stores/tasks";

const tasksStore = useTasksStore();

// Track tasks that are in transition
const fadingTasks = ref<number[]>([]);

// Define columns with completed as the first column
const columns = [
  { key: "completed", label: "Status" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "due_date", label: "Due Date" },
];

// Default sorting by completed so incomplete tasks appear at the top
const sortKey = ref<string | null>("completed");
const sortOrder = ref<"asc" | "desc">("asc");

// State for editing
const editingTaskId = ref<number | null>(null);

// Compute sorted tasks
const sortedTasks = computed(() => {
  if (!sortKey.value) return tasksStore.tasks;

  return [...tasksStore.tasks].sort((a, b) => {
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
    // Toggle sort order if clicking on the same column
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Set a new column to sort by
    sortKey.value = column;
    sortOrder.value = "asc";
  }
}

// Toggle the completion status of a task
function toggleTaskCompletion(taskId: number, completed: boolean) {
  const idx = tasksStore.tasks.findIndex((t: Task) => t.id === taskId);

  if (idx !== -1) {
    // Add the task to the fading state
    fadingTasks.value.push(taskId);

    // Apply the completed state for the line-through effect
    setTimeout(() => {
      tasksStore.tasks[idx].completed = completed;

      // After the delay, remove the task from the fading list and hide it
      setTimeout(() => {
        // Remove task from tasksStore (or hide it by filtering)
        tasksStore.tasks = tasksStore.tasks.filter(
          (t: Task) => t.id !== taskId
        );

        // Remove task from fading list
        fadingTasks.value = fadingTasks.value.filter((id) => id !== taskId);

        // Update localStorage
        localStorage.setItem("my-tasks", JSON.stringify(tasksStore.tasks));
      }, 3000); // Delay for hiding after showing as completed
    }, 2000); // Delay for showing line-through effect
  }
}

// As a placeholder, try loading from localStorage after fetching:
watch(
  () => tasksStore.tasks,
  (newTasks: Task[]) => {
    // On first load, if we have stored tasks in localStorage, load them
    onMounted(() => {
      const stored = localStorage.getItem("my-tasks");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge tasks with stored completion states if IDs match
          // (assuming localStorage only affects completion)
          for (const storedTask of parsed) {
            const found = newTasks.find((t: Task) => t.id === storedTask.id);
            if (found) found.completed = storedTask.completed;
          }
        } catch (e) {
          // If parse fails, ignore
        }
      }
    });
  },
  { immediate: true }
);

// Toggle the editing mode for a specific task
function toggleEdit(taskId: number) {
  editingTaskId.value = editingTaskId.value === taskId ? null : taskId;
}

// Save the changes locally
function saveTask(task: Task) {
  const idx = tasksStore.tasks.findIndex((t) => t.id === task.id);
  if (idx !== -1) {
    tasksStore.tasks[idx] = { ...task }; // Update the task
    localStorage.setItem("my-tasks", JSON.stringify(tasksStore.tasks)); // Save to localStorage
  }
  editingTaskId.value = null; // Exit edit mode
}

// Load tasks when the component is created.
tasksStore.fetchIncompleteTasks();
</script>

<template>
  <div class="p-2 sm:p-6 space-y-10">
    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Tasks
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <a
          href="/tasks/completed"
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          See Completed Tasks
        </a>
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
      <div v-if="tasksStore.loading">Loading tasks, please wait...</div>
      <div v-else-if="tasksStore.error">Error: {{ tasksStore.error }}</div>
      <table v-else class="min-w-full divide-y divide-gray-300">
        <thead class="dark:text-white">
          <tr>
            <!-- Create headers dynamically -->
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
          <tr
            v-for="task in sortedTasks"
            :key="task.id"
            :class="{
              'line-through opacity-50 transition-opacity duration-1000':
                fadingTasks.includes(task.id),
              'opacity-100': !fadingTasks.includes(task.id),
            }"
          >
            <!-- Completed column: clickable checkbox -->
            <td class="py-4 px-3 text-sm font-medium">
              <input
                type="checkbox"
                class="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                :checked="task.completed"
                @change="(event) => toggleTaskCompletion(task.id, (event.target as HTMLInputElement)?.checked || false)"
              />
            </td>

            <!-- Title with strikethrough if completed -->
            <td class="py-4 px-3 text-sm font-medium">
              <template v-if="editingTaskId === task.id">
                <input
                  v-model="task.title"
                  class="w-full border border-gray-300 rounded px-2 py-1"
                />
              </template>
              <template v-else>
                <span
                  :class="task.completed ? 'line-through duration-1000' : ''"
                >
                  {{ task.title }}</span
                >
              </template>
            </td>

            <!-- Description -->
            <td class="py-4 px-3 text-sm font-medium">
              <template v-if="editingTaskId === task.id">
                <input
                  v-model="task.description"
                  class="w-full border border-gray-300 rounded px-2 py-1"
                />
              </template>
              <template v-else>
                <span>
                  {{ task.description }}
                </span>
              </template>
            </td>

            <!-- Created At -->
            <td class="py-4 px-3 text-sm font-medium">
              <template v-if="editingTaskId === task.id">
                <input
                  type="date"
                  v-model="task.due_date"
                  class="border border-gray-300 rounded px-2 py-1"
                />
              </template>
              <template v-else>
                <span>
                  {{
                    task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "N/A"
                  }}
                </span>
              </template>
            </td>

            <td class="py-4 px-3 text-right text-sm font-medium">
              <template v-if="editingTaskId === task.id">
                <button
                  class="text-teal-500 hover:text-green-700"
                  @click="saveTask(task)"
                >
                  Save
                </button>
              </template>
              <template v-else>
                <button
                  class="text-violet-500 hover:text-violet-900"
                  @click="toggleEdit(task.id)"
                >
                  Edit
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
