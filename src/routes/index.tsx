import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Flame, Sparkles, Image as ImageIcon, Download, Gauge, ShieldCheck, Infinity as InfinityIcon, Search as SearchIcon, MousePointerClick, Monitor } from "lucide-react";
import { Logo } from "@/components/Logo";
import { HorizontalImageRail } from "@/components/HorizontalImageRail";
import { MasonryFeed } from "@/components/MasonryFeed";
import { CATEGORIES, TRENDING_SEARCHES } from "@/lib/categories";
import { useQuery } from "@tanstack/react-query";
import { searchImages } from "@/lib/pixabay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PixHunt — Hunt the Perfect Image | Free HD & 4K Wallpapers" },
      { name: "description", content: "Discover and download millions of free HD, Full HD, 2K and 4K images. Wallpapers, art, anime, nature, cars and more — no signup, no watermarks." },
      { name: "keywords", content: "image search, free images, hd wallpapers, 4k wallpapers, anime, nature, pixabay, photo download" },
      { property: "og:title", content: "PixHunt — Hunt the Perfect Image" },
      { property: "og:description", content: "Discover and download millions of free HD, Full HD, 2K and 4K images." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pixhunt.lovable.app/" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8756f5cc-5b40-487d-b1fa-10e1b6f1fb4c" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PixHunt — Hunt the Perfect Image" },
      { name: "twitter:description", content: "Discover and download millions of free HD, Full HD, 2K and 4K images." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8756f5cc-5b40-487d-b1fa-10e1b6f1fb4c" },
    ],
    links: [{ rel: "canonical", href: "https://pixhunt.lovable.app/" }],
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

      <HorizontalImageRail title="4K Wallpapers" icon={<Monitor className="h-5 w-5 text-primary" />} query="wallpaper 4k" seeMoreTo="/search" />
      <HorizontalImageRail title="Trending Today" icon={<Flame className="h-5 w-5 text-orange-500" />} query="nature landscape" seeMoreTo="/trending" />
      <HorizontalImageRail title="Popular" icon={<Sparkles className="h-5 w-5 text-primary" />} category="backgrounds" seeMoreTo="/search" />

      {/* Recommended masonry */}
      <section className="space-y-3 px-4">
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <ImageIcon className="h-5 w-5 text-primary" /> Recommended for You
        </h2>
        <MasonryFeed keyPrefix="home-recommended" q="aesthetic" order="popular" />
      </section>

      {/* Why PixHunt */}
      <section className="space-y-4 px-4">
        <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Why <span className="text-gradient-brand">PixHunt</span>?</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ImageIcon, title: "Millions of Free Images", text: "Search Pixabay's massive library of royalty-free photos. New images added daily." },
            { icon: Sparkles, title: "4K Quality Downloads", text: "Get HD, Full HD, 2K, and 4K resolution where available. Perfect for wallpapers and projects." },
            { icon: Download, title: "One-Tap Download", text: "No signup, no watermark. Download directly to your gallery in seconds." },
            { icon: InfinityIcon, title: "No Limits", text: "Use for commercial or personal projects. Blog, YouTube, social media — all allowed under Pixabay License." },
            { icon: Gauge, title: "Light & Fast", text: "Small app size, fast search, smooth scrolling. Works on all devices." },
            { icon: ShieldCheck, title: "Safe & Legal", text: "All images from Pixabay official API. 100% free license, no copyright worries." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-background/60">
                <f.icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-4 px-4">
        <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">How It Works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: SearchIcon, step: "1. Search", text: 'Type anything — "sunset", "cat", "4k wallpaper".' },
            { icon: MousePointerClick, step: "2. Choose", text: "Browse HD to 4K quality options." },
            { icon: Download, step: "3. Download", text: "Tap download and it's saved to your gallery instantly." },
          ].map((s) => (
            <div key={s.step} className="glass rounded-2xl p-5 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
                <s.icon className="h-6 w-6 text-white" />
              </span>
              <h3 className="mt-3 font-semibold">{s.step}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4">
        <div className="glass mx-auto max-w-3xl rounded-3xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to Find Your Perfect Image?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Join thousands of users downloading HD & 4K photos daily.</p>
          <Link to="/search" search={{ q: "wallpaper" }} className="bg-gradient-brand mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105">
            <SearchIcon className="h-4 w-4" /> Start Searching
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">Powered by Pixabay · 100% Free · No Watermarks · No Login</p>
        </div>
      </section>
    </main>
  );
}

