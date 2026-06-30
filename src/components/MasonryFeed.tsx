import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, Fragment } from "react";
import { searchImages, type SearchParams } from "@/lib/pixabay";
import { ImageCard, ImageCardSkeleton } from "./ImageCard";
import { NativeAdSlot } from "./NativeAdSlot";

interface Props extends Omit<SearchParams, "page"> {
  keyPrefix: string;
}

export function MasonryFeed(props: Props) {
  const { keyPrefix, ...params } = props;

  const query = useInfiniteQuery({
    queryKey: [keyPrefix, params],
    queryFn: ({ pageParam = 1 }) =>
      searchImages({ ...params, page: pageParam, perPage: 24 }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => {
      const loaded = all.reduce((s, p) => s + p.hits.length, 0);
      return loaded < last.totalHits && last.hits.length > 0 ? all.length + 1 : undefined;
    },
  });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    }, { rootMargin: "600px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [query]);

  const images = query.data?.pages.flatMap((p) => p.hits) || [];

  if (query.isLoading) {
    return (
      <div className="masonry">
        {Array.from({ length: 12 }).map((_, i) => (
          <ImageCardSkeleton key={i} height={180 + ((i * 47) % 200)} />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm">
        Failed to load images. Check your API key in Admin settings.
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No images found. Try a different search.
      </div>
    );
  }

  return (
    <>
      <div className="masonry">
        {images.map((img, i) => (
          <Fragment key={img.id}>
            <ImageCard img={img} />
            {i > 0 && i % 8 === 7 && <NativeAdSlot index={i} />}
          </Fragment>
        ))}
      </div>
      <div ref={sentinel} className="h-10" />
      {query.isFetchingNextPage && (
        <div className="mt-4 masonry">
          {Array.from({ length: 6 }).map((_, i) => (
            <ImageCardSkeleton key={i} height={180 + ((i * 47) % 200)} />
          ))}
        </div>
      )}
    </>
  );
}
