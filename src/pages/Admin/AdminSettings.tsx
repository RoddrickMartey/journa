"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminStore } from "@/store/adminStore";
import {
  updateAdminEmail,
  updateAdminUsername,
  updateAdminName,
  updateAdminNumber,
  changeAdminPassword,
  updateAdminAvatar,
} from "@/api/adminAuthApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  AlertCircle,
  Eye,
  EyeClosed,
  SquarePen,
} from "lucide-react";
import { CropImage } from "@/pages/User/components/CropImage";
import { compressAndConvertToBase64 } from "@/lib/compressAndConvertToBase64";
import { getInitials } from "@/lib/getInitials";
import { toast } from "sonner";

// Validation schemas
const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

const usernameSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .min(3, "Username must be at least 3 characters long"),
});

const nameSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters long"),
});

const numberSchema = z.object({
  number: z.string({ error: "Phone number is required" }),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string({ error: "Current password is required" })
      .min(8, "Password must be at least 8 characters long"),
    newPassword: z
      .string({ error: "New password is required" })
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string({ error: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type UsernameFormData = z.infer<typeof usernameSchema>;
type NameFormData = z.infer<typeof nameSchema>;
type NumberFormData = z.infer<typeof numberSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface FieldState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface AllFieldsState {
  email: FieldState;
  username: FieldState;
  name: FieldState;
  number: FieldState;
  password: FieldState;
}

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "response" in err) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = err as any;
      return anyErr?.response?.data?.message || fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const SettingSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-border/50 pb-8 last:border-0">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

function AdminSettings() {
  const { user, updateUser } = useAdminStore();
  const [fieldsState, setFieldsState] = useState<AllFieldsState>({
    email: { loading: false, success: false, error: null },
    username: { loading: false, success: false, error: null },
    name: { loading: false, success: false, error: null },
    number: { loading: false, success: false, error: null },
    password: { loading: false, success: false, error: null },
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [cropTarget, setCropTarget] = useState<"avatar" | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user?.email || "" },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setFieldsState((prev) => ({
      ...prev,
      email: { loading: true, success: false, error: null },
    }));

    try {
      await updateAdminEmail(data);
      updateUser({ email: data.email });
      setFieldsState((prev) => ({
        ...prev,
        email: { loading: false, success: true, error: null },
      }));
      setTimeout(() => {
        setFieldsState((prev) => ({
          ...prev,
          email: { loading: false, success: false, error: null },
        }));
      }, 3000);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update email");
      setFieldsState((prev) => ({
        ...prev,
        email: {
          loading: false,
          success: false,
          error: message,
        },
      }));
    }
  };

  // Username form
  const usernameForm = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: user?.username || "" },
  });

  const onUsernameSubmit = async (data: UsernameFormData) => {
    setFieldsState((prev) => ({
      ...prev,
      username: { loading: true, success: false, error: null },
    }));

    try {
      await updateAdminUsername(data);
      updateUser({ username: data.username });
      setFieldsState((prev) => ({
        ...prev,
        username: { loading: false, success: true, error: null },
      }));
      setTimeout(() => {
        setFieldsState((prev) => ({
          ...prev,
          username: { loading: false, success: false, error: null },
        }));
      }, 3000);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update username");
      setFieldsState((prev) => ({
        ...prev,
        username: {
          loading: false,
          success: false,
          error: message,
        },
      }));
    }
  };

  // Name form
  const nameForm = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user?.name || "" },
  });

  const onNameSubmit = async (data: NameFormData) => {
    setFieldsState((prev) => ({
      ...prev,
      name: { loading: true, success: false, error: null },
    }));

    try {
      await updateAdminName(data);
      updateUser({ name: data.name });
      setFieldsState((prev) => ({
        ...prev,
        name: { loading: false, success: true, error: null },
      }));
      setTimeout(() => {
        setFieldsState((prev) => ({
          ...prev,
          name: { loading: false, success: false, error: null },
        }));
      }, 3000);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update name");
      setFieldsState((prev) => ({
        ...prev,
        name: {
          loading: false,
          success: false,
          error: message,
        },
      }));
    }
  };

  // Number form
  const numberForm = useForm<NumberFormData>({
    resolver: zodResolver(numberSchema),
    defaultValues: { number: user?.number || "" },
  });

  const onNumberSubmit = async (data: NumberFormData) => {
    setFieldsState((prev) => ({
      ...prev,
      number: { loading: true, success: false, error: null },
    }));

    try {
      await updateAdminNumber(data);
      updateUser({ number: data.number });
      setFieldsState((prev) => ({
        ...prev,
        number: { loading: false, success: true, error: null },
      }));
      setTimeout(() => {
        setFieldsState((prev) => ({
          ...prev,
          number: { loading: false, success: false, error: null },
        }));
      }, 3000);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update phone number");
      setFieldsState((prev) => ({
        ...prev,
        number: {
          loading: false,
          success: false,
          error: message,
        },
      }));
    }
  };

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setFieldsState((prev) => ({
      ...prev,
      password: { loading: true, success: false, error: null },
    }));

    try {
      await changeAdminPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setFieldsState((prev) => ({
        ...prev,
        password: { loading: false, success: true, error: null },
      }));
      passwordForm.reset();
      setShowPasswords({ current: false, new: false, confirm: false });
      setTimeout(() => {
        setFieldsState((prev) => ({
          ...prev,
          password: { loading: false, success: false, error: null },
        }));
      }, 3000);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to change password");
      setFieldsState((prev) => ({
        ...prev,
        password: {
          loading: false,
          success: false,
          error: message,
        },
      }));
    }
  };

  // Avatar upload handlers
  const avatarUpload = async (avatar: { avatar: string }) => {
    setAvatarLoading(true);
    try {
      const result = await updateAdminAvatar(avatar);
      updateUser({ avatarUrl: result.data.avatarUrl });
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
      console.error(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (loading) return;
    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
    setCropTarget("avatar");
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
      await avatarUpload({ avatar: base64 });
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
    <section className="space-y-8 py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Avatar Section */}
      <SettingSection
        title="Profile Picture"
        description="Upload and customize your profile avatar"
      >
        <div className="relative inline-block">
          <Avatar className="w-32 h-32 border-4 border-border">
            {user?.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>

          <label
            htmlFor="avatar-upload"
            className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full
              bg-primary text-primary-foreground flex items-center justify-center
              cursor-pointer transition hover:bg-primary/90
              ${loading ? "opacity-50 pointer-events-none" : ""}`}
            title="Change Avatar"
          >
            {avatarLoading ? <Spinner /> : <SquarePen className="w-5 h-5" />}
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
      </SettingSection>

      {/* Email Update */}
      <SettingSection
        title="Email Address"
        description="Update your email address associated with your account"
      >
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              disabled={fieldsState.email.loading}
              {...emailForm.register("email")}
              aria-invalid={!!emailForm.formState.errors.email}
            />
            {emailForm.formState.errors.email && (
              <p className="text-xs text-destructive mt-1">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {fieldsState.email.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fieldsState.email.error}</AlertDescription>
            </Alert>
          )}

          {fieldsState.email.success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Email updated successfully
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={fieldsState.email.loading}
            className="w-full"
          >
            {fieldsState.email.loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Email"
            )}
          </Button>
        </form>
      </SettingSection>

      {/* Username Update */}
      <SettingSection
        title="Username"
        description="Change your unique username (minimum 3 characters)"
      >
        <form
          onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="username" className="mb-2 block">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              disabled={fieldsState.username.loading}
              {...usernameForm.register("username")}
              aria-invalid={!!usernameForm.formState.errors.username}
            />
            {usernameForm.formState.errors.username && (
              <p className="text-xs text-destructive mt-1">
                {usernameForm.formState.errors.username.message}
              </p>
            )}
          </div>

          {fieldsState.username.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fieldsState.username.error}</AlertDescription>
            </Alert>
          )}

          {fieldsState.username.success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Username updated successfully
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={fieldsState.username.loading}
            className="w-full"
          >
            {fieldsState.username.loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Username"
            )}
          </Button>
        </form>
      </SettingSection>

      {/* Name Update */}
      <SettingSection
        title="Full Name"
        description="Update your full name (minimum 2 characters)"
      >
        <form
          onSubmit={nameForm.handleSubmit(onNameSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={fieldsState.name.loading}
              {...nameForm.register("name")}
              aria-invalid={!!nameForm.formState.errors.name}
            />
            {nameForm.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {nameForm.formState.errors.name.message}
              </p>
            )}
          </div>

          {fieldsState.name.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fieldsState.name.error}</AlertDescription>
            </Alert>
          )}

          {fieldsState.name.success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Name updated successfully
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={fieldsState.name.loading}
            className="w-full"
          >
            {fieldsState.name.loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Name"
            )}
          </Button>
        </form>
      </SettingSection>

      {/* Phone Number Update */}
      <SettingSection
        title="Phone Number"
        description="Update your phone number for contact purposes"
      >
        <form
          onSubmit={numberForm.handleSubmit(onNumberSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="number" className="mb-2 block">
              Phone Number
            </Label>
            <Input
              id="number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              disabled={fieldsState.number.loading}
              {...numberForm.register("number")}
              aria-invalid={!!numberForm.formState.errors.number}
            />
            {numberForm.formState.errors.number && (
              <p className="text-xs text-destructive mt-1">
                {numberForm.formState.errors.number.message}
              </p>
            )}
          </div>

          {fieldsState.number.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fieldsState.number.error}</AlertDescription>
            </Alert>
          )}

          {fieldsState.number.success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Phone number updated successfully
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={fieldsState.number.loading}
            className="w-full"
          >
            {fieldsState.number.loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Phone Number"
            )}
          </Button>
        </form>
      </SettingSection>

      {/* Password Change */}
      <SettingSection
        title="Change Password"
        description="Update your password to keep your account secure"
      >
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="currentPassword" className="mb-2 block">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Enter your current password"
                disabled={fieldsState.password.loading}
                {...passwordForm.register("currentPassword")}
                aria-invalid={!!passwordForm.formState.errors.currentPassword}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                disabled={fieldsState.password.loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {showPasswords.current ? (
                  <EyeClosed className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword" className="mb-2 block">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Enter your new password"
                disabled={fieldsState.password.loading}
                {...passwordForm.register("newPassword")}
                aria-invalid={!!passwordForm.formState.errors.newPassword}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                disabled={fieldsState.password.loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {showPasswords.new ? (
                  <EyeClosed className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="mb-2 block">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm your new password"
                disabled={fieldsState.password.loading}
                {...passwordForm.register("confirmPassword")}
                aria-invalid={!!passwordForm.formState.errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                disabled={fieldsState.password.loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {showPasswords.confirm ? (
                  <EyeClosed className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {fieldsState.password.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fieldsState.password.error}</AlertDescription>
            </Alert>
          )}

          {fieldsState.password.success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Password changed successfully
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={fieldsState.password.loading}
            className="w-full"
          >
            {fieldsState.password.loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </SettingSection>

      {/* Crop Overlay */}
      {imageSrc && cropTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
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
    </section>
  );
}

export default AdminSettings;
