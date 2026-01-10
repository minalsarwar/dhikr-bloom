import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CounterRing } from "./CounterRing";
import { DhikrInput } from "./DhikrInput";
import { TargetSelector } from "./TargetSelector";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeSelector, ColorTheme } from "./ThemeSelector";
import { SoundToggle } from "./SoundToggle";
import { FloatingOrbs } from "./FloatingOrbs";
import { useClickSound } from "@/hooks/useClickSound";
import { Plus, Minus, RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TasbeehState {
  count: number;
  target: number;
  dhikr: string;
  theme: "light" | "dark";
  colorTheme: ColorTheme;
  soundEnabled: boolean;
}

const COMMON_DHIKR = [
  "SubhanAllah",
  "Alhamdulillah",
  "Allahu Akbar",
  "La ilaha illallah",
  "Astaghfirullah",
  "SubhanAllahi wa bihamdihi",
  "La hawla wala quwwata illa billah",
  "HasbunAllahu wa ni'mal Wakeel",
  "Allahumma salli ala Muhammad",
  "SubhanAllahil Azeem",
];

// Color theme CSS variables mapping
const COLOR_THEMES: Record<ColorTheme, { primary: string; secondary: string; accent: string }> = {
  lavender: {
    primary: "262 83% 58%",
    secondary: "280 65% 60%",
    accent: "290 70% 65%",
  },
  pink: {
    primary: "330 80% 60%",
    secondary: "350 75% 65%",
    accent: "340 85% 55%",
  },
  blue: {
    primary: "210 90% 56%",
    secondary: "195 85% 52%",
    accent: "220 85% 60%",
  },
  green: {
    primary: "152 70% 50%",
    secondary: "140 65% 55%",
    accent: "160 75% 45%",
  },
  red: {
    primary: "0 75% 60%",
    secondary: "15 80% 55%",
    accent: "350 80% 55%",
  },
  gold: {
    primary: "40 90% 50%",
    secondary: "30 85% 55%",
    accent: "45 95% 45%",
  },
};

export function TasbeehCounter() {
  const [state, setState] = useState<TasbeehState>({
    count: 0,
    target: 33,
    dhikr: "La ilaha illallah",
    theme: "light",
    colorTheme: "lavender",
    soundEnabled: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const hasShownComplete = useRef(false);
  const { toast } = useToast();
  const { playClick, playComplete } = useClickSound(state.soundEnabled);

  // Apply color theme CSS variables
  useEffect(() => {
    const colors = COLOR_THEMES[state.colorTheme];
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty("--secondary", colors.secondary);
    document.documentElement.style.setProperty("--accent", colors.accent);
  }, [state.colorTheme]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasbeeh");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed }));
        if (parsed.theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      } catch (e) {
        console.error("Failed to parse saved state");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasbeeh", JSON.stringify(state));
  }, [state]);

  // Apply theme
  useEffect(() => {
    if (state.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.theme]);

  // Show completion toast
  useEffect(() => {
    if (state.count >= state.target && !hasShownComplete.current) {
      hasShownComplete.current = true;
      playComplete();
      toast({
        title: "✨ MashaAllah! Target Reached ✨",
        description: `You completed ${state.target} counts of "${state.dhikr}"`,
        duration: 5000,
      });
    }
    if (state.count < state.target) {
      hasShownComplete.current = false;
    }
  }, [state.count, state.target, state.dhikr, toast, playComplete]);

  const handleIncrement = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (state.count < state.target) {
      setState((prev) => ({ ...prev, count: prev.count + 1 }));
      setIsAnimating(true);
      playClick();
      
      // Create ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
      
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [state.count, state.target, playClick]);

  const handleDecrement = useCallback(() => {
    if (state.count > 0) {
      setState((prev) => ({ ...prev, count: prev.count - 1 }));
    }
  }, [state.count]);

  const handleReset = useCallback(() => {
    setState((prev) => ({ ...prev, count: 0 }));
    hasShownComplete.current = false;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  const isComplete = state.count >= state.target;

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
      {/* Background Effects */}
      <FloatingOrbs colorTheme={state.colorTheme} />
      
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-glow-pulse delay-1000" />
      </div>

      {/* Top Controls */}
      <div className="fixed top-4 right-4 z-20 flex items-center gap-2">
        <SoundToggle enabled={state.soundEnabled} onToggle={toggleSound} />
        <ThemeSelector 
          theme={state.colorTheme} 
          onChange={(colorTheme) => setState((prev) => ({ ...prev, colorTheme }))} 
        />
        <ThemeToggle theme={state.theme} onToggle={toggleTheme} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-md">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-bounce-soft" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">DhikrBloom</h1>
            <Sparkles className="w-5 h-5 text-primary animate-bounce-soft delay-100" />
          </div>
          <p className="text-primary/70 text-xs">Nurture Your Soul, One Count at a Time</p>
        </div>

        {/* Dhikr Input */}
        <DhikrInput
          value={state.dhikr}
          onChange={(dhikr) => setState((prev) => ({ ...prev, dhikr }))}
          suggestions={COMMON_DHIKR}
        />

        {/* Counter Ring */}
        <CounterRing
          count={state.count}
          target={state.target}
          isAnimating={isAnimating}
          isComplete={isComplete}
          onClick={handleIncrement}
          ripples={ripples}
          colorTheme={state.colorTheme}
        />

        {/* Target Display */}
        <TargetSelector
          target={state.target}
          onChange={(target) => {
            setState((prev) => ({
              ...prev,
              target,
              count: target < prev.target ? 0 : prev.count,
            }));
            hasShownComplete.current = false;
          }}
        />

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleDecrement}
            disabled={state.count === 0}
            className="group border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <Minus className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
          </Button>

          <Button
            size="icon-xl"
            onClick={handleIncrement}
            disabled={isComplete}
            className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
          >
            <Plus className="w-7 h-7 text-primary-foreground transition-transform hover:rotate-90" />
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleReset}
            className="group border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <RotateCcw className="w-5 h-5 text-primary transition-transform group-hover:-rotate-180 duration-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
