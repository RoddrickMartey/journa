import type { ReactNode } from "react";

type AnimatedBackgroundProps = {
  children: ReactNode;
  className?: string;
};

function MainBackground({ children, className = "" }: AnimatedBackgroundProps) {
  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden ${className}`}
    >
      {/* Animated layers */}
      <div className="bg-layer bg-layer-1" />
      <div className="bg-layer bg-layer-2" />
      <div className="bg-layer bg-layer-3" />

      {/* Content slot */}
      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default MainBackground;
