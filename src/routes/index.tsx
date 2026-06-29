import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Flame, Sparkles, Image as ImageIcon, Download, Gauge, ShieldCheck, Infinity as InfinityIcon, Search as SearchIcon, MousePointerClick } from "lucide-react";
import { Logo } from "@/components/Logo";
import { HorizontalImageRail } from "@/components/HorizontalImageRail";
import { MasonryFeed } from "@/components/MasonryFeed";
import { CATEGORIES, TRENDING_SEARCHES } from "@/lib/categories";
import { useQuery } from "@tanstack/react-query";
import { searchImages } from "@/lib/pixabay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PixHunt — Hunt the Perfect Image" },
      { name: "description", content: "Discover and download millions of HD, Full HD, 2K and 4K images. Wallpapers, art, anime, nature and more." },
      { property: "og:title", content: "PixHunt — Hunt the Perfect Image" },
      { property: "og:description", content: "Discover and download millions of HD, Full HD, 2K and 4K images." },
    ],
  }),
  component: Home,
});

function CategoryCard({ slug, name, query }: { slug: string; name: string; query: string }) {
  const { data } = useQuery({
    queryKey: ["cat-cover", slug],
    queryFn: () => searchImages({ q: query, perPage: 3, order: "popular" }),
    staleTime: 60 * 60_000,
  });
  const img = data?.hits[0];
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className="group relative block h-44 w-40 shrink-0 overflow-hidden rounded-2xl bg-muted sm:h-52 sm:w-48"
    >
      {img && (
        <img
          src={img.webformatURL}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <span className="absolute bottom-3 left-3 text-lg font-bold text-white drop-shadow">
        {name}
      </span>
    </Link>
  );
}

function Home() {
  return (
    <main className="space-y-10 pb-10">
      {/* Hero */}
      <section className="px-4 pt-6 text-center">
        <div className="mx-auto flex flex-col items-center gap-5">
          <Logo size={96} glow />
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm">
            <Zap className="h-4 w-4 text-yellow-400" />
            High-Velocity Visual Hunt
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-gradient-brand">Hunt</span> the Perfect
            <br />Image
          </h1>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Search and download millions of high-quality images. HD, Full HD, 2K, and 4K downloads available.
          </p>
        </div>
      </section>

      {/* Trending searches */}
      <section className="space-y-3 px-4">
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <Flame className="h-5 w-5 text-orange-500" /> Trending Searches
        </h2>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((t) => (
            <Link
              key={t}
              to="/search"
              search={{ q: t }}
              className="glass rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Categories carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <Sparkles className="h-5 w-5 text-primary" /> Browse Categories
          </h2>
          <Link to="/categories" className="text-sm text-primary">See all ›</Link>
        </div>
        <div className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} query={c.query} />
          ))}
        </div>
      </section>

      <HorizontalImageRail title="Trending Today" icon={<Flame className="h-5 w-5 text-orange-500" />} query="nature landscape" seeMoreTo="/trending" />
      <HorizontalImageRail title="Popular Wallpapers" icon={<Sparkles className="h-5 w-5 text-primary" />} category="backgrounds" seeMoreTo="/search" />

      {/* Recommended masonry */}
      <section className="space-y-3 px-4">
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <ImageIcon className="h-5 w-5 text-primary" /> Recommended for You
        </h2>
        <MasonryFeed keyPrefix="home-recommended" q="aesthetic" order="popular" />
      </section>
    </main>
  );
}
