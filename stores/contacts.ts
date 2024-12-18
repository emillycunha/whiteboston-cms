import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export interface Contact {
  id: number;
  org_id: number;
  owner_id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const useContactsStore = defineStore("contacts", {
  state: () => ({
    contacts: [] as Contact[],
    error: null as string | null,
    showNoPostsMessage: false,
    isLoading: false,
  }),
  actions: {
    async fetchContacts() {
      const { $supabase } = useNuxtApp(); // Access Supabase client

      // Check if contacts are stored in localStorage
      const cachedContacts = localStorage.getItem("contacts");
      if (cachedContacts) {
        console.log("[Store] Using cached contacts from localStorage.");
        this.contacts = JSON.parse(cachedContacts);
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching contacts from Supabase...");
        const { data, error } = await $supabase.from("contacts").select("*");

        if (error) throw new Error(error.message);

        console.log("[Store] Fetched contacts from Supabase:", data);
        this.contacts = data || [];
        localStorage.setItem("contacts", JSON.stringify(this.contacts));

        console.log("[Store] Contacts successfully stored:", this.contacts);
      } catch (err) {
        console.error("[Store] Error fetching contacts:", err);
        this.error = "Failed to fetch contacts. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchContactById(id: number): Promise<Contact> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(`[Store] Fetching contact with ID: ${id} from Supabase...`);

        const { data, error } = await $supabase
          .from("contacts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error(`Contact with ID ${id} not found.`);

        console.log(`[Store] Fetched contact with ID ${id}:`, data);
        return data;
      } catch (err) {
        console.error(`[Store] Error fetching contact with ID ${id}:`, err);
        throw new Error(err instanceof Error ? err.message : "Unknown error.");
      }
    },

    async updateContact(
      updatedContact: Partial<Contact> & { id: number }
    ): Promise<Contact | null> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(
          `[Store] Updating contact with ID: ${updatedContact.id} in Supabase...`
        );

        const { data, error } = await $supabase
          .from("contacts")
          .update(updatedContact)
          .eq("id", updatedContact.id)
          .select("*")
          .single();

        if (error) throw new Error(error.message);

        const index = this.contacts.findIndex(
          (contact) => contact.id === updatedContact.id
        );
        if (index !== -1) {
          this.contacts[index] = data;
          console.log(
            `[Store] Contact with ID ${updatedContact.id} updated locally.`
          );
        } else {
          console.warn(
            `[Store] Contact with ID ${updatedContact.id} not found in the store.`
          );
        }

        return data;
      } catch (err) {
        console.error(
          `[Store] Failed to update contact with ID ${updatedContact.id}:`,
          err
        );
        throw new Error("Failed to update the contact. Please try again.");
      }
    },
  },
});
