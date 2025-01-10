<template>
  <div class="font-mono">
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
            <DialogPanel class="relative flex w-full max-w-xs flex-col">
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

                <div class="flex items-center justify-start px-2 py-2 mb-4">
                  <CubeIcon
                    class="h-6 w-6 mr-1 text-gray-700 dark:text-gray-50"
                  />
                  <h3
                    class="text-base tracking-tighter font-bold text-gray-700 dark:text-gray-50"
                  >
                    WHITEBOSTON
                  </h3>
                </div>

                <nav class="flex flex-col grow gap-y-2">
                  <!-- Primary Navigation -->
                  <ul class="space-y-1">
                    <li
                      v-for="item in navigation"
                      :key="item.name"
                      class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
                    >
                      <NuxtLink
                        :to="item.href"
                        class="flex items-center w-full"
                      >
                        <component
                          :is="item.icon"
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <!-- Collections nagivation -->
                  <ul class="space-y-1">
                    <li
                      v-for="item in visibleCollections"
                      :key="item.slug"
                      class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
                    >
                      <NuxtLink
                        :to="`/collections/${item.slug}`"
                        class="flex items-center w-full"
                      >
                        <component
                          :is="getIcon(item.name)"
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </NuxtLink>
                    </li>
                  </ul>

                  <!-- More Collections -->
                  <ul class="space-y-1">
                    <li v-if="extraCollections.length">
                      <NuxtLink
                        to="/collections"
                        class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
                      >
                        <FolderPlusIcon
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        See More
                      </NuxtLink>
                    </li>
                    <li v-else>
                      <NuxtLink
                        to="/collections"
                        class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
                      >
                        <AdjustmentsHorizontalIcon
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        Collections
                      </NuxtLink>
                    </li>
                  </ul>

                  <div class="border-t border-gray-200 my-4"></div>
                  <!-- Secondary Navigation -->
                  <ul class="space-y-1">
                    <li
                      v-for="item in navigation2"
                      :key="item.name"
                      class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
                    >
                      <NuxtLink
                        :to="item.href"
                        class="flex items-center w-full"
                      >
                        <component
                          :is="item.icon"
                          class="size-5 mr-2"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </NuxtLink>
                    </li>
                  </ul>

                  <button
                    @click="handleLogout"
                    class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
                  >
                    <ArrowRightEndOnRectangleIcon
                      class="size-5 mr-2 block"
                      aria-hidden="true"
                    />
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
    <header
      class="lg:hidden flex items-center justify-between p-4 dark:bg-gray-900"
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
        <div class="flex items-center justify-start px-2 py-4 mb-4">
          <CubeIcon class="h-6 w-6 mr-1 text-gray-700 dark:text-gray-50" />
          <h3
            class="text-base tracking-tighter font-bold text-gray-700 dark:text-gray-50"
          >
            WHITEBOSTON
          </h3>
        </div>
        <!-- Navigation -->
        <nav class="flex flex-col grow gap-y-2">
          <!-- Primary Navigation -->
          <ul class="space-y-1">
            <li
              v-for="item in navigation"
              :key="item.name"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
            >
              <NuxtLink :to="item.href" class="flex items-center w-full">
                <component
                  :is="item.icon"
                  class="size-5 mr-2"
                  aria-hidden="true"
                />
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
          <!-- Collections nagivation -->
          <ul class="space-y-1">
            <li
              v-for="item in visibleCollections"
              :key="item.slug"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
            >
              <NuxtLink
                :to="`/collections/${item.slug}`"
                class="flex items-center w-full"
              >
                <component
                  :is="getIcon(item.name)"
                  class="size-5 mr-2"
                  aria-hidden="true"
                />
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>

          <!-- More Collections -->
          <ul class="space-y-1">
            <li v-if="extraCollections.length">
              <NuxtLink
                to="/collections"
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
              >
                <FolderPlusIcon class="size-5 mr-2" aria-hidden="true" />
                See More
              </NuxtLink>
            </li>
            <li v-else>
              <NuxtLink
                to="/collections"
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
              >
                <AdjustmentsHorizontalIcon
                  class="size-5 mr-2"
                  aria-hidden="true"
                />
                Collections
              </NuxtLink>
            </li>
          </ul>

          <div class="border-t border-gray-200 my-4"></div>
          <!-- Secondary Navigation -->
          <ul class="space-y-1">
            <li
              v-for="item in navigation2"
              :key="item.name"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
            >
              <NuxtLink :to="item.href" class="flex items-center w-full">
                <component
                  :is="item.icon"
                  class="size-5 mr-2"
                  aria-hidden="true"
                />
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>

          <button
            @click="handleLogout"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-violet-50 dark:hover:bg-teal-500"
          >
            <ArrowRightEndOnRectangleIcon
              class="size-5 mr-2 block"
              aria-hidden="true"
            />
            Logout
          </button>
        </nav>
        <!-- Sidebar footer -->
        <footer class="mt-auto px-4 py-4 text-center">
          <DarkModeToggle />
          <BrandFooter />
        </footer>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Main section -->
      <main class="flex-grow bg-gray-100 dark:bg-gray-900">
        <div class="px-6 py-4 sm:py-8 sm:px-8">
          <NotificationContainer />

          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { useCollectionsStore } from "~/stores/collections";
import BrandFooter from "~/components/BrandFooter.vue";
import { getIconForSlug } from "@/utils/iconMappings";

import {
  Bars3Icon,
  HomeIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
  Cog6ToothIcon,
  FolderPlusIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { CubeIcon } from "@heroicons/vue/24/solid";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const { $supabase } = useNuxtApp();
const collectionsStore = useCollectionsStore();
const router = useRouter();

// State for collections
const collections = ref([]);
const maxVisibleItems = 3;

// Fetch collections on sidebar load
const fetchAndSetCollections = async () => {
  try {
    const fetchedCollections =
      await collectionsStore.fetchCollectionsForCurrentOrg();
    collections.value = fetchedCollections
      .filter((collection) => !collection.is_hidden)
      .sort((a, b) => a.position - b.position);
    console.log("Sidebar collections updated.");
  } catch (err) {
    console.error("Failed to fetch collections for sidebar:", err.message);
  }
};

onMounted(fetchAndSetCollections);

// Dynamic navigation
const visibleCollections = computed(() =>
  collections.value.slice(0, maxVisibleItems)
);
const extraCollections = computed(() =>
  collections.value.slice(maxVisibleItems)
);

// Dynamic Icon Assignment
const getIcon = (slug) => {
  return getIconForSlug(slug);
};

const handleLogout = async () => {
  try {
    console.log("Logging out...");
    const { error } = await $supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      console.log("Logout successful");
      router.push("/auth/login");
    }
  } catch (err) {
    console.error("Unexpected logout error:", err.message);
  }
};

const sidebarOpen = ref(false);

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
];

const navigation2 = [
  {
    name: "Submit Request",
    href: "/ticket",
    icon: ClipboardDocumentIcon,
    current: false,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    current: false,
  },
  { name: "Profile", href: "/profile", icon: UserCircleIcon, current: false },
];
</script>
