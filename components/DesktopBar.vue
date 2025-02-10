<template>
  <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white dark:bg-gray-800 rounded-lg m-4 shadow-sm transition-all duration-300" :class="isExpanded ? 'w-52' : 'w-20'">
    <nav class="flex flex-col grow gap-y-1 p-4 transition-all duration-500">
      <!-- Primary Navigation -->
      <ul class="space-y-1">
        <li v-for="item in navigation" :key="item.name" class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" :class="isExpanded ? 'justify-start' : 'justify-center'">
          <NuxtLink :to="item.href" class="flex items-center transition-all duration-3000">
            <component :is="item.icon" class="size-5 text-gray-700 dark:text-gray-200" aria-hidden="true" />
            <span v-if="isExpanded" class="ml-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
              {{ item.name }}
            </span>
          </NuxtLink>

          <!-- Tooltip -->
          <span v-if="!isExpanded" class="absolute left-14 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {{ item.name }}
          </span>
        </li>
      </ul>

      <!-- Collections nagivation -->
      <ul class="space-y-1">
        <li v-for="item in visibleSidebarItems" :key="item" class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" :class="isExpanded ? 'justify-start' : 'justify-center'">
          <NuxtLink :to="`/collections/${item}`" class="flex items-center">
            <component :is="getIcon(item)" class="size-5 dark:text-gray-200" aria-hidden="true" />
            <span v-if="isExpanded" class="ml-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
              {{ capitalizeSlug(item) }}
            </span>
          </NuxtLink>

          <!-- Tooltip -->
          <span v-if="!isExpanded" class="absolute left-14 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {{ capitalizeSlug(item) }}
          </span>
        </li>
      </ul>

      <!-- More Collections -->
      <ul class="space-y-1">
        <li class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" :class="isExpanded ? 'justify-start' : 'justify-center'">
          <div>
            <NuxtLink to="/collections" class="flex items-center">
              <AdjustmentsHorizontalIcon class="size-5 dark:text-gray-200" aria-hidden="true" />
              <span v-if="isExpanded" class="ml-3 text-gray-700 dark:text-gray-200 text-sm font-medium"> Collections </span>
            </NuxtLink>
            <span class="absolute top-0 left-12 p-2 text-sm font-medium text-white bg-violet-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"> Collections </span>
          </div>
        </li>
      </ul>

      <div class="border-t border-gray-200 w-10 my-4 mx-auto" :class="isExpanded ? 'w-32' : 'w-10'"></div>

      <!-- Secondary Navigation -->
      <ul class="space-y-1">
        <li v-for="item in navigation2" :key="item.name" class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" :class="isExpanded ? 'justify-start' : 'justify-center'">
          <NuxtLink :to="item.href" class="flex items-center">
            <component :is="item.icon" class="size-5 text-gray-700 dark:text-gray-200" aria-hidden="true" />
            <span v-if="isExpanded" class="ml-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
              {{ item.name }}
            </span>
          </NuxtLink>

          <!-- Tooltip -->
          <span v-if="!isExpanded" class="absolute left-14 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {{ item.name }}
          </span>
        </li>
      </ul>

      <!-- Logout Button -->
      <button class="group relative flex px-3 py-2 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500" @click="handleLogout" :class="isExpanded ? 'justify-start' : 'justify-center'">
        <div class="flex items-center">
          <ArrowRightEndOnRectangleIcon class="size-5 text-gray-700 dark:text-gray-200" aria-hidden="true" />
          <span v-if="isExpanded" class="ml-3 text-gray-700 dark:text-gray-200 text-sm font-medium"> Logout </span>
        </div>
        <!-- Tooltip -->
        <span v-if="!isExpanded" class="absolute left-14 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity"> Logout </span>
      </button>

      <!-- Toggle Button -->
      <div class="flex justify-end p-2">
        <button class="p-1 rounded-md text-gray-700 dark:text-gray-200" @click="emit('toggleSidebar')">
          <ChevronLeftIcon v-if="isExpanded" class="size-6 p-1 border border-gray-300 rounded-lg bg-gray-100 dark:border-slate-900 dark:bg-slate-600 dark:text-gray-200" />
          <ChevronRightIcon v-else class="size-6 p-1 border border-gray-300 rounded-lg bg-gray-100 dark:border-slate-900 dark:bg-slate-600 dark:text-gray-200" />
        </button>
      </div>
    </nav>

    <!-- Sidebar footer -->
    <footer class="mt-auto px-4 py-4 text-center">
      <DarkModeToggle :isExpanded="isExpanded" />
      <BrandFooter :isExpanded="isExpanded" />
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BrandFooter from "~/components/BrandFooter.vue";
import { getIconForSlug } from "@/utils/iconMappings";

import { HomeIcon, ClipboardDocumentIcon, UserCircleIcon, ArrowRightEndOnRectangleIcon, Cog6ToothIcon, AdjustmentsHorizontalIcon, BuildingOffice2Icon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const userRole = computed(() => authStore.role);

const maxVisibleItems = 3;
const sidebarOrder = ref("");
const error = ref("");

const capitalizeSlug = (slug) => {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

const props = defineProps({
  isExpanded: Boolean, // Accept isExpanded as a prop
});

const emit = defineEmits(["toggleSidebar"]);

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
      name: "Help",
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
