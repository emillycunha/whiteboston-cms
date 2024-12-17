import { defineStore } from "pinia";

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  created_at: string;
  updated_at: string;
  notes: string;
  user_id: number;
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
      // Check if contacts are stored in localStorage
      const cachedcontacts = localStorage.getItem("contacts");
      if (cachedcontacts) {
        console.log("[Store] Using cached contacts from localStorage.");
        this.contacts = JSON.parse(cachedcontacts);
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching contacts from /api/contacts...");
        const response = await $fetch<Contact[]>("/api/contacts");
        console.log("[Store] Fetched contacts:", response);
        this.contacts = response;
        localStorage.setItem("contacts", JSON.stringify(response));

        console.log("[Store] contacts successfully stored:", this.contacts);
      } catch (err) {
        console.error("[Store] Error fetching contacts:", err);
        this.error = "Failed to fetch contacts. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchContactById(id: number): Promise<Contact> {
      try {
        console.log(
          `[Store] Fetching contact with ID: ${id} from /api/contacts/${id}...`
        );

        // Fetch the contact by ID from the API
        const response = await $fetch<Contact>(`/api/contacts/${id}`);

        console.log(`[Store] Fetched contact with ID: ${id}:`, response);

        if (!response) {
          throw new Error(`Contact with ID ${id} not found.`);
        }

        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error(
          `[Store] Error fetching contact with ID: ${id}:`,
          message
        );
        throw new Error(message);
      }
    },

    async updateContact(
      updatedContact: Partial<Contact> & { id: number }
    ): Promise<Contact | null> {
      try {
        // Send updated contact to the backend API
        const response = await $fetch<Contact>(
          `/api/contacts/${updatedContact.id}`,
          {
            method: "PUT",
            body: updatedContact, // Send only updated fields
          }
        );

        // Update the local store with the updated contact
        const index = this.contacts.findIndex(
          (contact) => contact.id === updatedContact.id
        );
        if (index !== -1) {
          this.contacts[index] = response;
          console.log(
            `Updated contact with ID ${updatedContact.id} in the store.`
          );
        } else {
          console.warn(
            `Contact with ID ${updatedContact.id} not found in the store.`
          );
        }

        return response;
      } catch (err) {
        console.error(
          `Failed to update contact with ID: ${updatedContact.id}`,
          err
        );
        throw new Error("Failed to update the contact. Please try again.");
      }
    },
  },
});
