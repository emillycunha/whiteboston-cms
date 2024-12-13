import { defineStore } from "pinia";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  due_date: string | null;
}

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    loading: false as boolean,
    error: null as string | null,
  }),

  actions: {
    // Fetch all tasks
    async fetchTasks() {
      this.error = null;
      this.loading = true;

      try {
        const response = await fetch("/data/tasks.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        const data: Task[] = await response.json();
        this.tasks = data || [];
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch only completed tasks
    async fetchCompletedTasks() {
      this.error = null;
      this.loading = true;

      try {
        const response = await fetch("/data/tasks.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        const data: Task[] = await response.json();
        this.tasks = (data || []).filter((task) => task.completed === true);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch only incomplete tasks
    async fetchIncompleteTasks() {
      this.error = null;
      this.loading = true;

      try {
        const response = await fetch("/data/tasks.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        const data: Task[] = await response.json();
        this.tasks = (data || []).filter((task) => task.completed === false);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
