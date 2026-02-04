import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Key, Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { changeUserPassword } from "@/api/authApi";

/* =======================
   Schema
======================= */
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordChangeType = z.infer<typeof passwordChangeSchema>;

/* =======================
   Component
======================= */
function PasswordChange() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordChangeType>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: PasswordChangeType) => {
    try {
      await changeUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      reset();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    }
  };

  return (
    <section className="w-full mt-10 space-y-6 mx-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-card p-6 rounded-md w-full"
      >
        <Label>Change Password</Label>

        {/* Current Password */}
        <InputGroup
          className={isSubmitting || !isEditing ? "cursor-not-allowed" : ""}
        >
          <InputGroupInput
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            {...register("currentPassword")}
            disabled={isSubmitting || !isEditing}
          />
          <InputGroupAddon align="inline-start">
            <Key className="w-4 h-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              onClick={() => setShowCurrent((prev) => !prev)}
              disabled={isSubmitting || !isEditing}
            >
              {showCurrent ? (
                <EyeClosed className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {errors.currentPassword && (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}

        {/* New Password */}
        <InputGroup
          className={isSubmitting || !isEditing ? "cursor-not-allowed" : ""}
        >
          <InputGroupInput
            type={showNew ? "text" : "password"}
            placeholder="New password"
            {...register("newPassword")}
            disabled={isSubmitting || !isEditing}
          />
          <InputGroupAddon align="inline-start">
            <Key className="w-4 h-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              onClick={() => setShowNew((prev) => !prev)}
              disabled={isSubmitting || !isEditing}
            >
              {showNew ? (
                <EyeClosed className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}

        {/* Confirm Password */}
        <InputGroup
          className={isSubmitting || !isEditing ? "cursor-not-allowed" : ""}
        >
          <InputGroupInput
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            {...register("confirmPassword")}
            disabled={isSubmitting || !isEditing}
          />
          <InputGroupAddon align="inline-start">
            <Key className="w-4 h-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              onClick={() => setShowConfirm((prev) => !prev)}
              disabled={isSubmitting || !isEditing}
            >
              {showConfirm ? (
                <EyeClosed className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          {!isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  reset();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Save"}
              </Button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}

export default PasswordChange;
