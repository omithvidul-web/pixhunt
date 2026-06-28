import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { searchImages } from "@/lib/pixabay";

export function HorizontalImageRail({
  title,
  icon,
  query,
  category,
  seeMoreTo,
}: {
  title: string;
  icon?: React.ReactNode;
  query?: string;
  category?: string;
  seeMoreTo?: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["rail", query, category],
    queryFn: () => searchImages({ q: query, category, perPage: 12, order: "popular" }),
    staleTime: 5 * 60_000,
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-4">
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          {icon}
          {title}
        </h2>
        {seeMoreTo && (
          <Link to="/search" search={{ q: query }} className="text-sm text-primary">
            See more ›
          </Link>
        )}
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-56 w-40 shrink-0 rounded-2xl sm:w-48" />
            ))
          : data?.hits.map((img) => (
              <Link
                key={img.id}
                to="/image/$id"
                params={{ id: String(img.id) }}
                className="group relative h-56 w-40 shrink-0 overflow-hidden rounded-2xl bg-muted sm:w-48"
              >
                <img
                  src={img.webformatURL}
                  alt={img.tags}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                {img.imageWidth >= 3840 && (
                  <span className="glass absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold">
                    4K
                  </span>
                )}
              </Link>
            ))}
      </div>
    </section>
  );
}
