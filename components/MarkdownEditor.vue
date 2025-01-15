<template>
  <div v-if="editor" class="container">
    <EditorHeader :editor="editor" :setLink="setLink" />

    <div class="border border-gray-500">
      <editor-content :editor="editor" class="prose max-w-full" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { Link } from "@tiptap/extension-link";
import { convertHtmlToMarkdown } from "@/utils/htmlToMarkdown";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref("");
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

// Watch for changes in `modelValue` and update the editor content
watch(
  () => modelValue,
  (value) => {
    if (!editor.value) return;

    const isSame = convertHtmlToMarkdown(editor.value.getHTML()) === value;
    if (isSame) return;

    editor.value.commands.setContent(value, false);
  }
);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        defaultProtocol: "https",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const markdownContent = convertHtmlToMarkdown(htmlContent);

      emit("update:modelValue", markdownContent);
    },
  });
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>
