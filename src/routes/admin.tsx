import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { LogOut, Plus, Trash2, Check } from "lucide-react";
import {
  getAdsterraLinks, saveAdsterraLinks, getDownloadTimer, setDownloadTimer,
  isAdmin, logoutAdmin, type AdsterraLink,
} from "@/lib/settings";
import {
  getSearchSeries, getDownloadSeries, getKeywords, getCategoryHits,
  totalDownloads, totalSearches, resetAnalytics,
} from "@/lib/analytics";
import { CATEGORIES } from "@/lib/categories";
import {
  ADMOB_FIELDS, getAdMobIds, saveAdMobIds, exportAdMobConfig, type AdMobIds,
} from "@/lib/admob";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PixHunt" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-black text-gradient-brand">{value}</div>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"overview" | "ads" | "admob" | "settings">("overview");

  useEffect(() => {
    if (!isAdmin()) { navigate({ to: "/" }); return; }
    setReady(true);
  }, [navigate]);

  if (!ready) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "ads", label: "Adsterra Links" },
    { id: "admob", label: "Manage AdMob IDs" },
    { id: "settings", label: "Settings" },
  ] as const;

  return (
    <main className="space-y-6 px-4 pb-10 pt-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gradient-brand">Admin Dashboard</h1>
        <button
          onClick={() => { logoutAdmin(); navigate({ to: "/" }); }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t.id ? "bg-gradient-brand text-white" : "glass"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "ads" && <AdsTab />}
      {tab === "admob" && <AdMobTab />}
      {tab === "settings" && <SettingsTab />}
    </main>
  );
}

function AdMobTab() {
  const [ids, setIds] = useState<AdMobIds>(getAdMobIds());
  const [saved, setSaved] = useState(false);

  function update<K extends keyof AdMobIds>(k: K, v: string) {
    setIds((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }
  function save() {
    saveAdMobIds(ids);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 text-sm text-muted-foreground">
        These IDs are saved locally and exported to{" "}
        <code className="rounded bg-background/60 px-1.5 py-0.5">admob-config.json</code>.
        Replace the file in <code>public/</code> and redeploy so the Android app fetches the new values at startup.
      </div>

      <div className="glass space-y-3 rounded-2xl p-4">
        <h3 className="font-bold">AdMob IDs</h3>
        <div className="grid gap-3">
          {ADMOB_FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">{f.label}</span>
              <input
                value={ids[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="w-full rounded-full bg-background/60 px-4 py-2 font-mono text-xs outline-none"
                placeholder={f.label}
                spellCheck={false}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={save}
            className="bg-gradient-brand rounded-full px-4 py-2 text-sm font-bold text-white"
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
          <button
            onClick={() => exportAdMobConfig(ids)}
            className="glass rounded-full px-4 py-2 text-sm font-medium"
          >
            Export admob-config.json
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const searches = getSearchSeries();
  const downloads = getDownloadSeries();
  const keywords = getKeywords();
  const categoryHits = getCategoryHits();

  const topKeywords = useMemo(
    () => Object.entries(keywords).sort((a, b) => b[1] - a[1]).slice(0, 10),
    [keywords]
  );
  const topCats = useMemo(
    () => Object.entries(categoryHits)
      .map(([slug, count]) => ({ name: CATEGORIES.find((c) => c.slug === slug)?.name || slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    [categoryHits]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Searches" value={totalSearches()} />
        <StatCard label="Total Downloads" value={totalDownloads()} />
        <StatCard label="Unique Keywords" value={Object.keys(keywords).length} />
        <StatCard label="Active Categories" value={Object.keys(categoryHits).length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 font-bold">Searches (last 30 days)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={searches}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 font-bold">Downloads (last 30 days)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={downloads}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#d946ef" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 font-bold">Trending Keywords</h3>
          {topKeywords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {topKeywords.map(([k, c]) => (
                <li key={k} className="flex justify-between">
                  <span className="truncate">{k}</span>
                  <span className="font-semibold text-primary">{c}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 font-bold">Popular Categories</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={topCats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <button
        onClick={() => { if (confirm("Reset all analytics?")) { resetAnalytics(); location.reload(); } }}
        className="text-xs text-destructive underline"
      >
        Reset analytics
      </button>
    </div>
  );
}

function AdsTab() {
  const [links, setLinks] = useState<AdsterraLink[]>([]);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => { setLinks(getAdsterraLinks()); }, []);

  function add() {
    if (!url.trim()) return;
    const next = [...links, {
      id: crypto.randomUUID(),
      label: label.trim() || "Adsterra",
      url: url.trim(),
      active: links.length === 0,
    }];
    setLinks(next); saveAdsterraLinks(next); setLabel(""); setUrl("");
  }
  function remove(id: string) {
    const next = links.filter((l) => l.id !== id);
    setLinks(next); saveAdsterraLinks(next);
  }
  function activate(id: string) {
    const next = links.map((l) => ({ ...l, active: l.id === id }));
    setLinks(next); saveAdsterraLinks(next);
  }

  return (
    <div className="space-y-4">
      <div className="glass space-y-3 rounded-2xl p-4">
        <h3 className="font-bold">Add Adsterra Direct Link</h3>
        <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
          <input
            value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Main)"
            className="rounded-full bg-background/60 px-4 py-2 text-sm outline-none"
          />
          <input
            value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-full bg-background/60 px-4 py-2 text-sm outline-none"
          />
          <button onClick={add} className="bg-gradient-brand inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {links.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No links yet.</p>
        ) : links.map((l) => (
          <div key={l.id} className="glass flex items-center gap-3 rounded-2xl p-3">
            <button onClick={() => activate(l.id)} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${l.active ? "bg-gradient-brand text-white" : "border border-border"}`}>
              {l.active && <Check className="h-4 w-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{l.label}</div>
              <div className="truncate text-xs text-muted-foreground">{l.url}</div>
            </div>
            <button onClick={() => remove(l.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [timer, setTimer] = useState(getDownloadTimer());
  const [apiKey, setApiKey] = useState(() => (typeof window !== "undefined" && localStorage.getItem("pixhunt_api_key")) || "");

  return (
    <div className="space-y-4">
      <div className="glass space-y-3 rounded-2xl p-4">
        <h3 className="font-bold">Download Timer</h3>
        <div className="flex items-center gap-3">
          <input
            type="range" min={5} max={10} value={timer}
            onChange={(e) => { const v = Number(e.target.value); setTimer(v); setDownloadTimer(v); }}
            className="flex-1"
          />
          <span className="w-12 text-right font-bold">{timer}s</span>
        </div>
      </div>

      <div className="glass space-y-3 rounded-2xl p-4">
        <h3 className="font-bold">Pixabay API Key</h3>
        <input
          value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          placeholder="Your Pixabay API key"
          className="w-full rounded-full bg-background/60 px-4 py-2 text-sm outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { localStorage.setItem("pixhunt_api_key", apiKey.trim()); alert("Saved"); }}
            className="bg-gradient-brand rounded-full px-4 py-2 text-sm font-bold text-white"
          >
            Save
          </button>
          <button
            onClick={() => { localStorage.removeItem("pixhunt_api_key"); setApiKey(""); }}
            className="glass rounded-full px-4 py-2 text-sm font-medium"
          >
            Reset to default
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="mb-2 font-bold">Homepage Categories</h3>
        <p className="mb-3 text-xs text-muted-foreground">All categories are shown on the homepage carousel and on /categories. Edit src/lib/categories.ts to customize.</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span key={c.slug} className="rounded-full bg-secondary px-3 py-1 text-xs">{c.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
