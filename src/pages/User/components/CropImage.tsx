import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import getCroppedImg from "@/lib/getCroppedImg";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

type CropImageProps = {
  imageSrc: string;
  aspect: number;
  onCropComplete: (file: File) => void;
  onCancel: () => void;
  loading: boolean;
};

export function CropImage({
  imageSrc,
  aspect,
  onCropComplete,
  onCancel,
  loading,
}: CropImageProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    const file = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(file);
  };

  const cropperContent = (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 p-4 pointer-events-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl h-130 sm:h-120 bg-black rounded-lg overflow-hidden">
        {/* Cropper */}
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          zoomSpeed={0.1}
        />

        {/* Actions */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2
                     flex items-center gap-3
                     bg-background/80 backdrop-blur
                     px-4 py-2 rounded-full shadow pointer-events-auto"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );

  // Portal outside dialog
  return typeof document !== "undefined"
    ? createPortal(cropperContent, document.body)
    : null;
}
