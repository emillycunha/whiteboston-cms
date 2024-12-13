<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import { useBlogsStore } from "~/stores/blogs";
import type { Blog } from "~/stores/blogs";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import {
  EllipsisHorizontalIcon,
  PlusIcon,
  ChevronDownIcon,
  HomeIcon,
} from "@heroicons/vue/20/solid";

import {
  PencilSquareIcon,
  ArrowPathIcon,
  EyeIcon,
} from "@heroicons/vue/24/outline";

// Pinia store
const blogsStore = useBlogsStore();

// Tabs for status
const tabs = [
  { name: "Published", status: "published" },
  { name: "Drafts", status: "draft" },
  { name: "Scheduled", status: "scheduled" },
];

// Fetch blogs on mount
onMounted(() => {
  if (!blogsStore.blogs.length) {
    console.log("[Component] Mounted. Fetching blogs...");
    blogsStore.fetchBlogs();
  }
});

// Update tab status
const setTab = (tab: { name: string; status: string }) => {
  console.log("[Component] Tab clicked:", tab.name, "Status:", tab.status);
  blogsStore.setStatus(tab.status); // Update status in the store.
};

// State to track which blog's menu is open
const openMenuId = ref<number | null>(null);

function toggleMenu(blogId: number) {
  openMenuId.value = openMenuId.value === blogId ? null : blogId;
}

// Menu actions

function editBlog(blogId: number) {
  console.log("Edit blog:", blogId);
  // Navigate to /blogs/[id]/edit
  navigateTo(`/posts/${blogId}/edit`);
}

function viewBlog(blogId: number) {
  console.log("View blog:", blogId);
  // Navigate to /posts/[id]/view
  navigateTo(`/posts/${blogId}/view`);
}

async function revertToDraft(blogId: number) {
  console.log("Revert blog to draft:", blogId);
  // Call the store’s action
  try {
    await blogsStore.updateBlogStatus(blogId, "draft");
    alert("Blog reverted to draft successfully!");
  } catch (error) {
    console.error("Failed to revert blog:", error);
    alert("Failed to revert blog. Please try again.");
  }
}

const postNavigation = [
  { name: "Edit", action: editBlog, icon: PencilSquareIcon },
  { name: "View", action: viewBlog, icon: EyeIcon },
  { name: "Revert to Draft", action: revertToDraft, icon: ArrowPathIcon },
];
</script>

<template>
  <div class="p-2 sm:p-6 space-y-10">
    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Posts
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          More Actions
          <ChevronDownIcon class="ml-2 w-5 h-5" />
        </button>
        <a
          href="/posts/add-post"
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          New Blog
          <PlusIcon class="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-slate-700 pb-5 sm:pb-0">
      <nav class="-mb-px flex space-x-8">
        <a
          v-for="tab in tabs"
          :key="tab.name"
          href="#"
          :class="[
            blogsStore.status === tab.status
              ? 'border-violet-500 text-violet-600 dark:text-white'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white',
            'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
            ,
          ]"
          @click.prevent="setTab(tab)"
        >
          {{ tab.name }}
        </a>
      </nav>
    </div>

    <div
      class="mt-3 sm:mt-4 rounded-lg bg-gray-50 dark:bg-slate-800 p-4 sm:p-8 min-h-[200px] border border-gray-200 dark:border-slate-700 shadow-sm"
    >
      <!-- Blog Table or Message -->
      <div v-if="blogsStore.isLoading">Loading blogs...</div>
      <div v-else-if="blogsStore.error">Error: {{ blogsStore.error }}</div>
      <div v-else-if="blogsStore.showNoPostsMessage">No posts available.</div>
      <table
        v-else
        class="min-w-full divide-y divide-gray-300 dark:divide-slate-700"
      >
        <thead class="dark:text-white">
          <tr>
            <th
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold w-[60%]"
            >
              Title
            </th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold w-1/5">
              Category
            </th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold w-1/5">
              Created
            </th>
            <th class="relative py-3.5 pl-3 pr-4 w-4">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="dark:text-gray-100">
          <tr v-for="blog in blogsStore.blogs" :key="blog.id">
            <td class="py-4 pl-4 pr-3 text-sm font-medium">{{ blog.title }}</td>
            <td class="px-3 py-4 text-sm">
              {{ blog.category?.join(", ") || "N/A" }}
            </td>
            <td class="px-3 py-4 text-sm">
              {{ new Date(blog.created_at).toLocaleDateString() }}
            </td>
            <td class="py-4 pl-3 pr-4">
              <!-- Edit dropdown -->
              <Menu as="div" class="relative">
                <MenuButton
                  @click="toggleMenu(blog.id)"
                  class="-m-2.5 p-2.5 flex items-center"
                >
                  <span class="sr-only">Open options</span>
                  <span
                    class="lg:flex lg:items-center text-violet-500 hover:text-violet-900"
                  >
                    <EllipsisHorizontalIcon class="w-5 h-5" />
                  </span>
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    v-if="openMenuId === blog.id"
                    class="absolute right-0 z-10 mt-2.5 w-max origin-top-right rounded-md bg-white py-2 px-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                  >
                    <MenuItem
                      v-for="item in postNavigation"
                      :key="item.name"
                      v-slot="{ active }"
                    >
                      <a
                        href="#"
                        @click.prevent="item.action(blog.id)"
                        :class="[
                          active ? 'bg-gray-50 outline-none' : '',
                          'flex flex-row items-center px-3 py-1 text-sm/6 text-gray-900',
                        ]"
                      >
                        <component
                          :is="item.icon"
                          class="size-4 mr-3 inline-block"
                          aria-hidden="true"
                        />{{ item.name }}</a
                      >
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
