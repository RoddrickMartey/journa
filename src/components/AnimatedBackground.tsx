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
      className={`relative w-full min-h-screen overflow-hidden ${className}`}
    >
      {/* Animated layers */}
      <div className="bg-layer bg-layer-1" />
      <div className="bg-layer bg-layer-2" />
      <div className="bg-layer bg-layer-3" />

      {/* Content slot */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        {children}
      </div>
    </div>
  );
}
