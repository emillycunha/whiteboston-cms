import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

// First, we define the structure of a single task.
// This helps ensure consistent usage of task data throughout the application.
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  due_date: string | null;
}

// Now we create the "tasks" store. Each store is essentially a container
// for state, getters, and actions related to a specific part of the app.
// In this case, the store focuses on tasks management.
export const useTasksStore = defineStore("tasks", {
  // The state function returns an object that defines the store's reactive properties.
  // Every component that uses this store will see updates when these properties change.
  state: () => ({
    tasks: [] as Task[], // We'll hold our array of tasks here, initially empty.
    loading: false as boolean, // A flag to indicate when we're in the midst of a data request.
    error: null as string | null, // If something goes wrong, we capture a brief message here.
  }),

  // Actions are methods that carry out logic involving the state, such as fetching data.
  // They can be asynchronous and can directly mutate the store's state.
  actions: {
    // Here we define a method to load all the tasks from the database.
    // We'll rely on a service like Supabase to query data.
    async fetchTasks() {
      // Accessing the Nuxt application instance to reach the Supabase client
      // that was integrated into the Nuxt environment.
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      // Before attempting any data retrieval, it's good practice to
      // reset any previous error and let the application know we’re loading data.
      this.error = null;
      this.loading = true;

      try {
        // Requesting all tasks from the "tasks" table.
        // The select("*") means we want all columns from each record.
        const {
          data,
          error,
        }: { data: Task[] | null; error: PostgrestError | null } =
          await supabase.from("tasks").select("*");

        // If Supabase returns an error object, we throw it to trigger the catch block below.
        if (error) throw error;

        // If all goes well, we store the retrieved tasks. If no records were found, data might be null.
        // Using `data || []` ensures we have an array even if no tasks exist.
        this.tasks = data || [];
      } catch (err) {
        // If something fails, for instance a network error or a query problem,
        // we assign a user-friendly message to the error property.
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";

        // If there was a problem, it’s often safest to clear out any potentially stale data.
        this.tasks = [];
      } finally {
        // Once the request wraps up, we let the rest of the app know loading has ended.
        this.loading = false;
      }
    },

    // You can add more actions here to add, update, or delete tasks as needed.
    // Each of these would follow a similar pattern of setting loading states,
    // handling potential errors, and updating the tasks array accordingly.
  },
});
