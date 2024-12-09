import { defineStore } from "pinia"; // Importing the defineStore function from Pinia, the state management library for Vue.
import { useNuxtApp } from "#app"; // A Nuxt 3 composable to access the Nuxt application instance.
import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js"; // Importing types for Supabase client and PostgrestError for type safety.

export interface Client {
  // The interface defines the shape of the data for a client.
  id: number; // Each client record's unique identifier (primary key).
  name: string; // The client's name.
  email: string | null; // The client's email, which can be null if not provided.
  phone: string | null; // The client's phone number, which can be null if not provided.
  created_at: string; // The timestamp of when the client record was created in the database.
}

// We define a new Pinia store named "clients". Pinia is a state-management solution
// that allows us to create reactive stores. This store will handle fetching and
// storing a list of clients from the database, managing loading states, and tracking errors.

export const useClientsStore = defineStore("clients", {
  // The state() function returns a state object that becomes the store's internal reactive state.
  // Here we define an array of clients, an error message if any occur during data fetching,
  // and a loading boolean to indicate when data is being fetched.
  state: () => ({
    clients: [] as Client[], // Initially an empty array of clients.
    error: null as string | null, // Initially no error message; can store a string or null.
    loading: false, // Indicates whether data is currently being fetched.
  }),

  // Actions are methods that can change state and contain logic (e.g., asynchronous API calls).
  // They can use async/await and handle side effects. Unlike mutations in Vuex,
  // actions in Pinia can directly modify state since Pinia doesn’t enforce the same restrictions.
  actions: {
    // The fetchClients action is responsible for fetching the list of clients from the database.
    async fetchClients() {
      // useNuxtApp() gives us access to the Nuxt application instance in a Nuxt 3 environment.
      // We can retrieve the $supabase instance that was presumably injected into the Nuxt context.
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient; // Casting to the known SupabaseClient type for better type checking.

      // Before performing the network request, set loading to true and clear any previous error message.
      this.loading = true;
      this.error = null;

      try {
        // Using the Supabase client to query the "clients" table.
        // .from("clients") indicates which table to pull from.
        // .select("*") means we retrieve all columns from each client record.
        const {
          data,
          error,
        }: { data: Client[] | null; error: PostgrestError | null } =
          await supabase
            .from("clients") // Replace with your table name if different.
            .select("*"); // Adjust the columns as needed, e.g., select('id,name,email').

        // If the `error` object returned by Supabase is not null, throw it to be caught in the catch block.
        if (error) throw error;

        // If no error, the fetched data (an array of clients) will be assigned to this.clients.
        // If data is null (unexpected, but could happen if no rows found), fallback to an empty array.
        this.clients = data || [];
      } catch (e) {
        // If an error occurs during the fetch operation:
        // We set this.error to a human-readable message. If it's an instance of Error,
        // use its message property; otherwise, use a generic unknown error message.
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";

        // In case of error, reset the clients array to empty, as we couldn't fetch any valid data.
        this.clients = [];
      } finally {
        // Finally, when the request finishes (either success or error), set loading back to false.
        this.loading = false;
      }
    },

    async fetchClientById(id: number): Promise<Client> {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data as Client;
    },
  },
});
