<template>
  <div class="p-2 sm:p-6 space-y-10">
    <div class="overflow-hidden p-4 sm:p-8 bg-white shadow sm:rounded-lg">
      <form>
        <div class="px-4 py-6 sm:px-6">
          <div>
            <h2 class="text-base/7 font-semibold text-gray-900">
              Ticket Support
            </h2>
            <p class="mt-1 max-w-2xl text-sm/6 text-gray-600">
              Please fill out the form below to submit a support ticket.
            </p>

            <div>
              <div
                class="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10"
              >
                <div
                  class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6"
                >
                  <label
                    for="first-name"
                    class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                    >First name</label
                  >
                  <div class="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autocomplete="given-name"
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-xs sm:text-sm/6"
                    />
                  </div>
                </div>

                <div
                  class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6"
                >
                  <label
                    for="last-name"
                    class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                    >Last name</label
                  >
                  <div class="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autocomplete="family-name"
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-xs sm:text-sm/6"
                    />
                  </div>
                </div>

                <div
                  class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6"
                >
                  <label
                    for="email"
                    class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                    >Email address</label
                  >
                  <div class="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autocomplete="email"
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-md sm:text-sm/6"
                    />
                  </div>
                </div>

                <div
                  class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6"
                >
                  <label
                    for="about"
                    class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                    >About</label
                  >
                  <div class="mt-2 sm:col-span-2 sm:mt-0">
                    <textarea
                      name="about"
                      id="about"
                      rows="3"
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-2xl sm:text-sm/6"
                    />
                    <p class="mt-3 text-sm/6 text-gray-600">
                      Write a few sentences about yourself.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" class="text-sm/6 font-semibold text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { PhotoIcon, UserCircleIcon } from "@heroicons/vue/24/solid";
import { ChevronDownIcon } from "@heroicons/vue/16/solid";
</script>
