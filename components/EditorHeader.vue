<template>
  <div class="control-group flex">
    <div class="button-group gap-x-2">
      <button
        type="button"
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
        type="button"
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
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('strike') },
        ]"
      >
        Strike
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setParagraph().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('paragraph') },
        ]"
      >
        Paragraph
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 1 }) },
        ]"
      >
        H1
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 2 }) },
        ]"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 3 }) },
        ]"
      >
        H3
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('heading', { level: 4 }) },
        ]"
      >
        H4
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('bulletList') },
        ]"
      >
        Bullet list
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('orderedList') },
        ]"
      >
        Ordered list
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('codeBlock') },
        ]"
      >
        Code block
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('blockquote') },
        ]"
      >
        Blockquote
      </button>

      <button
        type="button"
        @click="setLink"
        :class="[
          toolbarButtonClasses,
          { 'is-active': editor.isActive('link') },
        ]"
      >
        Set link
      </button>
      <button
        type="button"
        @click="editor.chain().focus().unsetLink().run()"
        :disabled="!editor.isActive('link')"
        :class="[toolbarButtonClasses]"
      >
        Unset link
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        :class="[toolbarButtonClasses]"
      >
        Horizontal rule
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
