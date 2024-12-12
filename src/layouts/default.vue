<script setup>
import { ref, computed } from "vue";
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  UserPlusIcon,
  FolderIcon,
  QueueListIcon,
  ChartPieIcon,
  LifebuoyIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
  //{ name: "Contacts", href: "/contacts", icon: UsersIcon, current: false },
  { name: "Leads", href: "/leads", icon: UserPlusIcon, current: false },
  { name: "Posts", href: "/posts", icon: FolderIcon, current: false },
  { name: "Tasks", href: "/tasks", icon: QueueListIcon, current: false },
  //{ name: "Reports", href: "/reports", icon: ChartPieIcon, current: false },
  { name: "Support", href: "/support", icon: LifebuoyIcon, current: false },
  {
    name: "Submit Request",
    href: "/ticket",
    icon: ClipboardDocumentIcon,
    current: false,
  },
];

const navigation2 = [
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon, current: false },
  { name: "Profile", href: "/profile", icon: UserCircleIcon, current: false },
];

const sidebarOpen = ref(false);

const currentYear = new Date().getFullYear();
const version = "1.0.0";
</script>

<template>
  <div>
    <!-- Mobile sidebar -->
    <TransitionRoot :show="sidebarOpen" as="template">
      <Dialog class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-60"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel
              class="relative flex w-full max-w-xs flex-col dark:bg-gray-800"
            >
              <div
                class="p-4 flex flex-col grow bg-white dark:bg-gray-800 rounded-lg m-4 shadow-sm"
              >
                <div class="flex items-center justify-end px-4 py-2">
                  <button
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                    @click="sidebarOpen = false"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>

                <nav class="flex flex-col grow gap-y-16">
                  <!-- Main navigation -->
                  <ul class="py-4 space-y-1">
                    <li v-for="item in navigation" :key="item.name">
                      <a
                        :href="item.href"
                        class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-200"
                      >
                        <component
                          :is="item.icon"
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </a>
                    </li>
                  </ul>

                  <!-- Secondary navigation -->
                  <ul class="border-t border-gray-200 py-4 space-y-1">
                    <li v-for="item in navigation2" :key="item.name">
                      <a
                        :href="item.href"
                        class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-200"
                      >
                        <component
                          :is="item.icon"
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </a>
                    </li>
                  </ul>
                </nav>
                <!-- Sidebar footer -->
                <footer class="mt-auto px-4 py-4 text-center">
                  <DarkModeToggle />

                  <p class="mt-6 text-xs text-gray-700 dark:text-gray-300">
                    &copy; {{ currentYear }} WhiteBoston CMS <br />
                    Version {{ version }}
                  </p>
                </footer>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Mobile header -->
    <header
      class="lg:hidden flex items-center justify-between p-4 dark:bg-gray-700"
    >
      <button
        @click="sidebarOpen = true"
        class="flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>
    </header>

    <!-- Desktop sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <!-- Sidebar Container -->
      <div
        class="p-4 flex flex-col grow bg-white dark:bg-gray-800 rounded-lg m-4 shadow-sm"
      >
        <!-- Navigation -->
        <nav class="flex flex-col grow gap-y-16">
          <!-- Main navigation -->
          <ul class="py-4 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <a
                :href="item.href"
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-200"
              >
                <component
                  :is="item.icon"
                  class="size-5 mr-2"
                  aria-hidden="true"
                />
                {{ item.name }}
              </a>
            </li>
          </ul>

          <!-- Secondary navigation -->
          <ul class="border-t border-gray-200 py-4 space-y-1">
            <li v-for="item in navigation2" :key="item.name">
              <a
                :href="item.href"
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-violet-200"
              >
                <component
                  :is="item.icon"
                  class="size-5 mr-2"
                  aria-hidden="true"
                />
                {{ item.name }}
              </a>
            </li>
          </ul>
        </nav>
        <!-- Sidebar footer -->
        <footer class="mt-auto px-4 py-4 text-center">
          <DarkModeToggle />

          <p class="mt-6 text-xs text-gray-700 dark:text-gray-300">
            &copy; {{ currentYear }} WhiteBoston CMS <br />
            Version {{ version }}
          </p>
        </footer>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col min-h-screen bg-gray-100">
      <!-- Main section -->
      <main class="flex-grow overflow-hidden">
        <div class="px-6 py-4 sm:py-8 sm:px-8">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>
