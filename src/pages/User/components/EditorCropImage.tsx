"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import getCroppedImg from "@/lib/getCroppedImg";

interface EditorCropImageProps {
  imageSrc: string;
  initialAspect?: number;
  onComplete: (file: File) => void;
  onCancel: () => void; // This must handle the promise rejection in the parent
  loading?: boolean;
}

export function EditorCropImage({
  imageSrc,
  initialAspect = 16 / 9,
  onComplete,
  onCancel,
  loading = false,
}: EditorCropImageProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(file);
    } catch (err) {
      console.error("Crop failed", err);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[80vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Aspect Ratio Selectors */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/50 p-1 rounded-lg border border-white/10 backdrop-blur">
          {[
            { label: "16:9", value: 16 / 9 },
            { label: "4:3", value: 4 / 3 },
            { label: "1:1", value: 1 },
            { label: "Free", value: 0 }, // 0 allows free-form if the library supports it, or just use a default
          ].map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => setAspect(ratio.value)}
              className={`px-3 py-1 text-xs rounded-md transition ${
                aspect === ratio.value
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 bg-neutral-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            zoomSpeed={0.1}
          />
        </div>

        <div className="p-4 bg-neutral-900 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xs">
            <span className="text-white text-xs">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Processing..." : "Apply Crop"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(modalContent, document.body);
}
