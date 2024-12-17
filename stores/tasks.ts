import { defineStore } from "pinia";

export interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: string;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  priority: string;
  user_id: number;
}

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    error: null as string | null,
    showNoPostsMessage: false,
    isLoading: false,
  }),

  actions: {
    async fetchTasks() {
      // Check if tasks are stored in localStorage
      const cachedtasks = localStorage.getItem("tasks");
      if (cachedtasks) {
        console.log("[Store] Using cached tasks from localStorage.");
        this.tasks = JSON.parse(cachedtasks);
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching tasks from /api/tasks...");
        const response = await $fetch<Task[]>("/api/tasks");
        console.log("[Store] Fetched tasks:", response);
        this.tasks = response;
        localStorage.setItem("tasks", JSON.stringify(response));

        console.log("[Store] tasks successfully stored:", this.tasks);
      } catch (err) {
        console.error("[Store] Error fetching tasks:", err);
        this.error = "Failed to fetch tasks. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchTaskById(id: number): Promise<Task> {
      try {
        console.log(
          `[Store] Fetching task with ID: ${id} from /api/tasks/${id}...`
        );

        // Fetch the task by ID from the API
        const response = await $fetch<Task>(`/api/tasks/${id}`);

        console.log(`[Store] Fetched task with ID: ${id}:`, response);

        if (!response) {
          throw new Error(`task with ID ${id} not found.`);
        }

        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error(`[Store] Error fetching task with ID: ${id}:`, message);
        throw new Error(message);
      }
    },

    async updateTask(
      updatedtask: Partial<Task> & { id: number }
    ): Promise<Task | null> {
      const index = this.tasks.findIndex((task) => task.id === updatedtask.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedtask };

        // Simulate saving changes to local file or mock backend
        console.log(`Updated task with id ${updatedtask.id}`);
        return this.tasks[index];
      }

      return null;
    },
  },
});
