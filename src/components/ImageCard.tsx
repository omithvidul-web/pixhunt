import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { PixabayImage } from "@/lib/pixabay";

export function ImageCard({ img }: { img: PixabayImage }) {
  const [loaded, setLoaded] = useState(false);
  const ratio = img.previewHeight / img.previewWidth;

  return (
    <Link
      to="/image/$id"
      params={{ id: String(img.id) }}
      className="group relative block overflow-hidden rounded-2xl bg-muted"
    >
      <div style={{ paddingBottom: `${ratio * 100}%` }} />
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={img.webformatURL}
        alt={img.tags}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      {img.imageWidth >= 3840 && (
        <span className="glass absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-foreground">
          4K
        </span>
      )}
    </Link>
  );
}

export function ImageCardSkeleton({ height = 220 }: { height?: number }) {
  return <div className="skeleton rounded-2xl" style={{ height }} />;
}
