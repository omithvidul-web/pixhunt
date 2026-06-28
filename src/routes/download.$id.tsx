import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Download, ShieldCheck } from "lucide-react";
import { getActiveAdsterra, getDownloadTimer } from "@/lib/settings";
import { trackDownload } from "@/lib/analytics";

const schema = z.object({
  size: fallback(z.string(), "HD").default("HD"),
  url: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/download/$id")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Preparing Download — PixHunt" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { id } = Route.useParams();
  const { size, url } = Route.useSearch();
  const [remaining, setRemaining] = useState(getDownloadTimer());
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ads = getActiveAdsterra();
    if (ads) {
      try { window.open(ads, "_blank", "noopener,noreferrer"); } catch {}
    }
  }, []);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  useEffect(() => {
    if (remaining === 0 && !done && url) {
      setDone(true);
      trackDownload();
      // trigger download
      (async () => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const ext = url.split(".").pop()?.split("?")[0] || "jpg";
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `pixhunt-${id}-${size}.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch {
          window.open(url, "_blank");
        }
      })();
    }
  }, [remaining, done, url, id, size]);

  const total = getDownloadTimer();
  const pct = ((total - remaining) / total) * 100;

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 pb-10 pt-4">
      <div className="glass w-full max-w-md rounded-3xl p-8 text-center shadow-glow">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-brand shadow-glow">
          <Download className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Preparing your {size} download</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your download will start automatically. Please wait a few seconds.
        </p>

        <div className="relative my-8 grid place-items-center">
          <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
            <circle cx="50" cy="50" r="45" stroke="var(--muted)" strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r="45"
              stroke="url(#g)" strokeWidth="8" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${pct * 2.827} 282.7`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-3xl font-black">
            {done ? "✓" : remaining}
          </div>
        </div>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          Secure download via PixHunt
        </p>

        {done && (
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-brand mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
          >
            <Download className="h-4 w-4" /> Download didn't start? Click here
          </a>
        )}
      </div>
    </main>
  );
}
