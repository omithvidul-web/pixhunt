import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";
import { MasonryFeed } from "@/components/MasonryFeed";
import { trackSearch } from "@/lib/analytics";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
  order: fallback(z.enum(["popular", "latest"]), "popular").default("popular"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: ({ match }) => {
    const q = (match.search as { q?: string }).q;
    const title = q ? `${q} — PixHunt Search` : "Search — PixHunt";
    return {
      meta: [
        { title },
        { name: "description", content: `Search results for ${q || "images"} on PixHunt.` },
        { property: "og:title", content: title },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q, order } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q);

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = input.trim();
    if (v) trackSearch(v);
    navigate({ to: "/search", search: { q: v, order } });
  }

  return (
    <main className="space-y-5 px-4 pb-10 pt-2">
      <form onSubmit={submit} className="glass mx-auto flex max-w-3xl items-center gap-2 rounded-full p-1.5">
        <div className="flex flex-1 items-center gap-2 px-4">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search images..."
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-brand rounded-full px-5 py-2 text-sm font-bold text-white shadow-glow"
        >
          Hunt
        </button>
      </form>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => navigate({ to: "/search", search: { q, order: "popular" } })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              order === "popular" ? "bg-gradient-brand text-white" : "text-muted-foreground"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => navigate({ to: "/search", search: { q, order: "latest" } })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              order === "latest" ? "bg-gradient-brand text-white" : "text-muted-foreground"
            }`}
          >
            Latest
          </button>
        </div>
      </div>

      <MasonryFeed
        keyPrefix="search"
        q={q || undefined}
        order={order}
      />
    </main>
  );
}
