<template>
  <div class="font-mono">
    <!-- Mobile sidebar -->
    <MobileBar />

    <!-- Desktop sidebar -->
    <DesktopBar :isExpanded="isExpanded" @toggleSidebar="toggleSidebar" />

    <!-- Main content -->
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300" :class="isExpanded ? 'lg:pl-52' : 'lg:pl-20'">
      <!-- Main section -->
      <main class="flex-grow bg-gray-100 dark:bg-gray-900">
        <div class="px-6 py-4 sm:py-8 sm:px-8">
          <NotificationContainer />
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCollectionsStore } from "~/stores/collections";
import BrandFooter from "~/components/BrandFooter.vue";
import { getIconForSlug } from "@/utils/iconMappings";

import { Bars3Icon, HomeIcon, ClipboardDocumentIcon, UserCircleIcon, XMarkIcon, ArrowRightEndOnRectangleIcon, Cog6ToothIcon, AdjustmentsHorizontalIcon, BuildingOffice2Icon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
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
const isExpanded = ref(false); // Sidebar state

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

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
