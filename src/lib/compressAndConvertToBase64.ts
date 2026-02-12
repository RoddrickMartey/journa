// src/lib/compressAndConvertToBase64

import imageCompression from "browser-image-compression";

/**
 * Compress an image to <= 2MB and convert it to Base64
 * Compatible with backend CloudinaryService.uploadBase64
 */
export async function compressAndConvertToBase64(file: File): Promise<string> {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
  });

  // Convert compressed file to Base64 data URL
  return await fileToBase64(compressedFile);
}

/**
 * Convert File to Base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to convert file to Base64"));
        return;
      }
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("FileReader error"));
    };

    reader.readAsDataURL(file);
  });
}
