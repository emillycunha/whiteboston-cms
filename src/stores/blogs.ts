import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

// By defining an interface, we ensure every blog object follows the same shape,
// making it easier to work with these objects in our front end.
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
  // The state function returns an object containing reactive properties.
  // We’ve added "isLoading" to track when we’re fetching data.
  // Our components can reactively display a loading indicator based on this value.
  state: () => ({
    blogs: [] as Blog[],
    status: "published",
    error: null as string | null,
    showNoPostsMessage: false,
    isLoading: false, // A boolean to indicate when blogs are being fetched.
  }),
  actions: {
    // The fetchBlogs action retrieves a list of blogs from the database.
    // Before making the request, we set isLoading to true, and once it’s done,
    // we return it to false. In your front end, you can use this to show a spinner.
    async fetchBlogs() {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      // If we've already loaded blogs with the current status, no need to fetch again.
      // This avoids unnecessary network requests and can speed up your app.
      if (this.blogs.length > 0 && this.status === this.blogs[0]?.status) {
        console.log("[Store] Using cached blogs");
        return;
      }

      this.showNoPostsMessage = false;
      this.error = null;
      this.isLoading = true; // Indicate that a fetch request has started.

      try {
        const {
          data,
          error,
        }: { data: Blog[] | null; error: PostgrestError | null } =
          await supabase.from("blogs").select("*").eq("status", this.status);

        if (error) throw error;

        this.blogs = data || [];
        this.showNoPostsMessage = this.blogs.length === 0;
      } catch (e) {
        // If something goes wrong, display a human-readable error.
        // Also clear out the blogs array to ensure there's no stale data.
        this.error =
          e instanceof Error ? e.message : "An unknown error occurred.";
        this.blogs = [];
        this.showNoPostsMessage = false;
      } finally {
        this.isLoading = false; // Request is done, so we stop loading.
      }
    },

    // setStatus allows us to change the filter (e.g. from 'published' to 'draft')
    // and then fetch the blogs again. This keeps our data in sync with the status filter.
    setStatus(newStatus: string) {
      if (this.status !== newStatus) {
        this.status = newStatus;
        this.fetchBlogs();
      }
    },

    async updateBlogStatus(id: number, newStatus: string) {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      const { data, error } = await supabase
        .from("blogs")
        .update({ status: newStatus })
        .eq("id", id)
        .select("*");

      if (error) throw error;

      const index = this.blogs.findIndex((blog) => blog.id === id);
      if (index !== -1) {
        this.blogs[index].status = newStatus;
      }
    },

    async fetchBlogById(id: number): Promise<Blog> {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data as Blog;
    },

    async updateBlog(
      updatedBlog: Partial<Blog> & { id: number }
    ): Promise<Blog | null> {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      const { data, error } = await supabase
        .from("blogs")
        .update(updatedBlog)
        .eq("id", updatedBlog.id)
        .select("*")
        .single();

      if (error) throw error;

      const index = this.blogs.findIndex((blog) => blog.id === updatedBlog.id);
      if (index !== -1 && data) {
        this.blogs[index] = data as Blog;
        return this.blogs[index];
      }

      return null;
    },
  },
});
