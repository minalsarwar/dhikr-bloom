import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DhikrInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export function DhikrInput({ value, onChange, suggestions }: DhikrInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your dhikr..."
          className="w-full px-5 py-3 pr-12 rounded-2xl glass-strong border border-border/50 text-center text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted/50 transition-colors"
          title="Choose from suggestions"
        >
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Suggestions */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl border border-border/50 z-50 transition-all duration-300 origin-top max-h-64 overflow-y-auto ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {suggestions.map((dhikr, index) => (
          <button
            key={dhikr}
            onClick={() => {
              onChange(dhikr);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors duration-200 ${
              value === dhikr ? "bg-primary/10 text-primary font-medium" : ""
            } ${index !== suggestions.length - 1 ? "border-b border-border/30" : ""}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-sm">{dhikr}</span>
          </button>
        ))}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}