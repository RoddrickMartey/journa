import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Home, ArrowLeft, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";

const ThemeWeather = ({ theme }: { theme: string }) => {
  const [resolvedTheme, setResolvedTheme] = useState(theme);

  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const isDark = resolvedTheme === "dark";

  // Generate random stable properties for the wishing stars
  const shootingStars = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      id: i,
      top: Math.random() * 40,
      delay: Math.random() * 20,
      duration: Math.random() * 1.5 + 1,
      angle: Math.random() * 15 + 15, // Diagonal tilt
      repeatDelay: Math.random() * 10 + 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Static Stars */}
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-30"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: Math.random() * 2 + 1 + "px",
                  height: Math.random() * 2 + 1 + "px",
                }}
              />
            ))}

            {/* Wishing Stars (Shooting Stars) */}
            {shootingStars.map((star) => (
              <motion.div
                key={`shooting-${star.id}`}
                className="absolute h-px w-24 bg-linear-to-r from-transparent via-primary to-transparent"
                style={{
                  top: `${star.top}%`,
                  left: "-10%",
                  rotate: `${star.angle}deg`,
                }}
                animate={{
                  x: ["0vw", "120vw"],
                  y: ["0vh", "30vh"], // Vertical movement for diagonal path
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  repeatDelay: star.repeatDelay,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="rain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <div className="absolute top-10 w-full flex justify-around opacity-20">
              <Cloud size={60} className="text-primary animate-bounce" />
              <Cloud size={80} className="text-primary/60 mt-10" />
              <Cloud size={50} className="text-primary/40" />
            </div>
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-primary/40 w-px h-6"
                style={{ left: `${Math.random() * 100}%`, top: `-10%` }}
                animate={{ y: "110vh", x: "-20px" }} // Slight diagonal rain
                transition={{
                  duration: Math.random() * 0.8 + 0.4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function NotFound() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden bg-background">
      <ThemeWeather theme={theme} />

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-8 z-10"
      >
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ghost
            size={160}
            className="relative text-primary stroke-[1.5px] drop-shadow-2xl"
          />
        </motion.div>
        <motion.div
          animate={{
            scale: [0.7, 1.1, 0.7],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-3 w-20 bg-primary/20 rounded-[100%] mx-auto mt-8 blur-md"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/40 leading-none">
          404
        </h1>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Lost in the void?
        </h2>
        <p className="mt-4 text-muted-foreground max-w-md text-lg">
          The page you're looking for has drifted into another dimension. Don't
          worry, even ghosts get turned around sometimes.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12 z-10">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 group border-primary/20 hover:bg-primary/5"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Go Back
        </Button>
        <Button
          size="lg"
          className="gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/")}
        >
          <Home size={18} />
          Return Home
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 w-full leading-0 z-0 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="relative block w-full h-64 md:h-96"
        >
          {/* Back Layer */}
          <path
            d="M0,200 L0,120 L150,110 L200,80 L350,90 L500,50 L650,80 L800,40 L1000,70 L1100,60 L1200,90 L1200,200 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.08"
          />
          {/* Middle Layer */}
          <path
            d="M0,200 L0,150 L100,140 L180,110 L300,120 L450,80 L600,100 L750,70 L900,110 L1050,90 L1200,130 L1200,200 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.15"
          />
          {/* Front Layer */}
          <path
            d="M0,200 L0,170 L80,165 L150,140 L250,150 L350,120 L450,145 L550,110 L700,140 L850,100 L1000,130 L1150,120 L1200,160 L1200,200 Z"
            fill="hsl(var(--primary))"
            fillOpacity="0.25"
          />
        </svg>
        <div className="absolute bottom-0 w-full h-24 bg-linear-to-t from-background via-background/80 to-transparent" />
      </div>
    </div>
  );
}
