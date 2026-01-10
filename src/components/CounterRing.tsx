import { useMemo } from "react";

interface CounterRingProps {
  count: number;
  target: number;
  isAnimating: boolean;
  isComplete: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ripples: { id: number; x: number; y: number }[];
}

export function CounterRing({
  count,
  target,
  isAnimating,
  isComplete,
  onClick,
  ripples,
}: CounterRingProps) {
  const progress = useMemo(() => {
    return Math.min((count / target) * 100, 100);
  }, [count, target]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClick}
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
        <div className={`absolute w-52 h-52 rounded-full border-2 border-primary/20 ${isAnimating ? "animate-pulse-ring" : ""}`} />
        <div className={`absolute w-52 h-52 rounded-full border-2 border-secondary/20 ${isAnimating ? "animate-pulse-ring delay-150" : ""}`} />
      </div>

      {/* SVG Progress Ring */}
      <svg
        className="w-52 h-52 -rotate-90 drop-shadow-lg"
        viewBox="0 0 200 200"
      >
        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          className="opacity-50"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <linearGradient id="completeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--success))" />
            <stop offset="100%" stopColor="hsl(160 80% 55%)" />
          </linearGradient>
        </defs>

        {/* Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={isComplete ? "url(#completeGradient)" : "url(#progressGradient)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out drop-shadow-md"
        />
      </svg>

      {/* Inner Circle */}
      <div className={`absolute inset-0 flex items-center justify-center`}>
        <div className={`w-40 h-40 rounded-full glass-strong flex items-center justify-center transition-all duration-300 ${
          isComplete ? "border-2 border-[hsl(var(--success))]" : "border border-border/50"
        }`}>
          {/* Count Display */}
          <div className="text-center">
            <span
              className={`block text-5xl font-bold transition-all duration-300 ${
                isAnimating ? "animate-count-up" : ""
              } ${isComplete ? "text-[hsl(var(--success))]" : "text-gradient"}`}
            >
              {count}
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">
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