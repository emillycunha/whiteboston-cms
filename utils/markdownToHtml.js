import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export function convertMarkdownToHtml(markdown) {
  console.log("[Markdown Content]:", markdown);
  const htmlContent = md.render(markdown);
  console.log("[Generated HTML]:", htmlContent);
  return htmlContent;
}
