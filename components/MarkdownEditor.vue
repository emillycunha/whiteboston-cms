<template>
  <div v-if="editor" class="container">
    <EditorHeader :editor="editor" :setLink="setLink" />

    <div class="border border-gray-200 rounded-md p-4 min-h-60">
      <editor-content :editor="editor" class="prose max-w-full" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { Link } from "@tiptap/extension-link";
import { convertHtmlToMarkdown } from "@/utils/htmlToMarkdown";

const model = defineModel();
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const editor = ref(null);

function setLink() {
  if (!editor.value) return;

  const previousUrl = editor.value.getAttributes("link").href || "";
  const url = window.prompt("URL", previousUrl);

  // Cancelled
  if (url === null) {
    return;
  }

  // Empty: Remove link
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  // Set or update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
}

onMounted(() => {
  const htmlContent = convertMarkdownToHtml(model.value || "starting typing");

  editor.value = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        defaultProtocol: "https",
      }),
    ],
    content: htmlContent,
    onUpdate: () => {
      const htmlContent = editor.value.getHTML();
      const markdownContent = convertHtmlToMarkdown(htmlContent);
      model.value = markdownContent;
    },
  });
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>
