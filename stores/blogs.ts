import { defineStore } from "pinia";

export interface Blog {
  id: number;
  title: string;
  description: string;
  category: string;
  content: string;
  created_at: string;
  tags: string;
  slug: string;
  status?: string;
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
    async fetchBlogs() {
      // Check if blogs are stored in localStorage
      const cachedBlogs = localStorage.getItem("blogs");
      if (cachedBlogs) {
        console.log("[Store] Using cached blogs from localStorage.");
        this.blogs = JSON.parse(cachedBlogs);
        return;
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
      const index = this.blogs.findIndex((blog) => blog.id === updatedBlog.id);
      if (index !== -1) {
        this.blogs[index] = { ...this.blogs[index], ...updatedBlog };

        // Simulate saving changes to local file or mock backend
        console.log(`Updated blog with id ${updatedBlog.id}`);
        return this.blogs[index];
      }

      return null;
    },
  },
});
