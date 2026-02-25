"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Type, Settings2 } from "lucide-react";

import { userUpdateSettings } from "@/api/authApi";
import { useUserStore } from "@/store/userStore";

/* =======================
   Zod Schema
======================= */
const updateSettingsSchema = z.object({
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]),
  fontSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  lineHeight: z.enum(["NORMAL", "WIDE"]),
});

type UpdateSettingsType = z.infer<typeof updateSettingsSchema>;

export default function SettingsPage() {
  const { settings, updateSettings } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateSettingsType>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      theme: settings?.theme || "SYSTEM",
      fontSize: settings?.fontSize || "MEDIUM",
      lineHeight: settings?.lineHeight || "NORMAL",
    },
  });

  const onSubmit = async (data: UpdateSettingsType) => {
    try {
      const res = await userUpdateSettings(data);
      updateSettings(res);
      reset(res);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      // Optional: toast.error("Failed to save")
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 ">
      <section className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in duration-300 bg-background p-5 rounded-xl shadow-sm  border">
        {/* Header Section */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Settings2 className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your interface preferences and display settings.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 ">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" /> Appearance (Will implement soon)
            </Label>
            <Controller
              name="theme"
              control={control}
              render={({ field }) => (
                <Select
                  disabled
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIGHT">Light Mode</SelectItem>
                    <SelectItem value="DARK">Dark Mode</SelectItem>
                    <SelectItem value="SYSTEM">System Preference</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="w-4 h-4" /> Text Size
            </Label>
            <Controller
              name="fontSize"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={!isEditing || isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMALL">Small</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LARGE">Large</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              {/* Note: I'm using Settings2 as a placeholder if LineHeight isn't in your lucide version */}
              <Settings2 className="w-4 h-4" /> Line Spacing
            </Label>
            <Controller
              name="lineHeight"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={!isEditing || isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select Spacing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="WIDE">Wide</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 justify-end pt-4 border-t">
            {!isEditing ? (
              <Button
                type="button"
                className="px-8 transition-all active:scale-95"
                onClick={() => setIsEditing(true)}
              >
                Edit Settings
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  onClick={() => {
                    reset(settings || {});
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 shadow-md shadow-primary/10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
