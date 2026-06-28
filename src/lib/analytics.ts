// Simple localStorage-backed analytics for the admin dashboard.
const SEARCH_KEY = "pixhunt_searches";
const DOWNLOAD_KEY = "pixhunt_downloads";
const KEYWORD_KEY = "pixhunt_keywords";
const CATEGORY_KEY = "pixhunt_category_hits";

interface DailyCount { date: string; count: number; }

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function bumpDaily(key: string) {
  const arr = readJSON<DailyCount[]>(key, []);
  const d = today();
  const last = arr[arr.length - 1];
  if (last && last.date === d) last.count += 1;
  else arr.push({ date: d, count: 1 });
  // keep last 30 days
  while (arr.length > 30) arr.shift();
  writeJSON(key, arr);
}

export function trackSearch(query: string) {
  if (!query) return;
  bumpDaily(SEARCH_KEY);
  const kws = readJSON<Record<string, number>>(KEYWORD_KEY, {});
  const k = query.toLowerCase().trim();
  kws[k] = (kws[k] || 0) + 1;
  writeJSON(KEYWORD_KEY, kws);
}

export function trackCategory(slug: string) {
  const cats = readJSON<Record<string, number>>(CATEGORY_KEY, {});
  cats[slug] = (cats[slug] || 0) + 1;
  writeJSON(CATEGORY_KEY, cats);
}

export function trackDownload() {
  bumpDaily(DOWNLOAD_KEY);
}

export function getSearchSeries() { return readJSON<DailyCount[]>(SEARCH_KEY, []); }
export function getDownloadSeries() { return readJSON<DailyCount[]>(DOWNLOAD_KEY, []); }
export function getKeywords() { return readJSON<Record<string, number>>(KEYWORD_KEY, {}); }
export function getCategoryHits() { return readJSON<Record<string, number>>(CATEGORY_KEY, {}); }

export function totalSearches() {
  return getSearchSeries().reduce((s, x) => s + x.count, 0);
}
export function totalDownloads() {
  return getDownloadSeries().reduce((s, x) => s + x.count, 0);
}

export function resetAnalytics() {
  [SEARCH_KEY, DOWNLOAD_KEY, KEYWORD_KEY, CATEGORY_KEY].forEach((k) =>
    localStorage.removeItem(k)
  );
}
