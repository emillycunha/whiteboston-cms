<template>
    <div class="p-6 space-y-10">

    <!-- Header Section -->
    <div class="md:flex md:items-center md:justify-between mb-20">
        <div class="min-w-0 flex-1">
            <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">How to Write a Blog</h2>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
            <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Help</button>
            <button type="button" class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Post List</button>
        </div>
    </div>

    <div class="prose mx-auto max-w-4xl p-6">

        <p>
        Blogging is a great way to share your thoughts, expertise, and creativity with the world. Here's how you can write a blog using Markdown.
        </p>

        <h2 class="text-xl font-semibold mt-6">Markdown Blog Example</h2>

        <pre class="whitespace-pre-wrap break-words bg-gray-100 text-gray-800 p-10 rounded-lg">
            <code class="language-markdown">
                {`# How to Write a Blog

                Blogging is a great way to share your thoughts, expertise, and creativity with the world. Here's how you can write a blog using Markdown.

                ---

                ## Why Use Markdown?

                Markdown is a simple and lightweight markup language that allows you to format text with minimal syntax. It is widely used for writing blogs because:

                - It's easy to learn and use.
                - It supports headings, lists, links, and images.
                - It's compatible with most blogging platforms.

                ---

                ## Markdown Basics

                Here’s a quick reference to help you format your blog:

                ### Headings
                Use \`#\` to \`######\` for different levels of headings:

                \`\`\`markdown
                # H1 - Main Title
                ## H2 - Section Title
                ### H3 - Subsection Title
                \`\`\`

                ### Text Formatting
                - **Bold**: \`**bold text**\` → **bold text**
                - *Italic*: \`*italic text*\` → *italic text*

                ### Lists
                #### Ordered List:
                1. First item
                2. Second item
                3. Third item

                #### Unordered List:
                - Bullet item
                - Another bullet

                ### Links and Images
                - Links: \`[Text](https://example.com)\`
                - Images: \`![Alt text](https://via.placeholder.com/150)\`

                ---

                ## Example Blog Structure

                Here’s a basic example of how your blog could look:

                \`\`\`markdown
                # My Amazing Blog Title

                ## Introduction

                This is the introduction to my blog. It gives readers an overview of what to expect.

                ---

                ## Main Content

                ### Subsection 1
                Details about the first topic.

                ### Subsection 2
                Details about the second topic.

                ---

                ## Conclusion

                A brief summary or call-to-action to engage readers.
                \`\`\`

                ---

                ## Pro Tips for Writing Blogs

                1. Start with an outline to organize your thoughts.
                2. Use short paragraphs for readability.
                3. Add images to make your blog visually appealing.
                4. End with a call-to-action to engage your audience.

                Happy blogging!`}
            </code>
        </pre>
    </div>

    </div>
</template>

<script setup>
</script>

<style>
</style>