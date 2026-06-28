import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Grid3x3, Flame } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/categories", icon: Grid3x3, label: "Categories" },
  { to: "/trending", icon: Flame, label: "Trending" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 md:hidden">
      <div className="glass mx-auto flex max-w-md items-center justify-around rounded-full p-1.5 shadow-glow">
        {items.map(({ to, icon: Icon, label }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-2 transition"
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--gradient-brand)", opacity: 0.18 }}
                />
              )}
              <Icon
                className={`relative h-5 w-5 transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`relative text-[10px] font-medium ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
