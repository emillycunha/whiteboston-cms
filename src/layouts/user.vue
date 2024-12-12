<script setup>
import { ref } from "vue";

import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
  Switch,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UserCircleIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
  QueueListIcon,
  ChartPieIcon,
  ClipboardDocumentIcon,
  LifebuoyIcon,
} from "@heroicons/vue/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
  { name: "Contacts", href: "/contacts", icon: UsersIcon, current: false },
  { name: "Leads", href: "/leads", icon: UserPlusIcon, current: false },
  { name: "Posts", href: "/posts", icon: FolderIcon, current: false },
  { name: "Tasks", href: "/tasks", icon: QueueListIcon, current: false },
  { name: "Reports", href: "/settings", icon: ChartPieIcon, current: false },
];

const navigation2 = [
  { name: "Support", href: "/settings", icon: LifebuoyIcon, current: false },
  {
    name: "Submit Request",
    href: "/ticket",
    icon: ClipboardDocumentIcon,
    current: false,
  },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon, current: false },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

const sidebarOpen = ref(false);

const currentYear = new Date().getFullYear(); // Dynamically set the current year
const version = "1.0.0"; // Update version as needed
</script>

<template>
  <div class="">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component for mobile -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-200 dark:bg-gray-900 px-6 pb-4 ring-1 ring-white/10"
              >
                <div class="flex h-16 shrink-0 items-center"></div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a
                            :href="item.href"
                            :class="[
                              item.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                            ]"
                          >
                            <component
                              :is="item.icon"
                              class="size-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-10 py-5 border-t border-gray-400">
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation2" :key="item.name">
                          <a
                            :href="item.href"
                            :class="[
                              item.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                            ]"
                          >
                            <component
                              :is="item.icon"
                              class="size-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <!-- Footer fixed at the bottom -->
                      <footer class="py-4 text-center">
                        <p class="text-xs text-gray-700 dark:text-gray-300">
                          &copy; {{ currentYear }} WhiteBoston CMS | Version
                          {{ version }}
                        </p>
                      </footer>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-gray-100 dark:bg-slate-900"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-950 px-6 pb-4 rounded-lg m-5 shadow-sm"
      >
        <div class="flex h-16 shrink-0 items-center"></div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>

            <li class="mt-4 py-5 border-t border-gray-200">
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation2" :key="item.name">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <!-- Footer fixed at the bottom -->
              <footer class="py-4 text-center">
                <p class="text-xs text-gray-700 dark:text-gray-300">
                  &copy; {{ currentYear }} WhiteBoston CMS <br />
                  Version
                  {{ version }}
                </p>
              </footer>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main area -->
    <div
      class="lg:pl-72 lg:pr-4 flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 b bg-gray-100 px-4 sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-slate-900"
      >
        <div
          class="flex flex-1 justify-between gap-x-4 lg:justify-end self-stretch lg:gap-x-6 border-b dark:border-slate-700"
        >
          <button
            type="button"
            class="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            @click="sidebarOpen = true"
          >
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="size-6" aria-hidden="true" />
          </button>

          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <DarkModeToggle />

            <!-- Separator -->
            <div
              class="block h-6 w-px bg-gray-900/10 dark:bg-slate-700"
              aria-hidden="true"
            />

            <button
              type="button"
              class="-m-2.5 p-2.5 text-slate-700 dark:text-slate-400 hover:text-violet-500"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div
              class="block h-6 w-px bg-gray-900/10 dark:bg-slate-700"
              aria-hidden="true"
            />

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-2.5 p-2.5 flex items-center">
                <span class="sr-only">Open user menu</span>
                <span class="lg:flex lg:items-center">
                  <UserCircleIcon
                    class="size-6 text-slate-700 dark:text-slate-400 hover:text-violet-500"
                    aria-hidden="true"
                  />
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
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.href"
                      :class="[
                        active ? 'bg-gray-50 outline-none' : '',
                        'block px-3 py-1 text-sm/6 text-gray-900',
                      ]"
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <!-- Main section -->
      <main class="flex-grow overflow-hidden">
        <div class="pt-10 pb-4">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>
