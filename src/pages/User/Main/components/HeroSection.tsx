import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full py-24 px-6 text-center overflow-hidden">
      {/* Floating Emojis Container */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Top Left - Writing/Pencil */}
        <div
          className="absolute top-[15%] left-[10%] md:left-[20%] animate-hero-artifact opacity-80"
          style={{ animationDelay: "0s" }}
        >
          <i
            className="em em-writing_hand text-4xl md:text-5xl"
            aria-role="presentation"
            aria-label="WRITING HAND"
          ></i>
        </div>

        {/* Middle Right - Rocket/Growth */}
        <div
          className="absolute top-[25%] right-[10%] md:right-[18%] animate-hero-artifact opacity-90"
          style={{ animationDelay: "1.5s" }}
        >
          <i
            className="em em-rocket text-4xl md:text-5xl"
            aria-role="presentation"
            aria-label="ROCKET"
          ></i>
        </div>

        {/* Bottom Left - Sparkles/Ideas */}
        <div
          className="absolute bottom-[20%] left-[15%] md:left-[22%] animate-hero-artifact opacity-70"
          style={{ animationDelay: "3s" }}
        >
          <i
            className="em em-sparkles text-3xl md:text-4xl"
            aria-role="presentation"
            aria-label="SPARKLES"
          ></i>
        </div>

        {/* Bottom Right - Notebook */}
        <div
          className="absolute bottom-[15%] right-[12%] md:right-[25%] animate-hero-artifact opacity-80"
          style={{ animationDelay: "4.5s" }}
        >
          <i
            className="em em-ledger text-4xl md:text-5xl"
            aria-role="presentation"
            aria-label="LEDGER"
          ></i>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground leading-tight">
          Journa — A Simple Space for <br />
          <span className="text-primary italic">Sharing Ideas</span> and
          Stories.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Journa is a clean, straightforward platform for writing and sharing
          blogs, articles, and personal insights — designed to help creators
          express ideas easily without unnecessary complexity.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <Button onClick={() => navigate("/auth/login")}>Start Writing</Button>
          <Button variant="outline">Explore Stories</Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
