function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Site paths (`/posts/...`) or https links only. */
const URL = String.raw`(\/[^)\s]*|https:\/\/[^)\s]+)`;
/** `![alt](src)` or `![alt](src "caption")`, matched after escaping. */
const IMAGE = new RegExp(String.raw`!\[([^\]]*)\]\(${URL}(?:\s+&quot;(.*?)&quot;)?\)`, "g");
const IMAGE_LINE_RAW = new RegExp(String.raw`^!\[([^\]]*)\]\(${URL}(?:\s+"(.*)")?\)$`);
const LINK = new RegExp(String.raw`\[([^\]]+)\]\(${URL}\)`, "g");

function img(alt: string, src: string) {
  return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
}

function inline(value: string) {
  // Code spans first, so nothing inside them gets formatted.
  const code: string[] = [];
  let out = escapeHtml(value).replace(/`([^`]+)`/g, (_, text: string) => {
    code.push(`<code>${text}</code>`);
    return `\u0000${code.length - 1}\u0000`;
  });

  out = out
    .replace(IMAGE, (_, alt: string, src: string) => img(alt, src))
    .replace(LINK, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s](?:[^*]*[^*\s])?)\*(?![*\w])/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_\s](?:[^_]*[^_\s])?)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return out.replace(/\u0000(\d+)\u0000/g, (_, i: string) => code[Number(i)]);
}

/** An image alone on its line becomes a figure; the "title" becomes its caption. */
function figure(line: string) {
  const match = line.match(IMAGE_LINE_RAW);
  if (!match) return null;
  const [, alt, src, caption] = match;
  const cap = caption ? `<figcaption>${inline(caption)}</figcaption>` : "";
  return `<figure>${img(escapeHtml(alt), escapeHtml(src))}${cap}</figure>`;
}

/**
 * Markdown for notes in content/posts.
 * Blocks: paragraphs, # headings, - and 1. lists, > quotes, --- dividers,
 * ``` code blocks, and images on their own line (several in a row become a photo grid).
 * Inline: **bold**, *italic* or _italic_, ~~strike~~, `code`, [links](/path), ![images](/path).
 */
export function renderMarkdown(source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] | null = null;
  let photos: string[] | null = null;
  let fence: string[] | null = null;

  function closeList() {
    if (!list) return;
    html.push(`<${list.tag}>${list.items.join("")}</${list.tag}>`);
    list = null;
  }
  function closeQuote() {
    if (!quote) return;
    html.push(`<blockquote>${quote.map((line) => `<p>${inline(line)}</p>`).join("")}</blockquote>`);
    quote = null;
  }
  function closePhotos() {
    if (!photos) return;
    html.push(photos.length === 1 ? photos[0] : `<div class="journal-gallery">${photos.join("")}</div>`);
    photos = null;
  }
  function closeAll() {
    closeList();
    closeQuote();
    closePhotos();
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (fence) {
      if (trimmed.startsWith("```")) {
        html.push(`<pre><code>${fence.map(escapeHtml).join("\n")}</code></pre>`);
        fence = null;
      } else {
        fence.push(line);
      }
      continue;
    }
    if (trimmed.startsWith("```")) {
      closeAll();
      fence = [];
      continue;
    }

    if (!trimmed) {
      closeAll();
      continue;
    }

    const photo = figure(trimmed);
    if (photo) {
      closeList();
      closeQuote();
      photos ??= [];
      photos.push(photo);
      continue;
    }
    closePhotos();

    const quoted = trimmed.match(/^>\s?(.*)$/);
    if (quoted) {
      closeList();
      quote ??= [];
      if (quoted[1]) quote.push(quoted[1]);
      continue;
    }
    closeQuote();

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const tag = bullet ? "ul" : "ol";
      if (list && list.tag !== tag) closeList();
      list ??= { tag, items: [] };
      list.items.push(`<li>${inline((bullet ?? numbered)![1])}</li>`);
      continue;
    }
    closeList();

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      html.push("<hr>");
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length + 1;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    html.push(`<p>${inline(trimmed)}</p>`);
  }
  if (fence) html.push(`<pre><code>${fence.map(escapeHtml).join("\n")}</code></pre>`);
  closeAll();
  return html.join("\n");
}
