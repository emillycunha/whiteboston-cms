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

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref("");
const editor = ref(null);

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
    extensions: [StarterKit],
    content: "",
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

<style>
.is-active {
  background-color: #000;
}
</style>
