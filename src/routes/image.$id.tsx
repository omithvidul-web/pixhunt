import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Download, Share2, Link as LinkIcon, X, Eye, Heart, Tag, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [showSizes, setShowSizes] = useState(false);

  const firstTag = img.tags.split(",")[0]?.trim() || "";
  const similar = useQuery({
    queryKey: ["similar", firstTag],
    queryFn: () => searchImages({ q: firstTag, perPage: 12 }),
    enabled: !!firstTag,
  });

  const resolutions: { label: string; w: number }[] = [
    { label: "HD", w: 1280 },
    ...(img.imageWidth >= 1920 ? [{ label: "Full HD", w: 1920 }] : []),
    ...(img.imageWidth >= 2560 ? [{ label: "2K", w: 2560 }] : []),
    ...(img.imageWidth >= 3840 ? [{ label: "4K", w: 3840 }] : []),
  ];
  const topRes = resolutions[resolutions.length - 1] || { label: "HD", w: 1280 };

  function download(size: string) {
    navigate({
      to: "/download/$id",
      params: { id: String(img.id) },
      search: { size, url: img.largeImageURL },
    });
  }

  function close() {
    if (window.history.length > 1) window.history.back();
    else navigate({ to: "/" });
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

  // Lock scroll while modal-style preview is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const tagList = img.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background/80 backdrop-blur-xl">
      {/* Top close bar */}
      <div className="sticky top-0 z-10 flex justify-end p-3">
        <button
          onClick={close}
          aria-label="Close"
          className="glass grid h-11 w-11 place-items-center rounded-full shadow-glow transition hover:scale-105"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <main className="mx-auto max-w-4xl px-4 pb-32">
        {/* Hero image card */}
        <div className="glass mx-auto overflow-hidden rounded-3xl p-2 shadow-glow">
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img
              src={img.largeImageURL}
              alt={img.tags}
              className="mx-auto block max-h-[70vh] w-auto object-contain"
            />
          </div>
        </div>

        {/* Meta chips */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          {img.imageWidth >= 3840 && (
            <span className="bg-gradient-brand rounded-full px-3 py-1 text-xs font-black text-white shadow-glow">4K</span>
          )}
          <span className="glass rounded-full px-3 py-1 font-semibold">
            {img.imageWidth} × {img.imageHeight}
          </span>
          <span className="glass inline-flex items-center gap-1 rounded-full px-3 py-1">
            <Eye className="h-3.5 w-3.5" /> {formatK(img.views)}
          </span>
          <span className="glass inline-flex items-center gap-1 rounded-full px-3 py-1 text-rose-500">
            <Heart className="h-3.5 w-3.5 fill-current" /> {formatK(img.likes)}
          </span>
          <span className="glass inline-flex items-center gap-1 rounded-full px-3 py-1">
            <Download className="h-3.5 w-3.5" /> {formatK(img.downloads)}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tagList.map((t) => (
            <Link
              key={t}
              to="/search"
              search={{ q: t }}
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition hover:scale-105"
            >
              <Tag className="h-3 w-3 opacity-60" /> {t}
            </Link>
          ))}
        </div>

        {/* Author */}
        <div className="glass mt-5 flex items-center gap-3 rounded-2xl p-3">
          <div className="bg-gradient-brand grid h-11 w-11 place-items-center rounded-full text-sm font-black text-white">
            {img.user.slice(0, 1).toUpperCase()}
          </div>
          <div className="leading-tight">
            <div className="text-xs text-muted-foreground">Photo by</div>
            <div className="text-sm font-bold">{img.user}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <button
              onClick={() => (resolutions.length > 1 ? setShowSizes((v) => !v) : download(topRes.label))}
              className="bg-gradient-brand inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold text-white shadow-glow transition active:scale-[0.98]"
            >
              <Download className="h-5 w-5" /> Download
              {resolutions.length > 1 && <ChevronDown className="h-4 w-4 opacity-80" />}
            </button>
            {showSizes && (
              <div className="glass absolute left-0 right-0 top-[calc(100%+6px)] z-20 grid gap-1 rounded-2xl p-2 shadow-glow">
                {resolutions.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => { setShowSizes(false); download(r.label); }}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <span>{r.label}</span>
                    <span className="text-xs text-muted-foreground">up to {r.w}px</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={share}
            className="glass inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            onClick={copyLink}
            className="glass inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold"
          >
            <LinkIcon className="h-4 w-4" /> {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        {/* Similar */}
        <section className="mt-10 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-gradient-brand h-2 w-2 rounded-full" />
            Similar Images
          </h2>
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
      </main>
    </div>
  );
}

function formatK(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
