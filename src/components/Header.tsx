import { useNavigate } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { SideMenu } from "./SideMenu";
import { ADMIN_CODE, loginAdmin } from "@/lib/settings";
import { trackSearch } from "@/lib/analytics";

export function Header() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    if (v === ADMIN_CODE) {
      loginAdmin();
      setQ("");
      navigate({ to: "/admin" });
      return;
    }
    trackSearch(v);
    setQ("");
    navigate({ to: "/search", search: { q: v } });
  }

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 pb-2 sm:px-6 sm:pt-4">
        <div className="glass mx-auto flex max-w-6xl items-center gap-2 rounded-full p-2 shadow-sm sm:gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background/60 transition hover:scale-105 hover:shadow-glow active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            aria-label="PixHunt home"
            className="shrink-0"
          >
            <Logo size={36} />
          </button>
          <form onSubmit={onSubmit} className="min-w-0 flex-1">
            <div className="flex items-center gap-2 rounded-full bg-background/60 px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search images..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search images"
              />
            </div>
          </form>
          <ThemeToggle />
        </div>
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
