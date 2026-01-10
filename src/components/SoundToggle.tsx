import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-xl glass-strong border border-border/50 hover:border-primary/50 transition-all duration-300 group"
      aria-label={enabled ? "Disable sound" : "Enable sound"}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5 text-primary transition-colors" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}
