import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { X, Home, Info, Mail, Shield, FileText } from "lucide-react";
import { Logo } from "./Logo";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/about", icon: Info, label: "About" },
  { to: "/contact", icon: Mail, label: "Contact" },
  { to: "/privacy", icon: Shield, label: "Privacy Policy" },
  { to: "/terms", icon: FileText, label: "Terms of Service" },
] as const;

export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`fixed left-0 top-0 z-[61] h-full w-[84%] max-w-sm transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass flex h-full flex-col rounded-r-3xl border-r border-white/10 p-5 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <Logo size={40} />
              <span className="font-display text-lg font-bold">
                <span className="text-gradient-brand">Pix</span>Hunt
              </span>
            </Link>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-background/60 transition hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition hover:bg-white/10 active:scale-[0.98]"
                activeProps={{ className: "bg-white/10 text-primary" }}
                activeOptions={{ exact: to === "/" }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-background/60 transition group-hover:scale-110">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 text-xs text-muted-foreground">
            <p>© 2026 PixHunt</p>
            <p>Images by Pixabay</p>
          </div>
        </div>
      </aside>
    </>
  );
}
