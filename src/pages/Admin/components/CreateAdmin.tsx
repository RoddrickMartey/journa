import { useState } from "react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CropImage } from "@/pages/User/components/CropImage";
import { compressAndConvertToBase64 } from "@/lib/compressAndConvertToBase64";
import { getInitials } from "@/lib/getInitials";
import { SquarePenIcon } from "lucide-react";
import { createAdmin } from "@/api/adminAuthApi";

type CreateAdminFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  number?: string;
  avatar?: string; // base64
};

export default function CreateAdmin() {
  const [open, setOpen] = useState(false); // control our own dialog
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateAdminFormValues>();

  const avatar = watch("avatar");

  /* ---------------- avatar flow ---------------- */
  const handleFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
  };

  const handleCropDone = async (file: File) => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);

    try {
      setLoading(true);
      const base64 = await compressAndConvertToBase64(file);
      setValue("avatar", base64, { shouldDirty: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCrop = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
  };

  /* ---------------- submit ---------------- */
  const onSubmit = async (data: CreateAdminFormValues) => {
    try {
      await createAdmin({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        number: data.number,
        avatar: data.avatar,
      });

      toast.success("Admin created successfully");
      reset();
      setOpen(false); // close our custom dialog
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create admin");
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <>
      {/* Trigger */}
      <Button onClick={() => setOpen(true)}>Create Admin</Button>

      {/* Custom Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg bg-background rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Administrator</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {avatar && <AvatarImage src={avatar} />}
                    <AvatarFallback>
                      {getInitials(watch("name") || "A")}
                    </AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="avatar-upload"
                    className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full
                    bg-primary text-primary-foreground flex items-center justify-center
                    cursor-pointer transition
                    ${loading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <SquarePenIcon className="w-4 h-4" />
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                    onChange={(e) =>
                      e.target.files && handleFileSelect(e.target.files[0])
                    }
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Upload admin avatar
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <Label>Name</Label>
                <Input {...register("name", { required: true })} />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <Label>Username</Label>
                <Input {...register("username", { required: true })} />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  {...register("password", { required: true })}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label>Phone Number</Label>
                <Input {...register("number")} />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting ? "Creating…" : "Create Admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cropper Overlay */}
      {imageSrc && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-background rounded-lg overflow-hidden">
            <CropImage
              imageSrc={imageSrc}
              aspect={1}
              loading={loading}
              onCropComplete={handleCropDone}
              onCancel={handleCancelCrop}
            />
          </div>
        </div>
      )}
    </>
  );
}
