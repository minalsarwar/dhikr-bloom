import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";

export type ColorTheme = "lavender" | "pink" | "blue" | "green" | "red" | "gold";

interface ThemeSelectorProps {
  theme: ColorTheme;
  onChange: (theme: ColorTheme) => void;
}

const THEMES: { id: ColorTheme; name: string; colors: string[] }[] = [
  { id: "lavender", name: "Lavender", colors: ["#a78bfa", "#c4b5fd", "#8b5cf6"] },
  { id: "pink", name: "Rose", colors: ["#f472b6", "#fb7185", "#ec4899"] },
  { id: "blue", name: "Ocean", colors: ["#60a5fa", "#38bdf8", "#3b82f6"] },
  { id: "green", name: "Emerald", colors: ["#34d399", "#4ade80", "#10b981"] },
  { id: "red", name: "Ruby", colors: ["#f87171", "#fb923c", "#ef4444"] },
  { id: "gold", name: "Gold", colors: ["#fbbf24", "#f59e0b", "#d97706"] },
];

export function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl glass-strong border border-border/50 hover:border-primary/50 transition-all duration-300 group flex items-center gap-2"
        aria-label="Select color theme"
      >
        <Palette className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <div className="flex -space-x-1">
          {currentTheme.colors.map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border-2 border-background"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-full mt-2 glass-strong rounded-2xl border border-border/50 p-3 z-50 transition-all duration-300 origin-top-right min-w-[180px] ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <p className="text-xs text-muted-foreground mb-3 font-medium">Color Theme</p>
        <div className="space-y-1">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onChange(t.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                theme === t.id
                  ? "bg-primary/15 text-primary"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex -space-x-1">
                {t.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium flex-1 text-left">{t.name}</span>
              {theme === t.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
