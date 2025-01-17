<template>
  <div v-if="editor" class="container">
    <EditorHeader :editor="editor" :setLink="setLink" />

    <div class="border border-gray-500">
      <editor-content :editor="editor" class="prose" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { Link } from "@tiptap/extension-link";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref("");
const selectedOption = ref(props.modelValue);
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

// Watch for changes and update the parent modelValue
watch(
  () => selectedOption.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  }
);

watch(
  () => modelValue,
  (value) => {
    if (!editor.value) return;

    const isSame = editor.value.getHTML() === value;
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
    content: props.modelValue || "starting typing",
    onUpdate: () => {
      emit("update:modelValue", editor.value.getHTML());
    },
  });
});

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>
