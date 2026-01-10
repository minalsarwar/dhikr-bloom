import { useCallback, useRef } from "react";

export function useClickSound(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    if (!enabled) return;

    try {
      // Create AudioContext on demand (browser requirement)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Soft click sound
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.type = "sine";
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);

      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch (e) {
      console.warn("Audio not supported");
    }
  }, [enabled]);

  const playComplete = useCallback(() => {
    if (!enabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Play a pleasant completion sound (chord)
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
      
      frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.type = "sine";
        oscillator.start(ctx.currentTime + i * 0.05);
        oscillator.stop(ctx.currentTime + 0.5);
      });

      // Haptic pattern for completion
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 100]);
      }
    } catch (e) {
      console.warn("Audio not supported");
    }
  }, [enabled]);

  return { playClick, playComplete };
}
