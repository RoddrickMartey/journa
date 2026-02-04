type LogoDisplayProps = {
  type: "card" | "header";
};

function LogoDisplay({ type }: LogoDisplayProps) {
  if (type === "card") {
    return (
      <div className="flex flex-col items-center gap-2 text-center select-none">
        <span className="text-4xl font-semibold tracking-tight">Journa</span>
      </div>
    );
  }

  // header
  return (
    <div className="flex items-center gap-2 select-none">
      <span className="text-2xl font-medium tracking-tight">Journa</span>
    </div>
  );
}

export default LogoDisplay;
