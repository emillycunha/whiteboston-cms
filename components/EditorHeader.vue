<template>
  <div class="control-group flex">
    <div class="button-group gap-x-2">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('bold') },
        ]"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="[
          toolbarButtonClasses,
          {
            'is-active': editor.isActive('italic'),
          },
        ]"
      >
        Italic
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('strike') },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Strike
      </button>
      <button
        @click="editor.chain().focus().setParagraph().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('paragraph') },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Paragraph
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 1 }) },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        H1
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 2 }) },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        H2
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 3 }) },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        H3
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 4 }) },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        H4
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('bulletList') },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Bullet list
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('orderedList') },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Ordered list
      </button>
      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('codeBlock') },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Code block
      </button>
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('blockquote') },
        ]"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Blockquote
      </button>
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="bg-gray-200 rounded-md px-2 py-1 m-2"
      >
        Horizontal rule
      </button>
      <button
        @click="setLink"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('link') },
        ]"
      >
        Set link
      </button>
      <button
        @click="editor.chain().focus().unsetLink().run()"
        :disabled="!editor.isActive('link')"
      >
        Unset link
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  editor: {
    type: Object,
    required: true,
  },
  setLink: {
    type: Function,
    default: () => {},
  },
});

const toolbarButtonClasses = "bg-gray-200 rounded-md px-2 py-1 m-2";
</script>

<style>
.is-active {
  background-color: aqua;
}
.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap p {
  margin: 0px !important;
}

.tiptap pre,
.tiptap ol,
.tiptap ul,
.tiptap blockquote,
.tiptap hr {
  margin: 0px !important;
}
</style>
