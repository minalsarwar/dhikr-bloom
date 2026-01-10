import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CounterRing } from "./CounterRing";
import { DhikrInput } from "./DhikrInput";
import { TargetSelector } from "./TargetSelector";
import { ThemeToggle } from "./ThemeToggle";
import { FloatingOrbs } from "./FloatingOrbs";
import { Plus, Minus, RotateCcw, Sparkles } from "lucide-react";

interface TasbeehState {
  count: number;
  target: number;
  dhikr: string;
  theme: "light" | "dark";
}

const COMMON_DHIKR = [
  "SubhanAllah",
  "Alhamdulillah",
  "Allahu Akbar",
  "La ilaha illallah",
  "Astaghfirullah",
];

export function TasbeehCounter() {
  const [state, setState] = useState<TasbeehState>({
    count: 0,
    target: 33,
    dhikr: "SubhanAllah",
    theme: "light",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasbeeh");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
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

  const handleIncrement = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (state.count < state.target) {
      setState((prev) => ({ ...prev, count: prev.count + 1 }));
      setIsAnimating(true);
      
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
  }, [state.count, state.target]);

  const handleDecrement = useCallback(() => {
    if (state.count > 0) {
      setState((prev) => ({ ...prev, count: prev.count - 1 }));
    }
  }, [state.count]);

  const handleReset = useCallback(() => {
    setState((prev) => ({ ...prev, count: 0 }));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  const isComplete = state.count >= state.target;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background Effects */}
      <FloatingOrbs />
      
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-glow-pulse delay-1000" />
      </div>

      {/* Theme Toggle */}
      <ThemeToggle theme={state.theme} onToggle={toggleTheme} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-bounce-soft" />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Tasbeeh</h1>
            <Sparkles className="w-6 h-6 text-secondary animate-bounce-soft delay-100" />
          </div>
          <p className="text-muted-foreground text-sm">Digital Dhikr Counter</p>
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
        />

        {/* Target Display */}
        <TargetSelector
          target={state.target}
          onChange={(target) => setState((prev) => ({ ...prev, target }))}
        />

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleDecrement}
            disabled={state.count === 0}
            className="group"
          >
            <Minus className="w-6 h-6 transition-transform group-hover:scale-110" />
          </Button>

          <Button
            variant="counter"
            size="icon-xl"
            onClick={handleIncrement}
            disabled={isComplete}
            className="relative overflow-hidden"
          >
            <Plus className="w-8 h-8 transition-transform hover:rotate-90" />
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute bg-primary-foreground/30 rounded-full animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 20,
                  height: 20,
                  marginLeft: -10,
                  marginTop: -10,
                }}
              />
            ))}
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleReset}
            className="group"
          >
            <RotateCcw className="w-6 h-6 transition-transform group-hover:-rotate-180 duration-500" />
          </Button>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="glass-strong rounded-2xl px-6 py-4 text-center animate-float shadow-glow">
            <p className="text-lg font-semibold text-gradient">
              ✨ Target Reached! MashaAllah ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}