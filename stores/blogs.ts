import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  status?: string;
  tags: string;
  category: string;
  slug: string;
  image: string;
  org_id: number;
}

export const useBlogsStore = defineStore("blogs", {
  state: () => ({
    blogs: [] as Blog[],
    status: "published",
    error: null as string | null,
    showNoPostsMessage: false,
    isLoading: false,
  }),
  actions: {
    async fetchBlogs(forceRefresh = false) {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated || !authStore.role) {
        console.warn(
          "[Blogs Store] User is not authenticated or role is missing."
        );
        this.error = "You must be logged in to view blogs.";
        return;
      }

      if (!forceRefresh) {
        const cachedBlogs = localStorage.getItem("blogs");
        if (cachedBlogs) {
          const parsedBlogs = JSON.parse(cachedBlogs);
          if (Array.isArray(parsedBlogs) && parsedBlogs.length > 0) {
            console.log("[Store] Using cached blogs from localStorage.");
            this.blogs = parsedBlogs;
            return;
          }
        }
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching blogs based on role...");

        let query = $supabase.from("blogs").select("*");

        if (authStore.role === "SuperAdmin") {
          console.log("[Store] SuperAdmin fetching all blogs");
        } else if (authStore.role === "Admin") {
          console.log(
            "[Store] Admin fetching blogs by org_id:",
            authStore.org_id
          );
          query = query.eq("org_id", authStore.org_id);
        } else if (authStore.role === "Editor") {
          console.log(
            "[Store] Editor fetching blogs by author_id:",
            authStore.userId
          );
          query = query.eq("author_id", authStore.userId);
        } else {
          throw new Error("Unsupported role. Cannot fetch blogs.");
        }

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        console.log("[Store] Fetched blogs from Supabase:", data);
        this.blogs = data || [];

        if (this.blogs.length > 0) {
          localStorage.setItem("blogs", JSON.stringify(this.blogs));
        }

        console.log("[Store] Blogs successfully stored:", this.blogs);
      } catch (err) {
        console.error("[Store] Error fetching blogs:", err);
        this.error = "Failed to fetch blogs. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    async fetchBlogById(id: number): Promise<Blog> {
      const { $supabase } = useNuxtApp();
      const authStore = useAuthStore(); // Access the auth store for role and ID

      try {
        // Check if the blog already exists in the fetched blogs
        const existingBlog = this.blogs.find((blog) => blog.id === id);
        if (existingBlog) {
          console.log(`[Store] Found blog with ID ${id} in cached blogs.`);
          return existingBlog;
        }

        console.log(`[Store] Fetching blog with ID: ${id} from Supabase...`);

        // Start the query
        let query = $supabase.from("blogs").select("*").eq("id", id);

        // Apply role-based filters
        if (authStore.role === "SuperAdmin") {
          console.log("[Store] SuperAdmin fetching all blogs");
        } else if (authStore.role === "Admin") {
          console.log(
            `[Store] Admin fetching blog with org_id: ${authStore.org_id}`
          );
          query = query.eq("org_id", authStore.org_id);
        } else if (authStore.role === "Editor") {
          console.log(
            `[Store] Editor fetching blog authored by userId: ${authStore.userId}`
          );
          query = query.eq("author_id", authStore.userId);
        } else {
          throw new Error("Unsupported role. Cannot fetch blog.");
        }

        // Execute query
        const { data, error } = await query.single();

        if (error) throw new Error(error.message);
        if (!data)
          throw new Error(
            `Blog with ID ${id} not found or access is restricted.`
          );

        console.log(`[Store] Fetched blog with ID ${id}:`, data);

        // Optionally add the newly fetched blog to the local blogs array
        this.blogs.push(data);

        return data;
      } catch (err) {
        console.error(`[Store] Error fetching blog with ID ${id}:`, err);
        throw new Error(err instanceof Error ? err.message : "Unknown error.");
      }
    },

    async updateBlog(
      updatedBlog: Partial<Blog> & { id: number }
    ): Promise<Blog | null> {
      const { $supabase } = useNuxtApp();

      try {
        console.log(
          `[Store] Updating blog with ID: ${updatedBlog.id} in Supabase...`
        );

        const { data, error } = await $supabase
          .from("blogs")
          .update(updatedBlog)
          .eq("id", updatedBlog.id)
          .select("*")
          .single();

        if (error) throw new Error(error.message);

        const index = this.blogs.findIndex(
          (blog) => blog.id === updatedBlog.id
        );
        if (index !== -1) {
          this.blogs[index] = data;
          console.log(
            `[Store] Blog with ID ${updatedBlog.id} updated locally.`
          );
        }

        return data;
      } catch (err) {
        console.error(
          `[Store] Failed to update blog with ID ${updatedBlog.id}:`,
          err
        );
        throw new Error("Failed to update the blog. Please try again.");
      }
    },

    async createBlog(newBlog: Partial<Blog>) {
      const { $supabase } = useNuxtApp();

      try {
        console.log("[Store] Creating a new blog in Supabase...");

        const { data, error } = await $supabase
          .from("blogs")
          .insert([newBlog])
          .select("*")
          .single();

        if (error) throw new Error(error.message);
        if (!data.id)
          throw new Error(
            "Failed to create blog: Missing blog ID in response."
          );

        console.log("[Store] New blog created:", data);

        // Refresh the list of blogs
        await this.fetchBlogs(true);

        return data;
      } catch (err) {
        console.error("[Store] Error creating blog:", err);
        throw new Error("Unable to create the blog. Please try again later.");
      }
    },
  },
});
