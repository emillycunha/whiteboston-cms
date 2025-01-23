<template>
  <div>
    <div class="p-2 mb-6">
      <HtmlEditor v-model="content" />
      <div class="output-group">
        <label>Content</label>
        <code>{{ content }}</code>
      </div>
    </div>

    <div class="p-2 mt-6">
      <MarkdownEditor v-model="markdownContent" />
      <div>
        <h3>Markdown</h3>
        <pre>{{ markdownContent }}</pre>
      </div>
      <!-- Save Button -->
      <button
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        @click="saveMarkdown"
      >
        Save Markdown
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Reactive content
const content = ref("");
const markdownContent = ref("");

// Save markdown content
const saveMarkdown = () => {
  const fileName = "content.md";
  const fileContent = markdownContent.value;

  // Create a Blob with markdown content
  const blob = new Blob([fileContent], { type: "text/markdown" });

  // Create a link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Trigger the download
  link.click();

  // Clean up
  URL.revokeObjectURL(link.href);
};
</script>
