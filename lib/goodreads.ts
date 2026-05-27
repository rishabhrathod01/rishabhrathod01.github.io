export interface GoodreadsBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  smallCoverImage: string;
  isbn: string;
  userRating: number;
  averageRating: number;
  dateRead: string;
  dateAdded: string;
  shelf: "currently-reading" | "read" | "to-read";
  link: string;
  description: string;
  numPages: number;
  yearPublished: string;
  userReview: string;
}

export interface GoodreadsData {
  userId: string;
  username: string;
  books: GoodreadsBook[];
  lastSynced: string;
}

export const STORAGE_KEY = "goodreads_bookshelf_data";

// rss2json converts RSS → JSON with proper CORS headers.
// allorigins and corsproxy both fail for Goodreads.
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

export function extractUserId(input: string): string {
  const urlMatch = input.match(/\/user\/show\/(\d+)/);
  if (urlMatch) return urlMatch[1];
  const numericMatch = input.match(/^\d+/);
  if (numericMatch) return numericMatch[0];
  return input.trim();
}

/** Pull a named field from Goodreads' embedded description HTML.
 *  Format: "fieldname: VALUE<br>" where VALUE may be empty.
 *  Uses a word-boundary so "rating" doesn't match inside "average rating". */
function descField(description: string, field: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // \b before the field name ensures we don't match "average rating" when looking for "rating"
  const match = description.match(new RegExp(`\\b${escaped}:\\s*([^<\\n]*?)(?:<|\\n|$)`, "i"));
  return match ? match[1].trim() : "";
}

/** Extract the user's personal star rating (0-5), distinct from average rating. */
function userRatingFromDesc(description: string): number {
  // Explicitly exclude the "average rating" line with a negative lookbehind
  const match = description.match(/(?<!average )rating:\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

/** Upgrade a small Goodreads cover URL (._SY75_. / ._SX50_. etc.) to full-size. */
function largeCover(url: string): string {
  return url.replace(/\._[A-Z]+\d+_(\.[a-z]+)$/, "$1");
}

/** Extract cover image from the description <img> tag and upscale it. */
function coverFromDescription(description: string, thumbnail: string): string {
  const match = description.match(/<img[^>]+src="([^"]+)"/);
  if (match) return largeCover(match[1]);
  if (thumbnail) return largeCover(thumbnail);
  return "";
}

interface Rss2JsonItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
}

interface Rss2JsonResponse {
  status: string;
  feed: { title: string };
  items: Rss2JsonItem[];
}

function parseItem(
  item: Rss2JsonItem,
  shelf: GoodreadsBook["shelf"]
): GoodreadsBook {
  const desc = item.description || item.content || "";

  const author = descField(desc, "author");
  const averageRating = parseFloat(descField(desc, "average rating")) || 0;
  const yearPublished = descField(desc, "book published");
  const userRating = userRatingFromDesc(desc);

  // Dates come as "2023/10/19" — convert to ISO so Date() can parse them
  const rawDateRead = descField(desc, "read at");
  const rawDateAdded = descField(desc, "date added");
  const toISO = (d: string) => (d ? d.replace(/\//g, "-") : "");

  return {
    id: item.guid || item.link,
    title: item.title,
    author,
    coverImage: coverFromDescription(desc, item.thumbnail),
    smallCoverImage: item.thumbnail || "",
    isbn: "",
    userRating,
    averageRating,
    dateRead: toISO(rawDateRead),
    dateAdded: toISO(rawDateAdded) || item.pubDate,
    shelf,
    link: item.link,
    // rss2json doesn't surface book_description or num_pages
    description: "",
    numPages: 0,
    yearPublished,
    userReview: descField(desc, "review"),
  };
}

async function fetchShelf(
  userId: string,
  shelf: string
): Promise<Rss2JsonItem[]> {
  const rssUrl = encodeURIComponent(
    `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}&sort=date_added&order=d&per_page=200`
  );
  const res = await fetch(`${RSS2JSON}${rssUrl}`);
  if (!res.ok) throw new Error(`rss2json HTTP ${res.status}`);
  const json = (await res.json()) as Rss2JsonResponse;
  if (json.status !== "ok") throw new Error(`rss2json error: ${json.status}`);
  return json.items ?? [];
}

function usernameFromFeed(feedTitle: string): string {
  // "Rishabh's bookshelf: read"  →  "Rishabh"
  return feedTitle.replace(/'s bookshelf.*$/i, "").trim();
}

export async function syncGoodreads(input: string): Promise<GoodreadsData> {
  const userId = extractUserId(input);

  const rssUrl = (shelf: string) =>
    encodeURIComponent(
      `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}&sort=date_added&order=d&per_page=200`
    );

  // Fetch all three shelves; also grab the feed title from any successful one
  const [crRes, readRes, trRes] = await Promise.all([
    fetch(`${RSS2JSON}${rssUrl("currently-reading")}`).then(
      (r) => r.json() as Promise<Rss2JsonResponse>
    ),
    fetch(`${RSS2JSON}${rssUrl("read")}`).then(
      (r) => r.json() as Promise<Rss2JsonResponse>
    ),
    fetch(`${RSS2JSON}${rssUrl("to-read")}`).then(
      (r) => r.json() as Promise<Rss2JsonResponse>
    ),
  ]);

  for (const res of [crRes, readRes, trRes]) {
    if (res.status !== "ok") throw new Error(`Goodreads sync failed: ${res.status}`);
  }

  const currentlyReading = (crRes.items ?? []).map((i) =>
    parseItem(i, "currently-reading")
  );
  const read = (readRes.items ?? []).map((i) => parseItem(i, "read"));
  const toRead = (trRes.items ?? []).map((i) => parseItem(i, "to-read"));

  const feedTitle =
    crRes.feed?.title || readRes.feed?.title || trRes.feed?.title || "";
  const username = usernameFromFeed(feedTitle) || `User ${userId}`;

  return {
    userId,
    username,
    books: [...currentlyReading, ...read, ...toRead],
    lastSynced: new Date().toISOString(),
  };
}

export function getBookColor(title: string): string {
  const palette = [
    "#8B3A3A", // dusty red
    "#2D6A4F", // forest green
    "#1B4F72", // navy
    "#6C3483", // purple
    "#A0522D", // sienna
    "#2E4057", // slate
    "#5D4037", // brown
    "#1A5276", // ocean
    "#0E6655", // teal
    "#6D4C41", // coffee
    "#4A235A", // deep violet
    "#145A32", // deep green
    "#1B2631", // charcoal
    "#784212", // amber brown
    "#922B21", // crimson
    "#21618C", // cobalt
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function getBookHeight(numPages: number): number {
  if (numPages <= 0) return 155;
  if (numPages < 200) return 138;
  if (numPages < 350) return 155;
  if (numPages < 500) return 168;
  return 180;
}
