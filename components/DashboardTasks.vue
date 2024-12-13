<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTasksStore } from "~/stores/tasks";
import type { Task } from "~/stores/tasks";

const tasksStore = useTasksStore();

// Access the 4 most recent tasks
const recentTasks = computed(() => {
  return tasksStore.tasks
    .filter((task: Task) => !task.completed) // Filter uncompleted tasks (optional)
    .sort((a: Task, b: Task) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0; // Fallback to 0 for null dates
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
      return dateA - dateB; // Sort by descending order
    });
});

// Track tasks that are in transition
const fadingTasks = ref<number[]>([]);

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

// Load tasks when the component is created.
onMounted(() => {
  const stored = localStorage.getItem("my-tasks");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      for (const storedTask of parsed) {
        const found = tasksStore.tasks.find(
          (t: Task) => t.id === storedTask.id
        );
        if (found) found.completed = storedTask.completed;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
});

tasksStore.fetchTasks();
</script>

<template>
  <h2 class="sr-only">Tasks</h2>
  <div
    class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-slate-700 dark:ring-slate-500"
  >
    <div class="p-6">
      <h2
        class="text-base font-semibold text-gray-900 dark:text-white"
        id="tasks-title"
      >
        Tasks
      </h2>
      <ul class="mt-4 space-y-4">
        <!-- Dynamically Render Tasks -->
        <li
          v-for="task in recentTasks"
          :key="task.id"
          :class="{
            'line-through opacity-50 transition-opacity duration-1000':
              fadingTasks.includes(task.id),
            'opacity-100': !fadingTasks.includes(task.id),
          }"
          class="flex items-center justify-between p-3 bg-gray-100 rounded-lg dark:bg-slate-600"
        >
          <div class="flex items-center space-x-3">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="(event) => toggleTaskCompletion(task.id, (event.target as HTMLInputElement)?.checked || false)"
              class="h-5 w-5 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
            />
            <span
              :class="[
                task.completed ? 'line-through text-gray-500' : 'text-gray-900',
                'text-sm dark:text-white',
              ]"
            >
              {{ task.title }}
            </span>
          </div>
          <span class="text-xs font-medium text-teal-500 dark:text-teal-500">
            Due: {{ task.due_date }}
          </span>
        </li>
      </ul>
      <a
        href="tasks"
        class="mt-6 block text-sm font-semibold text-gray-900 hover:text-violet-500 dark:text-white dark:hover:text-violet-200"
      >
        View all tasks <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </div>
</template>
