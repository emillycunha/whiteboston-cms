import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export function convertMarkdownToHtml(markdown) {
  const htmlContent = md.render(markdown);
  return htmlContent;
}
