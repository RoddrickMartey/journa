// src/pages/User/Forms/ChangeAvatarAndCoverImage.tsx

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/getInitials";
import { CropImage } from "@/pages/User/components/CropImage";
import { compressAndConvertToBase64 } from "@/lib/compressAndConvertToBase64";
import { Spinner } from "@/components/ui/spinner";
import { userUpdateAvatar, userUpdateCover } from "@/api/authApi";
import { toast } from "sonner";
import { SquarePenIcon } from "lucide-react";

type CropTarget = "avatar" | "cover" | null;

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function ChangeAvatarAndCoverImage() {
  const { profile } = useUserStore();

  const [cropTarget, setCropTarget] = useState<CropTarget>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const avatar = profile?.avatarUrl;
  const cover = profile?.coverImageUrl;
  const displayName = profile?.displayName ?? "";

  const { updateProfile } = useUserStore();

  const avatarUplaod = async (avatar: { avatar: string }) => {
    setAvatarLoading(true);
    try {
      const result = await userUpdateAvatar(avatar);
      updateProfile({ avatarUrl: result.avatarUrl });
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
      console.log(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const coverUplaod = async (cover: { cover: string }) => {
    setCoverLoading(true);
    try {
      const result = await userUpdateCover(cover);
      updateProfile({ coverImageUrl: result.coverImageUrl });
      toast.success("Cover updated successfully");
    } catch (error) {
      toast.error("Failed to update cover");
      console.log(error);
    } finally {
      setCoverLoading(false);
    }
  };

  const handleFileSelect = (file: File, target: CropTarget) => {
    if (loading) return;

    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
    setCropTarget(target);
  };

  const handleCropDone = async (file: File) => {
    if (!cropTarget) return;

    // Close crop UI immediately
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setCropTarget(null);

    try {
      setLoading(true);

      const base64 = await compressAndConvertToBase64(file);

      if (cropTarget === "avatar") {
        await avatarUplaod({ avatar: base64 });
      } else if (cropTarget === "cover") {
        await coverUplaod({ cover: base64 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCrop = () => {
    if (loading) return;

    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setCropTarget(null);
  };

  return (
    <div className="relative">
      {/* Cover */}
      <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden bg-card">
        {cover && (
          <img src={cover} alt="Cover" className="w-full h-full object-cover" />
        )}

        <label
          htmlFor="cover-upload"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full
            bg-background/80 border flex items-center justify-center
            cursor-pointer transition
            ${loading ? "opacity-50 pointer-events-none" : ""}`}
          title="Change Avatar"
        >
          {/* Cover loading conditionally */}
          {coverLoading ? <Spinner /> : <SquarePenIcon className="w-4 h-4" />}
        </label>

        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          className="hidden"
          disabled={loading}
          onChange={(e) =>
            e.target.files && handleFileSelect(e.target.files[0], "cover")
          }
        />
      </div>

      {/* Avatar */}
      <div className="absolute left-4 sm:left-6 -bottom-14 sm:-bottom-16">
        <div className="relative">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background">
            {avatar && <AvatarImage src={avatar} alt={displayName} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          <label
            htmlFor="avatar-upload"
            className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full
              bg-primary text-primary-foreground flex items-center justify-center
              cursor-pointer transition
              ${loading ? "opacity-50 pointer-events-none" : ""}`}
            title="Change Avatar"
          >
            {avatarLoading ? (
              <Spinner />
            ) : (
              <SquarePenIcon className="w-4 h-4" />
            )}
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={(e) =>
              e.target.files && handleFileSelect(e.target.files[0], "avatar")
            }
          />
        </div>
      </div>

      {/* Cropper Overlay */}
      {imageSrc && cropTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-background rounded-lg overflow-hidden">
            <CropImage
              imageSrc={imageSrc}
              aspect={cropTarget === "avatar" ? 1 : 3}
              loading={loading}
              onCropComplete={handleCropDone}
              onCancel={handleCancelCrop}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeAvatarAndCoverImage;
