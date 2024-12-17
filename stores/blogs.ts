import { defineStore } from "pinia";

export interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  status?: string;
  tags: string;
  category: string;
  slug: string;
  image: string;
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
      if (!forceRefresh) {
        const cachedBlogs = localStorage.getItem("blogs");
        if (cachedBlogs) {
          console.log("[Store] Using cached blogs from localStorage.");
          this.blogs = JSON.parse(cachedBlogs);
          return;
        }
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        console.log("[Store] Fetching blogs from /api/blogs...");
        const response = await $fetch<Blog[]>("/api/blogs");
        console.log("[Store] Fetched blogs:", response);
        this.blogs = response;
        localStorage.setItem("blogs", JSON.stringify(response));

        console.log("[Store] Blogs successfully stored:", this.blogs);
      } catch (err) {
        console.error("[Store] Error fetching blogs:", err);
        this.error = "Failed to fetch blogs. Please try again.";
      } finally {
        this.isLoading = false;
        console.log("[Store] Loading state set to false.");
      }
    },

    setStatus(newStatus: string) {
      if (this.status !== newStatus) {
        this.status = newStatus;
        this.fetchBlogs();
      }
    },

    async updateBlogStatus(id: number, newStatus: string) {
      const index = this.blogs.findIndex((blog) => blog.id === id);
      if (index !== -1) {
        this.blogs[index].status = newStatus;

        // Simulate saving changes to local file or mock backend
        console.log(`Updated blog with id ${id} to status ${newStatus}`);
      }
    },

    async fetchBlogById(id: number): Promise<Blog> {
      try {
        console.log(
          `[Store] Fetching blog with ID: ${id} from /api/blogs/${id}...`
        );

        // Fetch the blog by ID from the API
        const response = await $fetch<Blog>(`/api/blogs/${id}`);

        console.log(`[Store] Fetched blog with ID: ${id}:`, response);

        if (!response) {
          throw new Error(`Blog with ID ${id} not found.`);
        }

        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error(`[Store] Error fetching blog with ID: ${id}:`, message);
        throw new Error(message);
      }
    },

    async updateBlog(
      updatedBlog: Partial<Blog> & { id: number }
    ): Promise<Blog | null> {
      if (!updatedBlog.id) {
        throw new Error("Blog ID is required to update the blog.");
      }

      try {
        console.log(`[Store] Updating blog with ID: ${updatedBlog.id}...`);

        // Send the updated blog to the backend API
        const response = await $fetch<Blog>(`/api/blogs/${updatedBlog.id}`, {
          method: "PUT",
          body: updatedBlog,
        });

        // Update the local store with the updated blog
        const index = this.blogs.findIndex(
          (blog) => blog.id === updatedBlog.id
        );

        if (index !== -1) {
          this.blogs[index] = response;
          console.log(
            `[Store] Blog with ID ${updatedBlog.id} successfully updated in the store.`
          );
        } else {
          console.warn(
            `[Store] Blog with ID ${updatedBlog.id} not found in the local store.`
          );
        }

        return response;
      } catch (err) {
        console.error(
          `[Store] Failed to update blog with ID: ${updatedBlog.id}`,
          err instanceof Error ? err.message : err
        );
        throw new Error("Failed to update the blog. Please try again.");
      }
    },

    async createBlog(newBlog: Partial<Blog>) {
      try {
        // Make the API call to create the blog
        const response = await $fetch<Blog>("/api/blogs", {
          method: "POST",
          body: newBlog,
        });

        if (!response.id) {
          throw new Error(
            "Failed to create blog: Missing blog ID in response."
          );
        }

        // Force refresh the blogs list from the backend
        await this.fetchBlogs(true);

        return response;
      } catch (err) {
        console.error(
          "Error creating blog:",
          err instanceof Error ? err.message : err
        );
        throw new Error("Unable to create the blog. Please try again later.");
      }
    },
  },
});
