// AdMob IDs (managed by admin) + web/app detection + JS bridge.
// IDs are stored in localStorage for the admin panel and exported to
// /public/admob-config.json which the Android app fetches at startup.

export type AdMobIds = {
  publisherId: string;
  appId: string;
  appOpen: string;
  banner: string;
  interstitial: string;
  rewarded: string;
  rewardedInterstitial: string;
  nativeAdvanced: string;
};

export const ADMOB_FIELDS: { key: keyof AdMobIds; label: string }[] = [
  { key: "publisherId", label: "AdMob Publisher ID (pub-XXXX...)" },
  { key: "appId", label: "AdMob App ID (ca-app-pub-.../~...)" },
  { key: "appOpen", label: "App Open Ad Unit ID" },
  { key: "banner", label: "Banner Ad Unit ID" },
  { key: "interstitial", label: "Interstitial Ad Unit ID" },
  { key: "rewarded", label: "Rewarded Ad Unit ID" },
  { key: "rewardedInterstitial", label: "Rewarded Interstitial Ad Unit ID" },
  { key: "nativeAdvanced", label: "Native Advanced Ad Unit ID" },
];

// Google official test IDs (safe defaults).
export const DEFAULT_ADMOB: AdMobIds = {
  publisherId: "pub-0000000000000000",
  appId: "ca-app-pub-3940256099942544~3347511713",
  appOpen: "ca-app-pub-3940256099942544/9257395921",
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
  rewardedInterstitial: "ca-app-pub-3940256099942544/5354046379",
  nativeAdvanced: "ca-app-pub-3940256099942544/2247696110",
};

const KEY = "pixhunt_admob_ids";

export function getAdMobIds(): AdMobIds {
  if (typeof window === "undefined") return DEFAULT_ADMOB;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_ADMOB;
    return { ...DEFAULT_ADMOB, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMOB;
  }
}

export function saveAdMobIds(ids: AdMobIds) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function exportAdMobConfig(ids: AdMobIds) {
  const blob = new Blob([JSON.stringify(ids, null, 2)], {
    type: "application/json",
  });
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = "admob-config.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 2000);
}

// ---------- Web vs Android WebView detection ----------

export function isAndroidApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Custom UA token injected by the Android WebView wrapper.
  return /MyAndroidApp/i.test(ua) || typeof (window as any).AndroidAds !== "undefined";
}

// ---------- JS ↔ Android bridge ----------

type Bridge = {
  showInterstitial: () => void;
  showRewarded: (rewardKey?: string) => void;
  showRewardedInterstitial: (rewardKey?: string) => void;
  showBanner: () => void;
  hideBanner: () => void;
  loadNative: (slotId: string) => void;
  triggerDownload: (url: string, filename: string) => void;
};

function noopBridge(): Bridge {
  const log = (m: string) => () => console.info("[AdsBridge:web] " + m);
  return {
    showInterstitial: log("interstitial"),
    showRewarded: log("rewarded"),
    showRewardedInterstitial: log("rewarded-interstitial"),
    showBanner: log("banner"),
    hideBanner: log("hide-banner"),
    loadNative: log("native"),
    triggerDownload: log("download"),
  };
}

export function bridge(): Bridge {
  if (typeof window === "undefined") return noopBridge();
  const b = (window as any).AndroidAds;
  if (!b) return noopBridge();
  return {
    showInterstitial: () => b.showInterstitial?.(),
    showRewarded: (k?: string) => b.showRewarded?.(k ?? ""),
    showRewardedInterstitial: (k?: string) => b.showRewardedInterstitial?.(k ?? ""),
    showBanner: () => b.showBanner?.(),
    hideBanner: () => b.hideBanner?.(),
    loadNative: (slotId: string) => b.loadNative?.(slotId),
    triggerDownload: (url: string, filename: string) => b.triggerDownload?.(url, filename),
  };
}

// Listen for reward callbacks from the native side.
// Android calls: window.dispatchEvent(new CustomEvent('admob:reward', {detail:{key}}))
export function onReward(key: string, cb: () => void): () => void {
  const handler = (e: Event) => {
    const d = (e as CustomEvent).detail;
    if (!d || d.key === key || d.key === "") cb();
  };
  window.addEventListener("admob:reward", handler as EventListener);
  return () => window.removeEventListener("admob:reward", handler as EventListener);
}
