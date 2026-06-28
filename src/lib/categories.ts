export interface CategoryDef {
  slug: string;
  name: string;
  query: string;
  pixabayCategory?: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "nature", name: "Nature", query: "nature landscape", pixabayCategory: "nature" },
  { slug: "anime", name: "Anime", query: "anime art illustration" },
  { slug: "cars", name: "Cars", query: "sports car", pixabayCategory: "transportation" },
  { slug: "4k-wallpapers", name: "4K Wallpapers", query: "wallpaper 4k", pixabayCategory: "backgrounds" },
  { slug: "technology", name: "Technology", query: "technology", pixabayCategory: "computer" },
  { slug: "gaming", name: "Gaming", query: "gaming controller neon" },
  { slug: "fashion", name: "Fashion", query: "fashion model", pixabayCategory: "fashion" },
  { slug: "art", name: "Art", query: "abstract art painting" },
  { slug: "photography", name: "Photography", query: "photography portrait" },
  { slug: "animals", name: "Animals", query: "wild animals", pixabayCategory: "animals" },
  { slug: "aesthetic", name: "Aesthetic", query: "aesthetic pastel" },
];

export const TRENDING_SEARCHES = [
  "neon city", "sunset mountains", "cyberpunk", "space galaxy",
  "ocean waves", "forest mist", "minimalist abstract", "aurora borealis",
  "cherry blossom", "desert dunes", "northern lights", "city skyline night",
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
