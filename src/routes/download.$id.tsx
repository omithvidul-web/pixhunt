import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Download, ShieldCheck, X, Zap } from "lucide-react";
import { getActiveAdsterra, getDownloadTimer } from "@/lib/settings";
import { trackDownload } from "@/lib/analytics";
import { getImageById } from "@/lib/pixabay";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { isAndroidApp, bridge, onReward } from "@/lib/admob";

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

async function triggerBlobDownload(url: string, filename: string) {
  const res = await fetch(url, { mode: "cors", credentials: "omit" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objUrl), 4000);
}

function DownloadPage() {
  const { id } = Route.useParams();
  const { size, url } = Route.useSearch();
  const navigate = useNavigate();
  const total = getDownloadTimer();
  const [remaining, setRemaining] = useState(total);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const adsOpened = useRef(false);

  const { data: img } = useQuery({
    queryKey: ["image", id],
    queryFn: () => getImageById(id),
  });

  const ext = (url.split("?")[0].split(".").pop() || "jpg").toLowerCase();
  const filename = `pixhunt-${id}-${size}.${ext}`;

  const inApp = isAndroidApp();

  // Open Adsterra once — WEB ONLY. In the Android app we show an Interstitial instead.
  useEffect(() => {
    if (adsOpened.current) return;
    adsOpened.current = true;
    if (inApp) {
      bridge().showInterstitial();
      return;
    }
    const ads = getActiveAdsterra();
    if (ads) {
      try { window.open(ads, "_blank", "noopener,noreferrer"); } catch {}
    }
  }, [inApp]);

  // Reward unlock listener (Android only)
  useEffect(() => {
    if (!inApp) return;
    return onReward("download:" + id, () => {
      // Reward earned — finish immediately.
      setRemaining(0);
      setReady(true);
    });
  }, [inApp, id]);

  // Countdown
  useEffect(() => {
    if (ready) return;
    if (remaining <= 0) { setReady(true); return; }
    const t = setTimeout(() => setRemaining((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, ready]);

  const startDownload = async () => {
    setError(null);
    trackDownload();
    if (inApp) {
      // Hand off to the native side so it can save with the Download Manager.
      bridge().triggerDownload(url, filename);
      return;
    }
    try {
      await triggerBlobDownload(url, filename);
    } catch (e: any) {
      setError(e?.message || "Download failed");
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const unlockHighSpeed = () => {
    if (!inApp) return;
    bridge().showRewarded("download:" + id);
  };

  const unlockPremium = () => {
    if (!inApp) return;
    bridge().showRewardedInterstitial("download:" + id);
  };

  const close = () => {
    if (window.history.length > 1) window.history.back();
    else navigate({ to: "/" });
  };

  const pct = Math.min(100, ((total - remaining) / total) * 100);
  const thumb = img?.webformatURL || url;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background/95 backdrop-blur-xl">
      {/* Close */}
      <div className="sticky top-0 z-10 flex justify-end p-3">
        <button
          onClick={close}
          aria-label="Close"
          className="glass grid h-11 w-11 place-items-center rounded-full shadow-glow"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <main className="mx-auto flex max-w-md flex-col items-center px-6 pb-20 pt-2 text-center">
        <Logo size={64} glow />

        {/* Thumbnail */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-muted shadow-glow">
          {thumb ? (
            <img src={thumb} alt="" className="h-48 w-48 object-cover" />
          ) : (
            <div className="skeleton h-48 w-48" />
          )}
        </div>

        {!ready && inApp && (
          <div className="mt-6 grid w-full grid-cols-2 gap-2">
            <button
              onClick={unlockHighSpeed}
              className="glass flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
            >
              <Zap className="h-4 w-4 text-primary" /> Skip with Ad
            </button>
            <button
              onClick={unlockPremium}
              className="glass flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
            >
              <Zap className="h-4 w-4 text-primary" /> Premium Unlock
            </button>
          </div>
        )}

          <>
            <h1 className="mt-8 flex items-center justify-center gap-2 text-2xl font-black">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Secure Verification
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Preparing your {size} download… Please wait.
            </p>

            {/* Linear progress */}
            <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="bg-gradient-brand h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-4 text-4xl font-black tabular-nums">
              {remaining}<span className="text-muted-foreground">s</span>
            </div>

            <div className="glass mt-8 rounded-full px-4 py-2 text-xs font-semibold">
              {size}
              {img && <> • {img.imageWidth}×{img.imageHeight} • by {img.user}</>}
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-8 flex items-center justify-center gap-2 text-2xl font-black">
              <Download className="h-6 w-6 text-primary" />
              Ready to Download!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Click below to save your {size} image.
            </p>

            <button
              onClick={startDownload}
              className="bg-gradient-brand mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-bold text-white shadow-glow transition active:scale-[0.98]"
            >
              <Download className="h-5 w-5" /> Download Now
            </button>

            {error && (
              <p className="mt-3 text-xs text-muted-foreground">
                Auto-download blocked. Opened image in a new tab — long-press to save.
              </p>
            )}

            <div className="glass mt-6 rounded-full px-4 py-2 text-xs font-semibold">
              {size}
              {img && <> • {img.imageWidth}×{img.imageHeight} • by {img.user}</>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
