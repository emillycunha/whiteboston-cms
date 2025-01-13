<template>
  <div class="prose prose-a:no-underline prose-invert max-w-full">
    <h1 v-if="page?.title" class="text-sm text-teal-500 font-bold mb-4">
      {{ page.title }}
    </h1>

    <ContentRenderer v-if="page" :key="page._id" :value="page" />

    <div v-else>
      <h1>Page Not Found</h1>
      <p>The content you’re looking for doesn’t exist.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "docs",
});

const { page } = useContent();
</script>
