<script setup>
definePageMeta({
  layout: "site",
});

const config = useRuntimeConfig();
const version = config.public.appVersion;
const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="bg-gray-900 text-gray-300 min-h-screen">
    <!-- Header -->
    <header class="bg-gray-800 py-4">
      <div class="container mx-auto flex justify-between items-center px-6">
        <h1 class="text-2xl font-bold text-teal-500">CMS WhiteBoston</h1>
        <nav class="flex space-x-6">
          <a href="dashboard" class="hover:text-teal-500">Dashboard</a>
          <a href="docs" class="hover:text-teal-500">Docs</a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-github"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
            />
          </svg>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gray-800 py-20">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Simplify Your Content Management
        </h2>
        <p class="text-gray-400 text-lg mb-8">
          CMS WhiteBoston is a powerful, open-source content management system
          built for developers and businesses to manage content with ease.
        </p>
        <a
          href="#"
          class="bg-teal-500 text-white px-6 py-3 rounded shadow hover:bg-teal-600"
        >
          Get Started
        </a>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center text-teal-500 mb-10">
          Features You'll Love
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gray-800 p-6 rounded shadow">
            <h4 class="text-xl font-bold text-white mb-4">Easy Integration</h4>
            <p class="text-gray-400">
              Seamlessly integrate with modern tools and frameworks, including
              Nuxt.js and Tailwind CSS.
            </p>
          </div>
          <!-- Feature 2 -->
          <div class="bg-gray-800 p-6 rounded shadow">
            <h4 class="text-xl font-bold text-white mb-4">Open Source</h4>
            <p class="text-gray-400">
              Fully open source with an MIT license, ensuring you have complete
              control over your content.
            </p>
          </div>
          <!-- Feature 3 -->
          <div class="bg-gray-800 p-6 rounded shadow">
            <h4 class="text-xl font-bold text-white mb-4">
              Developer Friendly
            </h4>
            <p class="text-gray-400">
              Built for developers with robust APIs and customizable features to
              fit your needs.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-teal-500 py-16">
      <div class="container mx-auto px-6 text-center">
        <h3 class="text-3xl font-bold text-white mb-4">
          Ready to Take Control of Your Content?
        </h3>
        <p class="text-white text-lg mb-8">
          Start using CMS WhiteBoston today and experience the simplicity of
          content management.
        </p>
        <a
          href="#"
          class="bg-gray-900 text-teal-500 px-6 py-3 rounded shadow hover:bg-gray-800 hover:text-teal-400"
        >
          Get Started for Free
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 py-6">
      <div class="text-center mt-2">
        <p class="mt-6 text-xs text-gray-700 dark:text-gray-300">
          &copy; {{ currentYear }} WhiteBoston CMS <br />
          Version {{ version }}
        </p>
      </div>
    </footer>
  </div>
</template>
