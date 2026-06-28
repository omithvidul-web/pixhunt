import { createFileRoute, notFound } from "@tanstack/react-router";
import { MasonryFeed } from "@/components/MasonryFeed";
import { getCategory } from "@/lib/categories";
import { useEffect } from "react";
import { trackCategory } from "@/lib/analytics";

export const Route = createFileRoute("/category/$slug")({
  head: ({ match }) => {
    const slug = (match.params as { slug: string }).slug;
    const cat = getCategory(slug);
    const title = cat ? `${cat.name} Images — PixHunt` : "Category — PixHunt";
    return {
      meta: [
        { title },
        { name: "description", content: cat ? `Download high-quality ${cat.name.toLowerCase()} images in HD, 2K and 4K.` : "Category" },
        { property: "og:title", content: title },
      ],
    };
  },
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return cat;
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="px-4 py-20 text-center text-muted-foreground">Category not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-4 py-20 text-center text-destructive">{error.message}</div>
  ),
});

function CategoryPage() {
  const cat = Route.useLoaderData();
  useEffect(() => { trackCategory(cat.slug); }, [cat.slug]);

  return (
    <main className="space-y-5 px-4 pb-10 pt-4">
      <header>
        <h1 className="text-3xl font-bold">
          <span className="text-gradient-brand">{cat.name}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Premium {cat.name.toLowerCase()} images, ready to download.</p>
      </header>
      <MasonryFeed keyPrefix={`cat-${cat.slug}`} q={cat.query} category={cat.pixabayCategory} order="popular" />
    </main>
  );
}
