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
        {/* Top Right Blob */}
        <div className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[120px] animate-mesh-slow" />

        {/* Middle Left Blob */}
        <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/15 blur-[100px] animate-mesh-medium" />

        {/* Bottom Right Blob */}
        <div className="absolute -bottom-[10%] right-[20%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[120px] animate-mesh-slow animation-delay-3000" />
      </div>

      {/* Actual Content - Z-index ensures it's above the blobs */}
      <div className="relative z-10 w-full flex flex-col items-center ">
        {children}
      </div>
    </div>
  );
}

export default MainBackground;
