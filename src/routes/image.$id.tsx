import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Download, Share2, Link as LinkIcon, ArrowLeft, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { getImageById, searchImages } from "@/lib/pixabay";
import { ImageCard, ImageCardSkeleton } from "@/components/ImageCard";

export const Route = createFileRoute("/image/$id")({
  head: ({ match }) => {
    const id = (match.params as { id: string }).id;
    return {
      meta: [
        { title: `Image #${id} — PixHunt` },
        { name: "description", content: "Download this premium image in HD, Full HD, 2K or 4K." },
      ],
    };
  },
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["image", params.id],
      queryFn: async () => {
        const img = await getImageById(params.id);
        if (!img) throw notFound();
        return img;
      },
    }),
  component: ImagePage,
  notFoundComponent: () => (
    <div className="px-4 py-20 text-center text-muted-foreground">Image not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-4 py-20 text-center text-destructive">{error.message}</div>
  ),
});

function ImagePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: img } = useSuspenseQuery({
    queryKey: ["image", id],
    queryFn: async () => {
      const v = await getImageById(id);
      if (!v) throw new Error("Not found");
      return v;
    },
  });
  const [copied, setCopied] = useState(false);

  const firstTag = img.tags.split(",")[0]?.trim() || "";
  const similar = useQuery({
    queryKey: ["similar", firstTag],
    queryFn: () => searchImages({ q: firstTag, perPage: 12 }),
    enabled: !!firstTag,
  });

  const resolutions: { label: string; url: string; w: number }[] = [
    { label: "Preview", url: img.webformatURL, w: img.webformatWidth },
    { label: "HD", url: img.largeImageURL, w: 1280 },
  ];
  if (img.imageWidth >= 1920) {
    resolutions.push({ label: "Full HD", url: img.largeImageURL, w: 1920 });
  }
  if (img.imageWidth >= 2560) {
    resolutions.push({ label: "2K", url: img.largeImageURL, w: 2560 });
  }
  if (img.imageWidth >= 3840) {
    resolutions.push({ label: "4K", url: img.largeImageURL, w: 3840 });
  }

  function download(size: string) {
    navigate({ to: "/download/$id", params: { id: String(img.id) }, search: { size, url: img.largeImageURL } });
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "PixHunt Image", url }); return; } catch {}
    }
    copyLink();
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="space-y-6 px-4 pb-10 pt-2">
      <button
        onClick={() => window.history.back()}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-muted shadow-glow">
        <img src={img.largeImageURL} alt={img.tags} className="w-full" />
      </div>

      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{img.imageWidth} × {img.imageHeight}</span>
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {img.views.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {img.likes.toLocaleString()}</span>
          <span>by {img.user}</span>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {img.tags.split(",").map((t) => (
              <Link
                key={t}
                to="/search"
                search={{ q: t.trim() }}
                className="glass rounded-full px-3 py-1 text-xs"
              >
                #{t.trim()}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Download</h2>
          <div className="flex flex-wrap gap-2">
            {resolutions.map((r) => (
              <button
                key={r.label}
                onClick={() => download(r.label)}
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:scale-105"
              >
                <Download className="h-4 w-4" /> {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={share} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button onClick={copyLink} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <LinkIcon className="h-4 w-4" /> {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold">Similar Images</h2>
          {similar.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <ImageCardSkeleton key={i} height={200} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {similar.data?.hits.filter((s) => s.id !== img.id).slice(0, 8).map((s) => (
                <ImageCard key={s.id} img={s} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
