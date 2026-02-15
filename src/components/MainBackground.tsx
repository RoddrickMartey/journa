import type { ReactNode } from "react";

type MainBackgroundProps = {
  children: ReactNode;
  className?: string;
};

function MainBackground({ children, className = "" }: MainBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full bg-background ${className}`}>
      {/* Fixed Ambient Container */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Right: Deep Purple/Primary (Your Hue 272) */}
        <div className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[120px] animate-mesh-slow" />

        {/* Middle Left: Teal/Cyan (Chart-2) - Adds the "pop" contrast */}
        <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-(--chart-2)/10 blur-[100px] animate-mesh-medium" />

        {/* Bottom Right: Warm Amber (Chart-4) - Balanced Depth */}
        <div className="absolute -bottom-[10%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-(--chart-4)/8 blur-[120px] animate-mesh-slow animation-delay-3000" />

        {/* Center Accent: Peach/Coral (Chart-1) - Subtle center fill */}
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-(--chart-1)/5 blur-[150px] animate-blob" />
      </div>

      {/* Grid Pattern Overlay - Subtle enough for long-form reading */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] dark:opacity-[0.1] [mask:radial-gradient(circle_at_center,white,transparent)]"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 0.5px, transparent 0.5px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Actual Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

export default MainBackground;
