import MarkdownIt from "markdown-it";

// Initialize Markdown-It
const md = new MarkdownIt();

// Preprocess HTML to apply custom rules
function preprocessHtml(htmlContent) {
  let processedHtml = htmlContent;
  processedHtml = processedHtml.replace(
    /<li><p>(.*?)<\/p><\/li>/g,
    "<li>$1</li>"
  );
  return processedHtml;
}

export function convertHtmlToMarkdown(htmlContent) {
  // Preprocess the HTML to ensure any <li><p></p></li> are properly formatted
  const preprocessedHtml = preprocessHtml(htmlContent);

  const lines = preprocessedHtml
    // Convert Headers
    .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
    .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")

    // Convert Bold and Italic
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<b>(.*?)<\/b>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "_$1_")
    .replace(/<i>(.*?)<\/i>/g, "_$1_")

    // Convert Strike-Through
    .replace(/<s>(.*?)<\/s>/g, "~~$1~~")

    // Convert Paragraphs with better handling of inline elements inside
    .replace(/<p>(.*?)<\/p>/g, (match, content) => {
      // Handle empty paragraphs and preserve them
      if (content.trim() === "") {
        return "\n\n"; // Add two newlines for an empty paragraph
      }
      // Handle inline elements inside paragraphs
      return (
        content
          .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
          .replace(/<em>(.*?)<\/em>/g, "_$1_")
          .replace(/<b>(.*?)<\/b>/g, "**$1**")
          .replace(/<i>(.*?)<\/i>/g, "_$1_") + "\n\n" // Ensure double newline for paragraphs
      );
    })

    // Convert Code Blocks
    .replace(
      /<pre><code(?: class="language-(.*?)")?>([\s\S]*?)<\/code><\/pre>/g,
      (match, language, code) => {
        const lang = language ? language.trim() : "";
        return `\`\`\`${lang}\n${code.trim()}\n\`\`\`\n`;
      }
    )

    // Convert Ordered Lists
    .replace(
      /<ol>(.*?)<\/ol>/gs,
      (match, content) =>
        content
          .split(/<li>(.*?)<\/li>/)
          .filter((item) => item.trim() !== "")
          .map((item, index) => `${index + 1}. ${item.trim()}`)
          .join("\n") + "\n"
    )

    // Convert Unordered Lists
    .replace(
      /<ul>(.*?)<\/ul>/gs,
      (match, content) =>
        content
          .split(/<li>(.*?)<\/li>/)
          .filter((item) => item.trim() !== "")
          .map((item) => `- ${item.trim()}`)
          .join("\n") + "\n"
    )

    // Convert Horizontal Rule
    .replace(/<hr\s*\/?>/g, "---\n")

    // Convert Blockquotes
    .replace(/<blockquote>([\s\S]*?)<\/blockquote>/gs, (match, content) =>
      content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .map((line) => `> ${line}`)
        .join("\n")
    )

    // Convert link
    .replace(/<a [^>]*href="(.*?)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")

    // Handle Line Breaks (convert <br> to newline)
    .replace(/<br\s*\/?>/g, "\n")

    // Remove other HTML tags
    .replace(/<\/?[^>]+(>|$)/g, "");

  const markdown = lines.trim();

  return markdown;
}
