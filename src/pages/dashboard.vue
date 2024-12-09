<script setup>
import { ref, computed } from "vue";

import {
  HandThumbUpIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/vue/20/solid";

import { CheckIcon, UserIcon } from "@heroicons/vue/20/solid";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/vue/20/solid";
import { DocumentIcon, UsersIcon } from "@heroicons/vue/24/outline";

const currentTime = new Date();
const greeting = computed(() => {
  const hour = currentTime.getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
});

// Task list
const tasks = ref([
  { id: 1, title: "Task 1", dueDate: "Tomorrow", completed: false },
  { id: 2, title: "Task 2", dueDate: "Next Week", completed: false },
  { id: 3, title: "Task 3", dueDate: "Today", completed: false },
  { id: 4, title: "Task 4", dueDate: "Today", completed: false },
]);

// Toggle task completion
const toggleTask = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task) task.completed = !task.completed;
};

const stats = [
  {
    id: 1,
    name: "New Leads",
    stat: "17",
    icon: UsersIcon,
    change: "12",
    changeType: "increase",
  },
  {
    id: 2,
    name: "New Post",
    stat: "5",
    icon: DocumentIcon,
    change: "5.4%",
    changeType: "increase",
  },
];

const timeline = [
  {
    id: 1,
    content: "Applied to",
    target: "Front End Developer",
    href: "#",
    date: "Sep 20",
    datetime: "2020-09-20",
    icon: UserIcon,
    iconBackground: "bg-violet-500",
  },
  {
    id: 2,
    content: "Advanced to phone screening by",
    target: "Bethany Blake",
    href: "#",
    date: "Sep 22",
    datetime: "2020-09-22",
    icon: HandThumbUpIcon,
    iconBackground: "bg-violet-500",
  },
  {
    id: 3,
    content: "Completed phone screening with",
    target: "Martha Gardner",
    href: "#",
    date: "Sep 28",
    datetime: "2020-09-28",
    icon: CheckIcon,
    iconBackground: "bg-violet-500",
  },
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
          Dashboard
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          My Tasks
          <ChevronRightIcon class="ml-2 w-5 h-5" />
        </button>
        <a
          type="button"
          href="/posts/add-post"
          class="ml-3 inline-flex items-center rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          New Post
          <PlusIcon class="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>

    <!-- Cards Section -->
    <div
      class="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
    >
      <!-- Account Summary -->
      <div class="lg:col-start-3 lg:row-end-1 lg:row-span-2">
        <h2 class="sr-only">Account Info</h2>
        <div
          class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-slate-700 dark:ring-slate-500"
        >
          <dl class="flex flex-wrap">
            <div class="flex-auto px-6 pt-6">
              <dt class="text-base font-semibold text-gray-900 dark:text-white">
                {{ greeting }}, Emilly
              </dt>
              <dd
                class="mt-1 text-sm/6 font-medium italic text-gray-600 dark:text-slate-400"
              >
                The secret to getting ahead is getting started.
              </dd>
            </div>
          </dl>
          <div
            class="mt-6 border-t border-gray-900/5 dark:border-slate-500 px-6 py-6"
          >
            <a
              href="#"
              class="text-sm font-semibold text-gray-900 hover:text-violet-500 dark:text-white dark:hover:text-violet-200"
              >Edit Profile <span aria-hidden="true">&rarr;</span></a
            >
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="lg:col-start-1 lg:col-span-2">
        <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <div
            v-for="item in stats"
            :key="item.id"
            class="relative overflow-hidden rounded-lg bg-white dark:bg-slate-700 px-4 pb-6 pt-5 shadow sm:px-6 sm:pt-6 dark:ring-slate-500 ring-1 ring-gray-900/5"
          >
            <div class="flex justify-between items-center">
              <!-- Left Column: Text and Number -->
              <div>
                <dt>
                  <p
                    class="truncate text-sm font-medium text-gray-500 dark:text-slate-300"
                  >
                    {{ item.name }}
                  </p>
                </dt>
                <dd class="mt-1 flex items-baseline">
                  <p
                    class="text-5xl font-semibold text-gray-900 mr-4 dark:text-white"
                  >
                    {{ item.stat }}
                  </p>
                  <p
                    :class="[
                      item.changeType === 'increase'
                        ? 'text-teal-500'
                        : 'text-teal-500',
                      'mt-1 flex items-center text-base font-semibold',
                    ]"
                  >
                    <ArrowTrendingUpIcon
                      v-if="item.changeType === 'increase'"
                      class="w-5 h-5 mr-2 text-teal-500"
                      aria-hidden="true"
                    />
                    <ArrowTrendingDownIcon
                      v-else
                      class="w-5 h-5 mr-2 text-teal-500"
                      aria-hidden="true"
                    />
                    {{ item.change }}
                  </p>
                </dd>
              </div>

              <!-- Right Column: Icon -->
              <div>
                <div class="rounded-md bg-violet-500 p-3">
                  <component
                    :is="item.icon"
                    class="w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </dl>
      </div>

      <!-- Tasks -->
      <div class="lg:col-start-1 lg:col-span-2 lg:row-span-2 flex-grow">
        <h2 class="sr-only">Tasks</h2>
        <div
          class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-slate-700 dark:ring-slate-500"
        >
          <div class="p-6">
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white"
              id="tasks-title"
            >
              Tasks
            </h2>
            <ul class="mt-4 space-y-4">
              <!-- Dynamically Render Tasks -->
              <li
                v-for="task in tasks"
                :key="task.id"
                class="flex items-center justify-between p-3 bg-gray-100 rounded-lg dark:bg-slate-600"
              >
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    :checked="task.completed"
                    @change="toggleTask(task.id)"
                    class="h-5 w-5 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
                  />
                  <span
                    :class="[
                      task.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-900',
                      'text-sm dark:text-white',
                    ]"
                  >
                    {{ task.title }}
                  </span>
                </div>
                <span
                  class="text-xs font-medium text-teal-500 dark:text-teal-500"
                >
                  Due: {{ task.dueDate }}
                </span>
              </li>
            </ul>
            <a
              href="#"
              class="mt-6 block text-sm font-semibold text-gray-900 hover:text-violet-500 dark:text-white dark:hover:text-violet-200"
            >
              View all tasks <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Activity feed -->
      <div
        class="lg:col-start-3 lg:row-span-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm ring-1 ring-gray-900/5 dark:ring-slate-500"
      >
        <h2
          class="text-sm/6 font-semibold text-gray-900 dark:text-white px-6 py-6"
        >
          Activity
        </h2>
        <ul role="list" class="mb-2 px-6">
          <li v-for="(event, eventIdx) in timeline" :key="event.id">
            <div class="relative pb-8">
              <span
                v-if="eventIdx !== timeline.length - 1"
                class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div>
                  <span
                    :class="[
                      event.iconBackground,
                      'flex size-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-slate-700',
                    ]"
                  >
                    <component
                      :is="event.icon"
                      class="size-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div
                  class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5"
                >
                  <div>
                    <p class="text-sm text-gray-500 dark:text-slate-300">
                      {{ event.content }}
                      <a
                        :href="event.href"
                        class="font-medium text-gray-900 dark:text-white"
                        >{{ event.target }}</a
                      >
                      &middot;
                      <time :datetime="event.datetime">{{ event.date }}</time>
                    </p>
                  </div>
                  <div
                    class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-slate-300"
                  ></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
