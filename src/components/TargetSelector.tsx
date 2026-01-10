import { useState } from "react";
import { Crosshair, Check } from "lucide-react";

interface TargetSelectorProps {
  target: number;
  onChange: (target: number) => void;
}

const PRESET_TARGETS = [33, 100, 500, 1000];

export function TargetSelector({ target, onChange }: TargetSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customValue, setCustomValue] = useState(target.toString());

  const handleCustomSubmit = () => {
    const value = parseInt(customValue, 10);
    if (!isNaN(value) && value > 0) {
      onChange(value);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-primary">
        <Crosshair className="w-4 h-4" />
        <span className="text-sm font-medium">Target</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESET_TARGETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              target === preset
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : "glass border border-primary/30 text-primary hover:border-primary hover:bg-primary/10"
            }`}
          >
            {preset}
          </button>
        ))}

        {/* Custom Input */}
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
              className="w-20 px-3 py-2 rounded-xl glass border border-primary/50 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
              min={1}
            />
            <button
              onClick={handleCustomSubmit}
              className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setCustomValue(target.toString());
              setIsEditing(true);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 glass border border-dashed border-primary/30 text-primary hover:border-primary hover:bg-primary/10 ${
              !PRESET_TARGETS.includes(target)
                ? "border-solid bg-primary text-primary-foreground"
                : ""
            }`}
          >
            {PRESET_TARGETS.includes(target) ? "Custom" : target}
          </button>
        )}
      </div>
    </div>
  );
}