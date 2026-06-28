import { createFileRoute, Link } from "@tanstack/react-router";
import { Grid3x3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/lib/categories";
import { searchImages } from "@/lib/pixabay";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — PixHunt" },
      { name: "description", content: "Browse all image categories on PixHunt: Nature, Anime, Cars, Wallpapers, Technology, Gaming and more." },
      { property: "og:title", content: "All Categories — PixHunt" },
    ],
  }),
  component: CategoriesPage,
});

function CategoryTile({ slug, name, query }: { slug: string; name: string; query: string }) {
  const { data } = useQuery({
    queryKey: ["cat-cover", slug],
    queryFn: () => searchImages({ q: query, perPage: 3 }),
    staleTime: 60 * 60_000,
  });
  const img = data?.hits[0];
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-muted"
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
      <span className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow">{name}</span>
    </Link>
  );
}

function CategoriesPage() {
  return (
    <main className="space-y-5 px-4 pb-10 pt-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Grid3x3 className="h-6 w-6 text-primary" /> All Categories
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <CategoryTile key={c.slug} slug={c.slug} name={c.name} query={c.query} />
        ))}
      </div>
    </main>
  );
}
