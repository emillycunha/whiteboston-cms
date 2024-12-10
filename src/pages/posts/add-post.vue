<script setup>
import {
  PhotoIcon,
  UserCircleIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="p-6 space-y-10">
    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between mb-4">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Add Posts
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ChevronLeftIcon class="mr-2 w-5 h-5" />
          Back
        </button>
        <a
          href="/posts/add-post"
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          Preview Blog
          <EyeIcon class="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>

    <form>
      <div
        class="space-y-12 mt-3 sm:mt-4 rounded-lg bg-gray-50 dark:bg-slate-800 p-4 sm:p-8 min-h-[200px] border border-gray-200 dark:border-slate-700 shadow-sm"
      >
        <div
          class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12"
        >
          <!-- Post Title -->
          <div class="sm:col-span-4">
            <label
              for="Post-title"
              class="block text-base font-medium text-gray-700 dark:text-white"
              >Post Title</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="Post-title"
                id="Post-title"
                placeholder="Enter the Post title"
                class="mt-1 block w-full rounded-md border-gray-300 text-base text-gray-900 focus:ring-violet-600 focus:border-violet-600"
              />
            </div>
          </div>

          <!-- Post Description -->
          <div class="col-span-full">
            <label
              for="Post-description"
              class="block text-base font-medium text-gray-700 dark:text-white"
              >Post Description</label
            >
            <div class="mt-2">
              <textarea
                name="Post-description"
                id="Post-description"
                rows="3"
                placeholder="Write a short description of the Post."
                class="mt-1 block w-full rounded-md border-gray-300 text-base text-gray-900 focus:ring-violet-600 focus:border-violet-600"
              ></textarea>
            </div>
          </div>

          <!-- Post Content (Text Editor) -->
          <div class="col-span-full">
            <label
              for="content"
              class="block text-base font-medium text-gray-700 dark:text-white"
              >Content</label
            >
            <div class="mt-2">
              <textarea
                id="content"
                name="content"
                rows="10"
                placeholder="Write your blog content here in Markdown..."
                class="mt-1 block w-full rounded-md border-gray-300 text-base text-gray-900 focus:ring-violet-600 focus:border-violet-600"
              ></textarea>
            </div>

            <!-- Help Section -->
            <details class="mt-4 text-sm text-gray-500">
              <summary class="cursor-pointer text-violet-600 hover:underline">
                Need help with Markdown? Click here!
              </summary>
              <div class="mt-2">
                <h3 class="text-base font-semibold text-gray-800">
                  Markdown Cheatsheet
                </h3>
                <ul class="mt-2 space-y-2">
                  <li><code># H1</code> → <strong>Heading 1</strong></li>
                  <li><code>## H2</code> → <strong>Heading 2</strong></li>
                  <li><code>### H3</code> → <strong>Heading 3</strong></li>
                  <li><code>**bold text**</code> → <strong>Bold</strong></li>
                  <li><code>*italicized text*</code> → <em>Italic</em></li>
                  <li><code>`code`</code> → <code>Inline Code</code></li>
                </ul>
                <p class="mt-2">
                  For more, check out the
                  <a
                    href="https://www.markdownguide.org/cheat-sheet/"
                    target="_blank"
                    class="text-violet-600 hover:underline"
                    >Markdown Guide</a
                  >.
                </p>
              </div>
            </details>
          </div>

          <!-- Category -->
          <div class="sm:col-span-3">
            <label
              for="category"
              class="block text-base font-medium text-gray-700 dark:text-white"
              >Category</label
            >
            <div class="mt-2">
              <select
                id="category"
                name="category"
                class="block w-full rounded-md border-gray-300 text-base text-gray-900 focus:ring-violet-600 focus:border-violet-600"
              >
                <option value="">Select category</option>
                <option value="tech">Tech</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          <!-- Tags -->
          <div class="sm:col-span-3">
            <label
              for="tags"
              class="block text-base font-medium text-gray-700 dark:text-white"
              >Tags</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="e.g., vue, tailwind, Postging"
                class="block w-full rounded-md border-gray-300 text-base text-gray-900 focus:ring-violet-600 focus:border-violet-600"
              />
            </div>
            <p class="mt-2 text-sm text-gray-600">Separate tags with commas.</p>
          </div>

          <!-- Image Upload -->
          <div class="col-span-full">
            <label
              for="cover-photo"
              class="block text-base font-medium text-gray-900"
              >Upload Cover Image</label
            >
            <div
              class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
            >
              <div class="text-center">
                <PhotoIcon
                  class="mx-auto size-12 text-gray-300"
                  aria-hidden="true"
                />
                <div class="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer px-2 rounded-md bg-white font-semibold text-violet-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-600 focus-within:ring-offset-2 hover:text-violet-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <!-- Slug -->
          <div class="sm:col-span-4">
            <label
              for="slug"
              class="block text-base font-medium text-gray-700 dark:text-white"
              >Slug</label
            >
            <div class="mt-2">
              <input
                type="text"
                id="slug"
                name="slug"
                placeholder="unique-url-for-Post"
                class="block w-full rounded-md border-gray-300 text-base text-gray-900 focus:ring-violet-600 focus:border-violet-600"
              />
            </div>
            <p class="mt-3 ml-2 text-sm text-gray-600">
              The slug will be used in the Post's URL.
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            class="inline-flex items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Publish Post
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
