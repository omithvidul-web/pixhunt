import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitial(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("pixhunt_theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("pixhunt_theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:scale-105"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
