import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentCollection = "articles" | "cases" | "faq";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ContentItem = {
  slug: string;
  collection: ContentCollection;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishDate: string;
  author: string;
  cover: string;
  content: string;
  readingTime: string;
  toc: TocItem[];
};

const contentRoot = path.join(process.cwd(), "content");
const defaultArticleCover = "/images/home-hero-living.webp";

export function getContentSlugs(collection: ContentCollection) {
  const directory = path.join(contentRoot, collection);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => getContentByFile(collection, file).slug);
}

export function getContentBySlug(collection: ContentCollection, slug: string): ContentItem {
  const directory = path.join(contentRoot, collection);
  const matchedFile = findContentFile(directory, slug);

  if (!matchedFile) {
    throw new Error(`Content not found: ${collection}/${slug}`);
  }

  return readContentFile(collection, directory, matchedFile);
}

function getContentByFile(collection: ContentCollection, file: string): ContentItem {
  const directory = path.join(contentRoot, collection);
  return readContentFile(collection, directory, file);
}

function readContentFile(collection: ContentCollection, directory: string, file: string): ContentItem {
  const fullPath = path.join(directory, file);
  const fileSlug = file.replace(/\.mdx?$/, "");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const tags = normalizeArray(data.tags ?? data.keywords);
  const publishDate = normalizeDate(data.publishDate ?? data.date);
  const enhancedContent = enhanceMarkdown(content);
  const publicSlug = normalizePublicSlug(data.slug, data.title, fileSlug);

  return {
    slug: publicSlug,
    collection,
    title: data.title ?? fileSlug,
    description: data.description ?? "",
    category: data.category ?? defaultCategory(collection),
    tags,
    publishDate,
    author: data.author ?? "一窗生活科技",
    cover: normalizeCover(data.cover, collection),
    content: enhancedContent,
    readingTime: estimateReadingTime(content),
    toc: generateToc(content)
  };
}

function findContentFile(directory: string, slug: string) {
  if (!fs.existsSync(directory)) {
    return null;
  }

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  const candidates = getSlugCandidates(slug);

  for (const file of files) {
    const fileSlug = stripExtension(file);

    if (candidates.has(fileSlug)) {
      return file;
    }
  }

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    const publicSlug = normalizePublicSlug(data.slug, data.title, stripExtension(file));

    if (candidates.has(publicSlug)) {
      return file;
    }
  }

  return null;
}

function normalizePublicSlug(frontMatterSlug: unknown, title: unknown, fileSlug: string) {
  if (typeof frontMatterSlug === "string" && frontMatterSlug.trim()) {
    return stripExtension(frontMatterSlug.trim());
  }

  const decodedFileSlug = safeDecode(fileSlug);

  if (decodedFileSlug && decodedFileSlug !== fileSlug) {
    return decodedFileSlug;
  }

  if (fileSlug && fileSlug !== "index") {
    return fileSlug;
  }

  return typeof title === "string" && title.trim() ? slugify(title) : fileSlug;
}

function getSlugCandidates(slug: string) {
  const baseSlug = stripExtension(slug);
  const decodedSlug = safeDecode(baseSlug);
  const candidates = new Set<string>([baseSlug, encodeURIComponent(baseSlug)]);

  if (decodedSlug) {
    candidates.add(decodedSlug);
    candidates.add(encodeURIComponent(decodedSlug));
  }

  return candidates;
}

function stripExtension(slug: string) {
  return slug.replace(/\.mdx?$/, "");
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getAllContent(collection: ContentCollection) {
  const directory = path.join(contentRoot, collection);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => readContentFile(collection, directory, file))
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
}

export function getContentCategories(collection: ContentCollection) {
  return Array.from(new Set(getAllContent(collection).map((item) => item.category)));
}

export function getContentTags(collection: ContentCollection) {
  return Array.from(new Set(getAllContent(collection).flatMap((item) => item.tags)));
}

export function getContentByCategory(collection: ContentCollection, category?: string) {
  const items = getAllContent(collection);

  if (!category || category === "全部") {
    return items;
  }

  return items.filter((item) => item.category === category);
}

export function getContentByTag(collection: ContentCollection, tag?: string) {
  const items = getAllContent(collection);

  if (!tag) {
    return items;
  }

  return items.filter((item) => item.tags.includes(tag));
}

export function getAdjacentContent(collection: ContentCollection, slug: string) {
  const items = getAllContent(collection);
  const index = items.findIndex((item) => item.slug === slug);

  return {
    previous: index > 0 ? items[index - 1] : null,
    next: index >= 0 && index < items.length - 1 ? items[index + 1] : null
  };
}

export function getRelatedContent(collection: ContentCollection, slug: string, limit = 3) {
  const items = getAllContent(collection);
  const current = items.find((item) => item.slug === slug);

  if (!current) {
    return [];
  }

  return items
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      item,
      score:
        (item.category === current.category ? 3 : 0) +
        item.tags.filter((tag) => current.tags.includes(tag)).length
    }))
    .sort((a, b) => b.score - a.score || (a.item.publishDate < b.item.publishDate ? 1 : -1))
    .slice(0, limit)
    .map(({ item }) => item);
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function normalizeDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function normalizeCover(value: unknown, collection: ContentCollection) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return collection === "articles" ? defaultArticleCover : "";
}

function defaultCategory(collection: ContentCollection) {
  if (collection === "cases") return "案例中心";
  if (collection === "faq") return "常见问题";
  return "住宅窗膜知识";
}

function estimateReadingTime(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#>*_\-[\]()`|:-]/g, "")
    .trim();
  const minutes = Math.max(1, Math.ceil(plainText.length / 500));

  return `约${minutes}分钟`;
}

function generateToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const usedIds = new Map<string, number>();

  for (const match of content.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    const level = match[1].length as 2 | 3;
    const text = stripMarkdown(match[2]);
    const baseId = slugify(text);
    const count = usedIds.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    usedIds.set(baseId, count + 1);
    toc.push({ id, text, level });
  }

  return toc;
}

function enhanceMarkdown(content: string) {
  return addHeadingIds(convertTables(embedYouTube(content)));
}

function embedYouTube(content: string) {
  return content.replace(
    /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,}))(?:[^\n]*)?$/gm,
    (_match, _url, id) => `<YouTube id="${id}" />`
  );
}

function convertTables(content: string) {
  const lines = content.split("\n");
  const output: string[] = [];
  let index = 0;
  let inCodeBlock = false;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      output.push(line);
      index += 1;
      continue;
    }

    if (!inCodeBlock && isTableStart(lines, index)) {
      const tableLines: string[] = [lines[index], lines[index + 1]];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }

      output.push(markdownTableToHtml(tableLines));
      continue;
    }

    output.push(line);
    index += 1;
  }

  return output.join("\n");
}

function addHeadingIds(content: string) {
  const usedIds = new Map<string, number>();

  return content.replace(/^(#{2,3})\s+(.+)$/gm, (_match, hashes: string, text: string) => {
    const level = hashes.length;
    const cleanText = stripMarkdown(text);
    const baseId = slugify(cleanText);
    const count = usedIds.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    usedIds.set(baseId, count + 1);
    return `<h${level} id="${id}">${cleanText}</h${level}>`;
  });
}

function isTableStart(lines: string[], index: number) {
  return isTableRow(lines[index]) && Boolean(lines[index + 1]?.match(/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/));
}

function isTableRow(line: string) {
  return line.includes("|") && line.trim().length > 0;
}

function markdownTableToHtml(lines: string[]) {
  const [headerLine, _separatorLine, ...bodyLines] = lines;
  const headers = splitTableRow(headerLine);
  const rows = bodyLines.map(splitTableRow);

  return [
    '<div className="overflow-x-auto">',
    '<table>',
    "<thead>",
    `<tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`,
    "</thead>",
    "<tbody>",
    ...rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`),
    "</tbody>",
    "</table>",
    "</div>"
  ].join("\n");
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function stripMarkdown(text: string) {
  return text
    .replace(/[`*_~]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();
}

function slugify(text: string) {
  const slug = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug || "section";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
