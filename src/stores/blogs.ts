import { defineStore } from "pinia";

export interface Blog {
  id: number;
  title: string;
  description: string | null;
  category: string[] | null;
  content_md: string;
  created_at: string;
  tags: string[] | null;
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
      if (this.blogs.length > 0 && this.status === this.blogs[0]?.status) {
        console.log("[Store] Using cached blogs");
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true;

      try {
        const response = await fetch("/data/blogs.json");
        const data: Blog[] = await response.json();

        this.blogs = data.filter((blog) => blog.status === this.status);
        this.showNoPostsMessage = this.blogs.length === 0;
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        this.blogs = [];
        this.showNoPostsMessage = false;
      } finally {
        this.isLoading = false;
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
        const response = await fetch("/data/blogs.json");
        const data: Blog[] = await response.json();
        const blog = data.find((blog) => blog.id === id);

        if (!blog) throw new Error(`Blog with id ${id} not found.`);
        return blog;
      } catch (e) {
        throw new Error(
          e instanceof Error ? e.message : "An unknown error occurred."
        );
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
