<script setup>
definePageMeta({
  layout: "site",
});

const config = useRuntimeConfig();
const version = config.public.appVersion;
const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="bg-white text-gray-700 min-h-screen font-mono">
    <!-- Header -->
    <header class="py-4">
      <div class="mx-auto flex justify-between items-center px-6">
        <h1 class="text-xl font-bold text-gray-700">CMS WhiteBoston</h1>
        <nav class="flex space-x-6">
          <a href="docs" class="hover:text-violet-500">Docs</a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="w-6 h-6"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
            />
          </svg>
          <span>|</span>
          <a href="dashboard" class="hover:text-violet-500">login</a>
        </nav>
      </div>
    </header>

    <div class="max-w-7xl mx-auto">
      <!-- Hero Section -->
      <section class="py-16">
        <div class="flex items-center justify-between">
          <div class="py-6 m-4">
            <h1 class="text-lg font-bold text-violet-500 mb-6">
              Open-Source Content Management
            </h1>
            <h2 class="text-6xl font-bold text-gray-800 mb-6">
              The Headless CMS for Web Developers
            </h2>
            <p class="text-gray-600 text-xl mb-8">
              Whether you’re building a blog, or a custom web application,
              WhiteBoston CMS provides the tools you need to streamline your
              content management workflow.
            </p>
            <div class="flex space-x-4">
              <a
                href="#"
                class="bg-violet-500 text-white text-semibold px-6 py-3 rounded-lg shadow hover:bg-violet-600"
              >
                View Demo
              </a>
              <a
                href="#"
                class="border border-violet-500 text-violet-500 text-semibold px-6 py-3 rounded-lg shadow hover:bg-violet-600"
              >
                View Github
              </a>
            </div>
          </div>
          <div class="py-6 m-4">
            <div class="w-96"></div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16">
        <div class="mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-gray-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">
                Flexible Content Management
              </h3>
              <p class="text-gray-700">
                Create and organize your content with ease. WhiteBoston CMS
                gives you full control over your collections and fields.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="bg-gray-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">Role-Based Permissions</h3>
              <p class="text-gray-700">
                Easily manage who can view or edit content with customizable
                user roles.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="bg-gray-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">
                Markdown & HTML Support
              </h3>
              <p class="text-gray-700">
                Format your content in Markdown or HTML, whatever works best for
                your project.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="bg-gray-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">
                Supabase: Real-Time Backend
              </h3>
              <p class="text-gray-700">
                With Supabase, you get a fully managed, real-time backend
                solution for databases and authentication.
              </p>
            </div>

            <!-- Feature 5 -->
            <div class="bg-gray-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">Nuxt.js & TypeScript</h3>
              <p class="text-gray-700">
                Built with Nuxt.js for fast, server-rendered pages and
                TypeScript for enhanced productivity and safety in development.
              </p>
            </div>

            <!-- Feature 6 -->
            <div class="bg-gray-100 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-3">API-First Architecture</h3>
              <p class="text-gray-700">
                Deliver content anywhere using powerful REST or GraphQL APIs,
                built for scalability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="py-16">
        <div class="max-w-3xl mx-auto px-6 text-center">
          <h3 class="text-5xl font-bold text-violet-500 mb-4">
            Ready to Take Control of Your Content?
          </h3>
          <p class="text-gray-700 text-xl mb-8">
            Start using CMS WhiteBoston today and experience the simplicity of
            content management.
          </p>
          <a
            href="#"
            class="bg-violet-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 hover:text-violet-400"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
    <!-- Footer -->
    <footer class="bg-gray-50 py-4">
      <div class="text-center mt-2">
        <p class="mt-6 text-xs text-gray-700 dark:text-gray-300">
          &copy; {{ currentYear }} WhiteBoston CMS <br />
          Version {{ version }}
        </p>
      </div>
    </footer>
  </div>
</template>
