// src/lib/getCroppedImg.ts
export default function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.95,
      );
    };

    image.onerror = () => reject(new Error("Image load failed"));
  });
}
