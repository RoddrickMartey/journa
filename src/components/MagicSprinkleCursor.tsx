"use client";

import { Pointer } from "@/components/ui/pointer"; // Adjust path based on your setup
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MagicSprinkleCursor() {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* Magic UI's Pointer handles the smooth follow logic */}
      <Pointer className="fill-background" />

      {/* Custom Ripple Layer */}
      <div className="fixed inset-0 pointer-events-none z-9999">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute w-10 h-10 border border-primary rounded-full"
              style={{ left: r.x - 20, top: r.y - 20 }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
