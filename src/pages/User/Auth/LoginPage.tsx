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
import { Eye, EyeClosed, Info, Key, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Link, useNavigate } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { logInUser } from "@/api/authApi";
import { isAxiosError } from "axios";
import type { ErrorResponse } from "@/lib/axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { useAdminStore } from "@/store/adminStore";

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

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { logoutUser } = useAdminStore();

  const {
    register,
    handleSubmit,
    setValue, // Added to allow auto-filling guest credentials
    formState: { errors, isSubmitting },
  } = useForm<UserLoginType>({
    resolver: zodResolver(userLoginSchema),
    mode: "onSubmit",
  });

  const handleGuestAutoFill = () => {
    setValue("username", "guestdough");
    setValue("password", "guestpassword");
    toast.info("Guest credentials filled!");
  };

  const onSubmit = async (data: UserLoginType) => {
    try {
      const res = await logInUser(data);
      setUser(res);
      toast.success(`${res.user.profile?.displayName || "User"} is logged in`);
      logoutUser();
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        const err: ErrorResponse = error.response?.data;
        toast.error(err.message);
        return;
      }
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <AnimatedBackground>
      <div className="w-full max-w-[calc(100vw-2.5rem)] sm:max-w-md p-6 md:p-8 flex flex-col gap-6 bg-secondary/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary/10 transition-all duration-300">
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full justify-between items-center mb-2">
            <div className="w-10" />
            <LogoDisplay type="card" />
            <ThemeToggle />
          </div>
          <Label className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Login
          </Label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                placeholder="Username"
                {...register("username")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <User className="text-primary/70 w-4 h-4" />
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
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <Key className="text-primary/70 w-4 h-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="hover:text-primary transition-colors"
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
            className="mt-2 h-11 md:h-10 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Login"}
            {isSubmitting && <Spinner className="w-4 h-4 animate-spin" />}
          </Button>
        </form>

        {/* Guest Access Section */}
        <section className="p-3 rounded-xl border border-primary/10 bg-primary/5 dark:bg-primary/10 transition-all">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-wider text-primary/80">
                  Demo Account
                </p>
                <button
                  onClick={handleGuestAutoFill}
                  className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded-md transition-colors font-semibold"
                >
                  Auto-fill
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <p>
                  User:{" "}
                  <span className="font-mono font-medium text-foreground">
                    guestdough
                  </span>
                </p>
                <p>
                  Pass:{" "}
                  <span className="font-mono font-medium text-foreground">
                    guestpassword
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-sm text-center">
          <span className="text-muted-foreground">Don't have an account?</span>
          <Link
            to="/auth/signup"
            className="text-primary font-semibold hover:text-accent-foreground transition-colors hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default LoginPage;
