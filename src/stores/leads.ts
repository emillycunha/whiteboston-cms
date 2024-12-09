import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

// Defining the type for "Lead" ensures we know the shape of the data we work with.
// It’s helpful because when we pull these leads into components,
// we’ll have a clear idea of the fields available.
export interface Lead {
  id: number; // Unique identifier
  name: string; // Lead’s name
  email: string | null; // Contact email, if available
  interest: string | null; // Potential interest area (e.g., product or service)
  submitted_at: string; // Timestamp of when the lead was created
}

// The store is made available to any component or page that imports it.
// Once fetched, the leads array can be used directly in your templates,
// such as listing all leads, filtering them, or passing them as props to other components.
export const useLeadsStore = defineStore("leads", {
  state: () => ({
    leads: [] as Lead[], // The array of leads data to display
    error: null as string | null, // Any error messages will be stored here if fetching fails
    loading: false, // Indicates if we’re currently fetching leads
  }),
  actions: {
    // This action retrieves the leads from the database.
    // By calling this method in, say, the mounted hook of a page component,
    // you can ensure that the leads are loaded before display.
    async fetchLeads() {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      // Set loading to true, so that in your pages or components
      // you could show a loading spinner or message while data is being fetched.
      this.loading = true;
      this.error = null;

      try {
        // Fetching data from the "leads" table.
        // In your pages, you might do something like:
        // const leadsStore = useLeadsStore();
        // await leadsStore.fetchLeads();
        // After the await, leadsStore.leads will have the retrieved data ready.
        const {
          data,
          error,
        }: { data: Lead[] | null; error: PostgrestError | null } =
          await supabase
            .from("leads") // Points to the "leads" table in your database
            .select("*"); // Gets all columns. You could be more specific if needed.

        // If there’s an error returned by Supabase, we throw it to be handled below.
        if (error) throw error;

        // If everything is successful, we store the fetched data in this.leads.
        // In your pages, you can then do something like:
        // <template>
        //   <div v-if="leadsStore.loading">Loading...</div>
        //   <ul v-else>
        //     <li v-for="lead in leadsStore.leads" :key="lead.id">
        //       {{ lead.name }} - {{ lead.email }}
        //     </li>
        //   </ul>
        // </template>
        this.leads = data || [];
      } catch (e) {
        // If an error occurs, you can display this error message in the page:
        // <div v-if="leadsStore.error">Error: {{ leadsStore.error }}</div>
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        this.leads = [];
      } finally {
        // Once done loading, we set loading to false.
        // Your page could hide the loading spinner at this point.
        this.loading = false;
      }
    },

    async fetchLeadById(id: number): Promise<Lead> {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data as Lead;
    },
  },
});

/*
  USAGE NOTES IN YOUR PAGES:
  --------------------------

  // 1. Import and use the leads store in a page component:
  //    import { useLeadsStore } from '~/stores/leads';
  //    const leadsStore = useLeadsStore();

  // 2. Fetch the leads when the page component is mounted or server-side:
  //    onMounted(() => {
  //      leadsStore.fetchLeads();
  //    });

  //    If using Nuxt’s server hooks, you could also pre-fetch data on the server
  //    so that when the user loads the page, data is already there.

  // 3. In the template, display the leads:
  //    <template>
  //      <div v-if="leadsStore.loading">Loading leads, please wait...</div>
  //      <div v-else-if="leadsStore.error">Error: {{ leadsStore.error }}</div>
  //      <ul v-else>
  //        <li v-for="lead in leadsStore.leads" :key="lead.id">
  //          {{ lead.name }} - {{ lead.email }} - Interested in: {{ lead.interest }}
  //        </li>
  //      </ul>
  //    </template>

  // This approach integrates the store’s data and state directly into your pages,
  // making it easy to handle loading states, display errors, and render content.
*/
