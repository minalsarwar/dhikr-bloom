import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 p-3 rounded-2xl glass-strong border border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100 text-amber-500"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100 text-primary"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}