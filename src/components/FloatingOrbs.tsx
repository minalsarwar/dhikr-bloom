import { ColorTheme } from "./ThemeSelector";

interface FloatingOrbsProps {
  colorTheme: ColorTheme;
}

// Theme-based orb colors
const ORB_COLORS: Record<ColorTheme, { primary: string; secondary: string; accent: string }> = {
  lavender: { primary: "from-violet-400 to-purple-500", secondary: "from-purple-300 to-violet-400", accent: "from-fuchsia-300 to-purple-400" },
  pink: { primary: "from-pink-400 to-rose-500", secondary: "from-rose-300 to-pink-400", accent: "from-pink-300 to-red-400" },
  blue: { primary: "from-blue-400 to-cyan-500", secondary: "from-sky-300 to-blue-400", accent: "from-cyan-300 to-blue-400" },
  green: { primary: "from-emerald-400 to-teal-500", secondary: "from-green-300 to-emerald-400", accent: "from-teal-300 to-green-400" },
  red: { primary: "from-red-400 to-orange-500", secondary: "from-rose-300 to-red-400", accent: "from-orange-300 to-red-400" },
  gold: { primary: "from-amber-400 to-yellow-500", secondary: "from-yellow-300 to-amber-400", accent: "from-orange-300 to-amber-400" },
};

export function FloatingOrbs({ colorTheme }: FloatingOrbsProps) {
  const colors = ORB_COLORS[colorTheme];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary Orb */}
      <div
        className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${colors.primary} opacity-20 blur-2xl animate-float`}
        style={{
          top: "10%",
          right: "15%",
          animationDuration: "8s",
        }}
      />

      {/* Secondary Orb */}
      <div
        className={`absolute w-40 h-40 rounded-full bg-gradient-to-br ${colors.secondary} opacity-15 blur-2xl animate-float`}
        style={{
          bottom: "20%",
          left: "10%",
          animationDuration: "10s",
          animationDelay: "-3s",
        }}
      />

      {/* Accent Orb */}
      <div
        className={`absolute w-28 h-28 rounded-full bg-gradient-to-br ${colors.accent} opacity-20 blur-xl animate-float`}
        style={{
          top: "50%",
          left: "20%",
          animationDuration: "6s",
          animationDelay: "-1s",
        }}
      />

      {/* Subtle Orb */}
      <div
        className="absolute w-36 h-36 rounded-full bg-primary/15 blur-2xl animate-glow-pulse"
        style={{
          bottom: "30%",
          right: "20%",
          animationDuration: "4s",
        }}
      />

      {/* Rotating Ring */}
      <div
        className="absolute w-80 h-80 rounded-full border border-primary/10 animate-spin-slow"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Second Ring */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full border border-secondary/5 animate-spin-slow"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animationDirection: "reverse",
          animationDuration: "30s",
        }}
      />
    </div>
  );
}
