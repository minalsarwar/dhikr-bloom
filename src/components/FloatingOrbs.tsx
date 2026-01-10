export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary Orb */}
      <div
        className="absolute w-64 h-64 rounded-full gradient-orb opacity-30 blur-xl animate-float"
        style={{
          top: "10%",
          right: "15%",
          animationDuration: "8s",
        }}
      />

      {/* Secondary Orb */}
      <div
        className="absolute w-48 h-48 rounded-full gradient-secondary opacity-20 blur-xl animate-float"
        style={{
          bottom: "20%",
          left: "10%",
          animationDuration: "10s",
          animationDelay: "-3s",
        }}
      />

      {/* Accent Orb */}
      <div
        className="absolute w-32 h-32 rounded-full gradient-accent opacity-25 blur-lg animate-float"
        style={{
          top: "50%",
          left: "20%",
          animationDuration: "6s",
          animationDelay: "-1s",
        }}
      />

      {/* Subtle Orb */}
      <div
        className="absolute w-40 h-40 rounded-full bg-primary/20 blur-2xl animate-glow-pulse"
        style={{
          bottom: "30%",
          right: "20%",
          animationDuration: "4s",
        }}
      />

      {/* Rotating Ring */}
      <div
        className="absolute w-96 h-96 rounded-full border border-primary/10 animate-spin-slow"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Second Ring */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full border border-secondary/5 animate-spin-slow"
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