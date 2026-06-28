import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/40 px-4 pb-24 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <Logo size={48} />
        <p className="text-gradient-brand text-xl font-bold tracking-tight">PixHunt</p>
        <p className="max-w-md text-sm text-muted-foreground">
          High-velocity visual hunt. Discover and download millions of premium images in HD, Full HD, 2K, and 4K.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          <Link to="/trending" className="hover:text-foreground">Trending</Link>
          <Link to="/search" className="hover:text-foreground">Search</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          Images powered by Pixabay · © {new Date().getFullYear()} PixHunt
        </p>
      </div>
    </footer>
  );
}
