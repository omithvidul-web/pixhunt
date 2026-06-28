export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  user: string;
  fullHDURL?: string;
  imageURL?: string;
}

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

const DEFAULT_KEY = "55910754-d344d38f2cfadf8a607b49d7e";

export function getApiKey(): string {
  if (typeof window === "undefined") return DEFAULT_KEY;
  return localStorage.getItem("pixhunt_api_key") || DEFAULT_KEY;
}

export interface SearchParams {
  q?: string;
  category?: string;
  page?: number;
  perPage?: number;
  order?: "popular" | "latest";
  orientation?: "all" | "horizontal" | "vertical";
}

export async function searchImages(params: SearchParams): Promise<PixabayResponse> {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", getApiKey());
  if (params.q) url.searchParams.set("q", params.q);
  if (params.category) url.searchParams.set("category", params.category);
  url.searchParams.set("page", String(params.page || 1));
  url.searchParams.set("per_page", String(params.perPage || 24));
  url.searchParams.set("order", params.order || "popular");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("image_type", "photo");
  if (params.orientation && params.orientation !== "all") {
    url.searchParams.set("orientation", params.orientation);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Pixabay error: ${res.status}`);
  return res.json();
}

export async function getImageById(id: string | number): Promise<PixabayImage | null> {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", getApiKey());
  url.searchParams.set("id", String(id));
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data: PixabayResponse = await res.json();
  return data.hits[0] || null;
}

export const PIXABAY_CATEGORIES = [
  "backgrounds", "fashion", "nature", "science", "education", "feelings",
  "health", "people", "religion", "places", "animals", "industry",
  "computer", "food", "sports", "transportation", "travel", "buildings",
  "business", "music",
] as const;
