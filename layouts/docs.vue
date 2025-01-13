<template>
  <div class="flex h-screen bg-gray-800 p-4 lg:p-10 font-mono">
    <!-- Left Sidebar -->
    <div class="w-1/6 p-4 text-gray-300">
      <aside class="sticky top-0">
        <nav>
          <ContentNavigation v-slot="{ navigation }">
            <ul class="space-y-8 text-sm">
              <li v-for="link in navigation[0]?.children" :key="link._path">
                <Disclosure defaultOpen v-if="link.children" v-slot="{ open }">
                  <DisclosureButton
                    class="w-full flex justify-between items-center text-white pb-2"
                  >
                    {{ link.title }}
                    <span>
                      <ChevronRightIcon
                        class="w-4 h-4 transform transition-transform"
                        :class="{ 'rotate-90': open }"
                      />
                    </span>
                  </DisclosureButton>

                  <DisclosurePanel>
                    <ul class="ml-4 space-y-2">
                      <li v-for="child in link.children" :key="child._path">
                        <NuxtLink
                          :to="child._path"
                          :class="{
                            'text-teal-500 font-bold':
                              route.path === child._path,
                            'text-gray-300 hover:text-teal-500':
                              route.path !== child._path,
                          }"
                        >
                          {{ child.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </DisclosurePanel>
                </Disclosure>
              </li>
            </ul>
          </ContentNavigation>
        </nav>
      </aside>
    </div>

    <!-- Main Content -->
    <main class="flex-1 p-4 max-w-3xl mx-auto overflow-y-auto">
      <div class="pb-4">
        <slot />
      </div>
      <div class="border-t border-gray-500 py-6">
        <div class="flex justify-between">
          <div
            class="flex flex-col w-1/3 items-start border border-teall-500 rounded-lg p-6 text-gray-500"
          >
            <div class="flex flex-row items-center">
              <ChevronLeftIcon class="w-4 h-4" />
              <p class="text-sm ml-1">Previous Page</p>
            </div>
            <NuxtLink
              v-if="prev"
              :to="prev._path"
              class="text-base text-teal-500"
              >{{ prev.title }}</NuxtLink
            >
          </div>
          <div
            class="flex flex-col w-1/3 items-end border border-teall-500 rounded-lg p-6 text-gray-500"
          >
            <div class="flex flex-row items-center">
              <p class="text-sm mr-1">Next Page</p>
              <ChevronRightIcon class="w-4 h-4" />
            </div>
            <NuxtLink
              v-if="next"
              :to="next._path"
              class="text-base text-teal-500"
              >{{ next.title }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar -->
    <div class="w-1/6 p-4 text-gray-300 ml-4">
      <aside class="sticky top-0">
        <div class="">
          <h3 class="font-semibold mb-2">On this page</h3>
          <ul
            v-if="toc && toc.links"
            class="text-xs space-y-3 border-l border-slate-300 pl-4"
          >
            <li v-for="link in toc.links" :key="link.text">
              <a :href="`#${link.id}`">
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/24/solid";

const { prev, next, toc } = useContent();
const route = useRoute();

// Track open states for Disclosure components
const openStates = ref<Record<string, boolean>>({});

// Set all Disclosure components to open by default
onMounted(() => {
  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => {
    openStates.value[section.id] = true; // Initialize each Disclosure as open
  });
});
</script>
