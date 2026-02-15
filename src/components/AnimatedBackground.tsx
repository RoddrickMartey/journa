import type { ReactNode } from "react";

type AnimatedBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedBackground({
  children,
  className = "",
}: AnimatedBackgroundProps) {
  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden bg-background font-sans ${className}`}
    >
      {/* Dynamic Color Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top Left: Primary Brand Glow (Purple) */}
        <div className="absolute -top-[15%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-mesh-slow" />

        {/* Top Right: High Contrast Contrast (Chart-2 Teal/Green) */}
        <div className="absolute top-[10%] -right-[10%] w-[45%] h-[50%] rounded-full bg-(--chart-2)/15 blur-[140px] animate-mesh-medium animation-delay-2000" />

        {/* Bottom Left: Warmth (Chart-4 Yellow/Orange) */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-(--chart-4)/10 blur-[130px] animate-mesh-slow animation-delay-3000" />

        {/* Center/Right: Depth (Chart-1 Peach/Coral) */}
        <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] rounded-full bg-(--chart-1)/20 blur-[110px] animate-blob" />
      </div>

      {/* Modern Dot Grid (Using your Foreground color for the dots) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.15] mask-[radial-gradient(ellipse_at_center,black,transparent_85%)]"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 0.5px, transparent 0.5px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content slot */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
