# PixHunt — Build Plan

A premium, mobile-first image search & downloader styled to match the neon blue→purple logo, built on the existing TanStack Start + Tailwind v4 stack (the brief says "html/java/css" but the project is already React/TS — I'll keep the modern stack for performance, SEO, and routing).

## Design language
- Dark-first theme matching the logo: deep navy base (`#0a0a1a` / `#0f0f23`), with electric blue `#3b82f6` → violet `#8b5cf6` → magenta `#d946ef` gradient accents.
- Light mode mirrors screenshot 2 (soft white/lavender wash, same gradient accents).
- Glassmorphism: blurred translucent header, bottom nav, cards, chips.
- Rounded-2xl/3xl corners, soft glow shadows, subtle hover/scale + fade-in animations (Framer Motion).
- Typography: Space Grotesk (display) + Inter (body) via `<link>` in `__root.tsx`.
- Logo used in sticky header (small) and hero (large with glow).

## Routes (file-based, TanStack Router)
```
/                 Home (hero, trending searches, categories carousel, trending today, popular wallpapers, recommended masonry)
/search           Search results (?q=, ?cat=) with filter chips, Popular/Latest toggle, masonry grid, infinite scroll
/categories       All categories grid (2-col mobile)
/category/$slug   Category results (reuses search results layout)
/trending         Trending images feed
/image/$id        Image preview (large, resolution, tags, similar, share/copy/download)
/download/$id     Secure download landing (5–10s timer, auto-download)
/admin            Hidden dashboard (only reachable via secret search code)
```
Each route gets unique `head()` metadata (title, description, og:*). Root sets favicon + fonts only.

## Core features
- **Pixabay client** (`src/lib/pixabay.ts`): typed `searchImages({q, category, page, order})`, with API key read from `localStorage.pixhunt_api_key` (falls back to baked-in `55910754-d344d38f2cfadf8a607b49d7e`). Admin can override.
- **TanStack Query** for fetching, caching, infinite scroll (`useInfiniteQuery` + IntersectionObserver sentinel).
- **Masonry grid**: CSS columns layout (1/2/3/4 cols responsive), lazy `<img loading="lazy">`, skeleton shimmer placeholders.
- **Carousels**: horizontal scroll-snap (CSS) — no heavy library.
- **Theme toggle**: class-based `dark`, persisted in localStorage, default = dark.
- **Bottom nav** (mobile only, hidden ≥md): Home / Search / Categories / Trending, glass blur, active tab pill highlight with gradient.
- **Sticky header**: logo (links home), rounded search input, theme toggle. Search submits → `/search?q=`.

## Image preview & download flow
- `/image/$id`: loader fetches by ID from Pixabay (`?id=`), shows hero image, resolution chips (Preview/HD/FullHD/2K/4K based on available sizes), tag chips, similar images (query by first tag), Share (Web Share API w/ clipboard fallback), Copy Link, Download (per-size buttons).
- Download click → navigate to `/download/$id?size=...&url=...`:
  1. Open Adsterra direct link in new tab (`window.open(adsterraUrl, '_blank')`).
  2. Show 5–10s countdown (configurable via admin, default 7s) with progress ring.
  3. On finish, fetch image as blob and trigger `<a download>` with proper extension (jpg/png/webp inferred from URL).
- Adsterra URL stored in localStorage (admin-managed); placeholder `https://example.com` until set.

## Hidden admin
- `Header` search submit handler checks: if `query.trim() === 'Admin@Omith*666'` → set `sessionStorage.pixhunt_admin = '1'` and `navigate('/admin')`. Input cleared, no visible hint.
- `/admin` guard: if no session flag → redirect to `/`.
- Dashboard tabs (all client-side, localStorage-backed):
  - **Overview**: total searches, total downloads, charts (Recharts: line for searches/day, bar for top categories).
  - **Trending keywords**: list with counts, clear button.
  - **Adsterra links**: CRUD list, mark one active.
  - **Download timer**: slider 5–10s.
  - **Pixabay API key**: input + save + test button.
  - **Homepage categories**: reorder/enable/disable + add custom.
- Analytics tracking: `trackSearch(q)` and `trackDownload(id, category)` write to localStorage counters; dashboard reads them.

## Categories
Nature, Anime, Cars, 4K Wallpapers, Technology, Gaming, Fashion, Art, Photography, Animals, Aesthetic — each mapped to a Pixabay query + a representative cover image (fetched live on first load, cached).

## SEO & performance
- Per-route `head()` with title/description/og.
- Semantic HTML, single H1 per page, alt text from Pixabay tags.
- Lazy images, `decoding="async"`, skeleton loaders, IntersectionObserver infinite scroll.
- Code-split routes (TanStack default).

## Excluded (per brief)
No login/register, accounts, favorites, history of any kind.

## Tech notes (technical section)
- Stack stays TanStack Start v1 + React 19 + Tailwind v4 + shadcn — no Lovable Cloud needed (Pixabay key is public-tier and stored client-side as requested).
- New deps: `framer-motion`, `recharts` (`bun add`).
- Logo: copy `user-uploads://Screenshot_20260623_155101.jpg` → `src/assets/pixhunt-logo.jpg`, import in header/hero.
- Design tokens added to `src/styles.css`: `--brand-blue`, `--brand-violet`, `--brand-magenta`, `--gradient-brand`, `--shadow-glow`, glass utility via `@utility glass`.

## Open question
The Adsterra Direct Link wasn't provided. I'll ship with a configurable placeholder and a clear admin field; you can paste your real link in Admin → Adsterra Links after first build. Confirm or share the link now and I'll preset it.
