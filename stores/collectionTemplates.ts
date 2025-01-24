import { defineStore } from "pinia";

interface Option {
  value: string;
  label: string;
}

interface Field {
  name: string;
  type: string;
  is_required: boolean;
  options?: Option[];
  position?: number;
}

interface PredefinedCollection {
  name: string;
  slug: string;
  fields: Field[];
}

export const usePredefinedCollectionsStore = defineStore(
  "predefinedCollections",
  {
    state: () => ({
      predefinedCollections: [] as PredefinedCollection[],
    }),
    actions: {
      initializeCollections() {
        if (this.predefinedCollections.length > 0) {
          console.warn(
            "[Debug] Predefined collections are already initialized."
          );
          return;
        }

        console.log("[Debug] Initializing predefined collections...");

        this.predefinedCollections = [
          {
            name: "Blogs",
            slug: "blogs",
            fields: [
              { name: "Title", type: "text", is_required: true, position: 1 },
              { name: "Slug", type: "text", is_required: true, position: 2 },
              { name: "Author", type: "text", is_required: true, position: 3 },
              {
                name: "Excerpt",
                type: "text",
                is_required: false,
                position: 4,
              },
              {
                name: "Content",
                type: "richtextmarkdown",
                is_required: true,
                position: 5,
              },
              {
                name: "Category",
                type: "text",
                is_required: false,
                position: 6,
              },
              { name: "Tags", type: "text", is_required: false, position: 7 },
              {
                name: "Status",
                type: "select",
                is_required: true,
                position: 8,
                options: [
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ],
              },
              {
                name: "Featured",
                type: "boolean",
                is_required: false,
                position: 9,
              },
              {
                name: "Featured Image",
                type: "image",
                is_required: false,
                position: 10,
              },
            ],
          },
          {
            name: "Contacts",
            slug: "contacts",
            fields: [
              {
                name: "First Name",
                type: "text",
                is_required: true,
                position: 1,
              },
              {
                name: "Last Name",
                type: "text",
                is_required: true,
                position: 2,
              },
              { name: "Email", type: "email", is_required: true, position: 3 },
              { name: "Phone", type: "text", is_required: false, position: 4 },
              {
                name: "Company",
                type: "text",
                is_required: false,
                position: 5,
              },
            ],
          },
          {
            name: "Leads",
            slug: "leads",
            fields: [
              { name: "Name", type: "text", is_required: true, position: 1 },
              { name: "Email", type: "email", is_required: true, position: 2 },
              { name: "Phone", type: "tel", is_required: false, position: 3 },
              {
                name: "Status",
                type: "select",
                is_required: false,
                options: [
                  { value: "new", label: "New" },
                  { value: "contacted", label: "Contacted" },
                  { value: "converted", label: "Converted" },
                ],
                position: 4,
              },
            ],
          },
          {
            name: "Events",
            slug: "events",
            fields: [
              {
                name: "Event Name",
                type: "text",
                is_required: true,
                position: 1,
              },
              { name: "Date", type: "date", is_required: true, position: 2 },
              {
                name: "Location",
                type: "text",
                is_required: false,
                position: 3,
              },
              {
                name: "Type",
                type: "select",
                is_required: true,
                options: [
                  { value: "webinar", label: "Webinar" },
                  { value: "workshop", label: "Workshop" },
                  { value: "conference", label: "Conference" },
                ],
                position: 4,
              },
            ],
          },
          {
            name: "Products",
            slug: "products",
            fields: [
              {
                name: "Product Name",
                type: "text",
                is_required: true,
                position: 1,
              },
              { name: "Price", type: "number", is_required: true, position: 2 },
              {
                name: "Description",
                type: "textarea",
                is_required: false,
                position: 3,
              },
              {
                name: "Category",
                type: "select",
                is_required: false,
                options: [
                  { value: "electronics", label: "Electronics" },
                  { value: "furniture", label: "Furniture" },
                  { value: "apparel", label: "Apparel" },
                ],
                position: 4,
              },
            ],
          },
        ];
        console.log(
          "[Debug] Predefined collections initialized:",
          this.predefinedCollections
        );
      },

      // Get predefined fields for a collection by slug
      getFieldsForCollection(slug: string): Field[] {
        console.log("[Debug] Looking for predefined fields for slug:", slug);

        // Log all predefined collection slugs for comparison
        console.log(
          "[Debug] Available predefined collection slugs:",
          this.predefinedCollections.map((col) => col.slug)
        );

        // Find the collection by slug
        const collection = this.predefinedCollections.find(
          (col) => col.slug === slug
        );

        // Check if the collection is found
        if (!collection) {
          console.warn(`[Debug] No predefined fields found for slug: ${slug}`);
          return [];
        }

        console.log(
          `[Debug] Predefined fields found for collection "${slug}":`,
          collection.fields
        );

        return collection.fields;
      },

      // Generate fields for a new collection
      generateFieldsForCollection(slug: string): Field[] {
        console.log("[Debug] Generating fields for collection slug:", slug);

        // Fetch fields using getFieldsForCollection
        const fields = this.getFieldsForCollection(slug);

        // Log the fields fetched
        if (!fields.length) {
          console.warn(`[Debug] No predefined fields for collection: ${slug}`);
        } else {
          console.log(
            `[Debug] Fields successfully fetched for "${slug}":`,
            fields
          );
        }

        return fields.map((field) => ({
          ...field,
          value: "", // Default value for all fields
        }));
      },
    },
    getters: {
      // Get all predefined collections
      allCollections: (state) =>
        state.predefinedCollections.map((col) => col.name),
    },
  }
);
