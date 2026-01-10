import { useMemo } from "react";
import { ColorTheme } from "./ThemeSelector";

interface CounterRingProps {
  count: number;
  target: number;
  isAnimating: boolean;
  isComplete: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ripples: { id: number; x: number; y: number }[];
  colorTheme: ColorTheme;
}

// Theme gradient colors for the ring
const RING_GRADIENTS: Record<ColorTheme, { start: string; mid: string; end: string }> = {
  lavender: { start: "#a78bfa", mid: "#c4b5fd", end: "#8b5cf6" },
  pink: { start: "#f472b6", mid: "#fb7185", end: "#ec4899" },
  blue: { start: "#60a5fa", mid: "#38bdf8", end: "#3b82f6" },
  green: { start: "#34d399", mid: "#4ade80", end: "#10b981" },
  red: { start: "#f87171", mid: "#fca5a5", end: "#ef4444" },
  gold: { start: "#fbbf24", mid: "#fcd34d", end: "#d97706" },
};

export function CounterRing({
  count,
  target,
  isAnimating,
  isComplete,
  onClick,
  ripples,
  colorTheme,
}: CounterRingProps) {
  const progress = useMemo(() => {
    return Math.min((count / target) * 100, 100);
  }, [count, target]);

  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const gradient = RING_GRADIENTS[colorTheme];

  return (
    <button
      onClick={(e) => {
        // Calculate center of the button for ripple effect
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Create synthetic event with centered coordinates
        const syntheticEvent = {
          ...e,
          clientX: rect.left + centerX,
          clientY: rect.top + centerY,
        } as React.MouseEvent<HTMLButtonElement>;
        onClick(syntheticEvent);
      }}
      disabled={isComplete}
      className="relative group cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-95"
    >
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        isComplete 
          ? "shadow-glow bg-[hsl(var(--success)_/_0.1)]" 
          : "group-hover:shadow-glow"
      }`} />
      
      {/* Pulse Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`absolute w-48 h-48 rounded-full border-2 border-primary/20 ${isAnimating ? "animate-pulse-ring" : ""}`} />
        <div className={`absolute w-48 h-48 rounded-full border-2 border-secondary/20 ${isAnimating ? "animate-pulse-ring delay-150" : ""}`} />
      </div>

      {/* SVG Progress Ring */}
      <svg
        className="w-48 h-48 -rotate-90 drop-shadow-lg"
        viewBox="0 0 200 200"
      >
        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
          className="opacity-40"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={`progressGradient-${colorTheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="50%" stopColor={gradient.mid} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>
          <linearGradient id="completeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--success))" />
            <stop offset="100%" stopColor="hsl(160 80% 55%)" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke={isComplete ? "url(#completeGradient)" : `url(#progressGradient-${colorTheme})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          filter="url(#glow)"
        />
      </svg>

      {/* Inner Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-36 h-36 rounded-full glass-strong flex items-center justify-center transition-all duration-300 ${
          isComplete ? "border-2 border-[hsl(var(--success))]" : "border border-border/50"
        }`}>
          {/* Count Display */}
          <div className="text-center">
            <span
              className={`block text-4xl font-bold transition-all duration-300 ${
                isAnimating ? "animate-count-up" : ""
              } ${isComplete ? "text-[hsl(var(--success))]" : "text-primary"}`}
            >
              {count}
            </span>
            <span className="text-xs text-primary/60 mt-0.5 block">
              of {target}
            </span>
          </div>
        </div>
      </div>

      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-primary/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -20,
          }}
        />
      ))}

    </button>
  );
}
