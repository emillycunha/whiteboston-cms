<template>
  <div class="control-group flex">
    <div class="button-group gap-x-2">
      <button
        type="button"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('bold') },
        ]"
        @click="editor.chain().focus().toggleBold().run()"
      >
        Bold
      </button>
      <button
        type="button"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="[
          toolbarButtonClasses,
          {
            'is-active': editor.isActive('italic'),
          },
        ]"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        Italic
      </button>
      <button
        type="button"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('strike') },
        ]"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        Strike
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('paragraph') },
        ]"
        @click="editor.chain().focus().setParagraph().run()"
      >
        Paragraph
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 1 }) },
        ]"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 2 }) },
        ]"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 3 }) },
        ]"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('bulletList') },
        ]"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        Bullet list
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('orderedList') },
        ]"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        Ordered list
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('codeBlock') },
        ]"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        Code block
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('blockquote') },
        ]"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        Blockquote
      </button>
      <button
        type="button"
        :class="[toolbarButtonClasses]"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        Horizontal rule
      </button>
      <button
        type="button"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('link') },
        ]"
        @click="setLink"
      >
        Set link
      </button>
      <button
        type="button"
        :disabled="!editor.isActive('link')"
        :class="[toolbarButtonClasses]"
        @click="editor.chain().focus().unsetLink().run()"
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

const toolbarButtonClasses = "bg-gray-200 rounded-md px-2 py-1 m-1";
</script>

<style></style>
