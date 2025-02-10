<template>
  <div class="font-mono">
    <!-- Mobile sidebar -->
    <TransitionRoot :show="sidebarOpen" as="template">
      <Dialog class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div class="fixed inset-0 bg-black/50"></div>
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
            <DialogPanel class="relative flex w-full max-w-xs flex-col">
              <div class="p-4 flex flex-col grow bg-white dark:bg-gray-800 rounded-lg m-4 shadow-sm">
                <div class="flex items-center justify-end px-4 py-2">
                  <button class="text-gray-700 hover:text-gray-500 focus:outline-none" @click="sidebarOpen = false">
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>

                <nav class="flex flex-col grow gap-y-2">
                  <!-- Primary Navigation -->
                  <ul class="space-y-1">
                    <li v-for="item in navigation" :key="item.name" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500">
                      <NuxtLink :to="item.href" class="flex items-center w-full" @click="sidebarOpen = false">
                        <component :is="item.icon" class="size-5 mr-2" aria-hidden="true" />
                        {{ item.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <!-- Collections nagivation -->
                  <ul class="space-y-1">
                    <li v-for="item in visibleSidebarItems" :key="item" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500">
                      <NuxtLink :to="`/collections/${item}`" class="flex items-center w-full" @click="sidebarOpen = false">
                        <component :is="getIcon(item)" class="size-5 mr-2" aria-hidden="true" />
                        {{ capitalizeSlug(item) }}
                      </NuxtLink>
                    </li>
                  </ul>

                  <!-- More Collections -->
                  <ul class="space-y-1">
                    <li>
                      <NuxtLink to="/collections" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" @click="sidebarOpen = false">
                        <AdjustmentsHorizontalIcon class="size-5 mr-2" aria-hidden="true" />
                        Collections
                      </NuxtLink>
                    </li>
                  </ul>

                  <div class="border-t border-gray-200 my-4"></div>
                  <!-- Secondary Navigation -->
                  <ul class="space-y-1">
                    <li v-for="item in navigation2" :key="item.name" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500">
                      <NuxtLink :to="item.href" class="flex items-center w-full" @click="sidebarOpen = false">
                        <component :is="item.icon" class="size-5 mr-2" aria-hidden="true" />
                        {{ item.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <button class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" @click="handleLogout">
                    <ArrowRightEndOnRectangleIcon class="size-5 mr-2 block" aria-hidden="true" />
                    Logout
                  </button>
                </nav>
                <!-- Sidebar footer -->
                <footer class="mt-auto px-4 py-4 text-center">
                  <DarkModeToggle />
                  <BrandFooter />
                </footer>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Mobile header -->
    <header class="lg:hidden bottom-0 fixed flex items-center w-full justify-between p-2 bg-violet-200 dark:bg-gray-900 rounded-lg">
      <nav class="flex flex-row grow justify-between w-full">
        <ul>
          <li>
            <button class="flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" @click="sidebarOpen = true">
              <Bars3Icon class="h-6 w-6" />
            </button>
          </li>
        </ul>
        <ul class="space-x-1">
          <li v-for="item in navigation" :key="item.name" class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500">
            <NuxtLink :to="item.href" class="flex items-center transition-all duration-3000">
              <component :is="item.icon" class="size-5 text-gray-700 dark:text-gray-200" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>

        <!-- Collections nagivation -->
        <ul class="space-x-4 flex flex-row">
          <li v-for="item in visibleSidebarItems" :key="item" class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500">
            <NuxtLink :to="`/collections/${item}`" class="flex items-center">
              <component :is="getIcon(item)" class="size-5" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>

        <!-- More Collections -->
        <ul class="space-x-1">
          <li class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500">
            <div>
              <NuxtLink to="/collections" class="flex items-center">
                <AdjustmentsHorizontalIcon class="size-5" aria-hidden="true" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCollectionsStore } from "~/stores/collections";
import BrandFooter from "~/components/BrandFooter.vue";
import { getIconForSlug } from "@/utils/iconMappings";

import { Bars3Icon, HomeIcon, ClipboardDocumentIcon, UserCircleIcon, XMarkIcon, ArrowRightEndOnRectangleIcon, Cog6ToothIcon, AdjustmentsHorizontalIcon, BuildingOffice2Icon } from "@heroicons/vue/24/outline";
import { CubeIcon } from "@heroicons/vue/24/solid";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";

const authStore = useAuthStore();
const userRole = computed(() => authStore.role);

const maxVisibleItems = 3;
const sidebarOrder = ref("");
const error = ref("");

const capitalizeSlug = (slug) => {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

const sidebarOpen = ref(false);

onMounted(() => {
  const userPreferences = authStore.preferences || {};
  const dashboardPreferences = userPreferences.dashboard || {};

  const cleanedSidebarOrder = (dashboardPreferences.sidebarOrder || []).filter((slug) => slug !== "");
  console.log("[onMounted] Cleaned Sidebar Order:", cleanedSidebarOrder);

  sidebarOrder.value = cleanedSidebarOrder;
});

const visibleSidebarItems = computed(() => {
  const items = sidebarOrder.value.slice(0, maxVisibleItems);
  return items;
});

// Dynamic Icon Assignment
const getIcon = (slug) => {
  return getIconForSlug(slug);
};

const handleLogout = async () => {
  await authStore.logout();
};

const navigation = [{ name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false }];

const navigation2 = computed(() => {
  const baseNavigation = [
    {
      name: "Submit Request",
      href: "/ticket",
      icon: ClipboardDocumentIcon,
      current: false,
    },
    {
      name: "Organization",
      href: "/organization",
      icon: BuildingOffice2Icon,
      current: false,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Cog6ToothIcon,
      current: false,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircleIcon,
      current: false,
    },
  ];

  // Only show the "Organization" tab if the user is an admin
  if (userRole.value !== "admin") {
    return baseNavigation.filter((item) => item.name !== "Organization");
  }

  return baseNavigation;
});
</script>
