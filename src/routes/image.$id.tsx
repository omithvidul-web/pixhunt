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
  const likeKey = `pixhunt_like_${id}`;
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") setLiked(localStorage.getItem(likeKey) === "1");
  }, [likeKey]);
  const toggleLike = () => {
    setLiked((v) => {
      const next = !v;
      try {
        if (next) localStorage.setItem(likeKey, "1");
        else localStorage.removeItem(likeKey);
      } catch {}
      return next;
    });
  };

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

  const [shareOpen, setShareOpen] = useState(false);
  async function share() {
    const url = window.location.href;
    const title = "PixHunt Image";
    // Web Share API is often blocked in iframes/previews — try it, but always
    // fall back to our own share sheet so users can still share.
    if (typeof navigator !== "undefined" && (navigator as any).share && (navigator as any).canShare?.({ url })) {
      try {
        await (navigator as any).share({ title, url });
        return;
      } catch (e: any) {
        if (e?.name === "AbortError") return;
      }
    }
    setShareOpen(true);
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
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? "Unlike" : "Like"}
            className={`glass inline-flex items-center gap-1 rounded-full px-3 py-1 transition active:scale-95 ${liked ? "text-rose-500" : "hover:text-rose-500"}`}
          >
            <Heart className={`h-3.5 w-3.5 transition ${liked ? "fill-current scale-110" : ""}`} />
            {formatK(img.likes + (liked ? 1 : 0))}
          </button>
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
          {img.userImageURL ? (
            <img
              src={img.userImageURL}
              alt={img.user}
              loading="lazy"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40"
            />
          ) : (
            <div className="bg-gradient-brand grid h-11 w-11 place-items-center rounded-full text-sm font-black text-white ring-2 ring-primary/40">
              {img.user.slice(0, 1).toUpperCase()}
            </div>
          )}
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

      {shareOpen && (
        <ShareSheet
          url={typeof window !== "undefined" ? window.location.href : ""}
          title="Check out this image on PixHunt"
          onClose={() => setShareOpen(false)}
          onCopy={copyLink}
          copied={copied}
        />
      )}
    </div>
  );
}

function ShareSheet({ url, title, onClose, onCopy, copied }: {
  url: string; title: string; onClose: () => void; onCopy: () => void; copied: boolean;
}) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const targets = [
    { name: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "Telegram", color: "#229ED9", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: "X", color: "#000000", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: "Facebook", color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "Reddit", color: "#FF4500", href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
    { name: "Pinterest", color: "#E60023", href: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}` },
    { name: "Email", color: "#6B7280", href: `mailto:?subject=${t}&body=${u}` },
  ];
  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-md rounded-t-3xl p-5 shadow-glow sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted-foreground/30 sm:hidden" />
        <h3 className="mb-4 text-center text-lg font-black">Share image</h3>
        <div className="grid grid-cols-4 gap-3">
          {targets.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-2xl p-2 transition active:scale-95"
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-full text-base font-black text-white shadow-md"
                style={{ background: s.color }}
              >
                {s.name.slice(0, 1)}
              </span>
              <span className="text-[11px] font-semibold">{s.name}</span>
            </a>
          ))}
          <button
            onClick={onCopy}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-2 transition active:scale-95"
          >
            <span className="bg-gradient-brand grid h-12 w-12 place-items-center rounded-full text-white shadow-glow">
              🔗
            </span>
            <span className="text-[11px] font-semibold">{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="glass mt-5 w-full rounded-2xl py-3 text-sm font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function formatK(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
