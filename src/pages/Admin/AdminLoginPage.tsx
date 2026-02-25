import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import LogoDisplay from "@/components/LogoDisplay";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed, Key, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "@/api/adminAuthApi";
import { isAxiosError } from "axios";
import type { ErrorResponse } from "@/lib/axios";
import { toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";
import { useUserStore } from "@/store/userStore";

const userLoginSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

type UserLoginType = z.infer<typeof userLoginSchema>;

function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAdminStore();
  const { logoutUser: clearUserSession } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginType>({
    resolver: zodResolver(userLoginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: UserLoginType) => {
    try {
      const res = await loginAdmin(data);
      setUser(res.data.admin);
      clearUserSession();
      toast.success("Admin is logged in");
      navigate("/admin");
    } catch (error) {
      if (isAxiosError(error)) {
        const err: ErrorResponse = error.response?.data;
        toast.error(err.message);
        console.log(err);

        return;
      }
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[calc(100vw-2.5rem)] sm:max-w-md p-6 md:p-8 flex flex-col gap-6 bg-card backdrop-blur-md rounded-2xl shadow-xl border border-border transition-all duration-300">
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full justify-between items-center mb-2">
            <div className="w-10" /> {/* Spacer for centering logic */}
            <LogoDisplay type="card" />
            <ThemeToggle />
          </div>
          <Label className="text-xl font-semibold tracking-tight">Login</Label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <InputGroup>
              <InputGroupInput
                placeholder="Username"
                {...register("username")}
                disabled={isSubmitting}
                className="h-11 md:h-10" // Taller inputs on mobile for better touch
              />
              <InputGroupAddon align="inline-start">
                <User className="text-muted-foreground w-4 h-4" />
              </InputGroupAddon>
            </InputGroup>
            {errors.username && (
              <p className="text-xs font-medium text-destructive ml-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <InputGroup>
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                disabled={isSubmitting}
                className="h-11 md:h-10"
              />
              <InputGroupAddon align="inline-start">
                <Key className="text-muted-foreground w-4 h-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeClosed className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <p className="text-xs font-medium text-destructive ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 h-11 md:h-10 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Login"}
            {isSubmitting && <Spinner className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default AdminLoginPage;
