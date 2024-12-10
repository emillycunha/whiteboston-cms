import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  due_date: string | null;
}

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    loading: false as boolean,
    error: null as string | null,
  }),

  actions: {
    async fetchTasks() {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      this.error = null;
      this.loading = true;

      try {
        const {
          data,
          error,
        }: { data: Task[] | null; error: PostgrestError | null } =
          await supabase.from("tasks").select("*");
        if (error) throw error;
        this.tasks = data || [];
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchCompletedTasks() {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      this.error = null;
      this.loading = true;

      try {
        const {
          data,
          error,
        }: { data: Task[] | null; error: PostgrestError | null } =
          await supabase.from("tasks").select("*").eq("completed", true);
        if (error) throw error;
        this.tasks = data || [];
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchIncompleteTasks() {
      const { $supabase } = useNuxtApp();
      const supabase = $supabase as SupabaseClient;

      this.error = null;
      this.loading = true;

      try {
        const {
          data,
          error,
        }: { data: Task[] | null; error: PostgrestError | null } =
          await supabase.from("tasks").select("*").eq("completed", false);
        if (error) throw error;
        this.tasks = data || [];
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
