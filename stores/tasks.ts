import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

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
      const { $supabase } = useNuxtApp(); // Access Supabase client

      // Check if tasks are stored in localStorage
      const cachedTasks = localStorage.getItem("tasks");
      if (cachedTasks) {
        console.log("[Store] Using cached tasks from localStorage.");
        this.tasks = JSON.parse(cachedTasks);
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching tasks from Supabase...");
        const { data, error } = await $supabase.from("tasks").select("*");

        if (error) throw new Error(error.message);

        console.log("[Store] Fetched tasks from Supabase:", data);
        this.tasks = data || [];
        localStorage.setItem("tasks", JSON.stringify(this.tasks));

        console.log("[Store] Tasks successfully stored:", this.tasks);
      } catch (err) {
        console.error("[Store] Error fetching tasks:", err);
        this.error = "Failed to fetch tasks. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchTaskById(id: number): Promise<Task> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(`[Store] Fetching task with ID: ${id} from Supabase...`);

        const { data, error } = await $supabase
          .from("tasks")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error(`Task with ID ${id} not found.`);

        console.log(`[Store] Fetched task with ID ${id}:`, data);
        return data;
      } catch (err) {
        console.error(`[Store] Error fetching task with ID ${id}:`, err);
        throw new Error(err instanceof Error ? err.message : "Unknown error.");
      }
    },

    async updateTask(
      updatedTask: Partial<Task> & { id: number }
    ): Promise<Task | null> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(
          `[Store] Updating task with ID: ${updatedTask.id} in Supabase...`
        );

        const { data, error } = await $supabase
          .from("tasks")
          .update(updatedTask)
          .eq("id", updatedTask.id)
          .select("*")
          .single();

        if (error) throw new Error(error.message);

        const index = this.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          this.tasks[index] = data;
          console.log(
            `[Store] Task with ID ${updatedTask.id} updated locally.`
          );
        }

        return data;
      } catch (err) {
        console.error(
          `[Store] Failed to update task with ID ${updatedTask.id}:`,
          err
        );
        throw new Error("Failed to update the task. Please try again.");
      }
    },
  },
});
