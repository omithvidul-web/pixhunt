// Admin-managed settings persisted to localStorage.

export interface AdsterraLink {
  id: string;
  label: string;
  url: string;
  active: boolean;
}

const ADS_KEY = "pixhunt_adsterra_links";
const TIMER_KEY = "pixhunt_download_timer";
const ADMIN_KEY = "pixhunt_admin_session";

export function getAdsterraLinks(): AdsterraLink[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ADS_KEY) || "[]");
  } catch { return []; }
}

export function saveAdsterraLinks(links: AdsterraLink[]) {
  localStorage.setItem(ADS_KEY, JSON.stringify(links));
}

export function getActiveAdsterra(): string | null {
  const links = getAdsterraLinks();
  return links.find((l) => l.active)?.url || null;
}

export function getDownloadTimer(): number {
  if (typeof window === "undefined") return 7;
  const v = Number(localStorage.getItem(TIMER_KEY));
  return v >= 5 && v <= 10 ? v : 7;
}

export function setDownloadTimer(v: number) {
  localStorage.setItem(TIMER_KEY, String(v));
}

export const ADMIN_CODE = "Admin@Omith*666";

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "1";
}

export function loginAdmin() {
  sessionStorage.setItem(ADMIN_KEY, "1");
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_KEY);
}
