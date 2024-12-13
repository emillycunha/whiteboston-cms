import { defineStore } from "pinia";

export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

// Define a new Pinia store named "clients".
export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [] as Client[], // Initially an empty array of clients.
    error: null as string | null, // Initially no error message; can store a string or null.
    loading: false, // Indicates whether data is currently being fetched.
  }),

  actions: {
    // Fetch clients from the local JSON file.
    async fetchClients() {
      this.loading = true;
      this.error = null;

      try {
        // Fetch clients from the local JSON file.
        const response = await fetch("/data/clients.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.statusText}`);
        }

        const data: Client[] = await response.json();
        this.clients = data;
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        this.clients = [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single client by ID from the local data.
    async fetchClientById(id: number): Promise<Client | null> {
      this.error = null;

      try {
        const client = this.clients.find((c) => c.id === id);
        if (!client) {
          throw new Error("Client not found.");
        }
        return client;
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        return null;
      }
    },
  },
});
