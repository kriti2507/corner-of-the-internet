import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/** Kriti's own Markdown, so no sanitising. External links open in a new tab. */
export function renderMarkdown(source: string) {
  const html = marked.parse(source.trim(), { async: false }) as string;
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noreferrer"');
}
