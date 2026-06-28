import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { MasonryFeed } from "@/components/MasonryFeed";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending Images — PixHunt" },
      { name: "description", content: "The hottest trending images on PixHunt right now." },
      { property: "og:title", content: "Trending Images — PixHunt" },
    ],
  }),
  component: () => (
    <main className="space-y-5 px-4 pb-10 pt-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Flame className="h-6 w-6 text-orange-500" /> Trending Today
      </h1>
      <MasonryFeed keyPrefix="trending" q="trending" order="popular" />
    </main>
  ),
});
