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
import { Eye, EyeClosed, Key, User, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Link, useNavigate } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { signUpUser } from "@/api/authApi";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import type { ErrorResponse } from "@/lib/axios";
// List of reserved words based on your Route paths
const reservedUsernames = [
  "admin",
  "auth",
  "user",
  "posts",
  "read",
  "api",
  "settings",
  "profile",
  "login",
  "signup",
  "author",
  "main",
  "dashboard",
];
const userSignupSchema = z
  .object({
    username: z
      .string({ error: "Username is required" })
      .min(3, "Username must be at least 3 characters long") // Usually 3-5 is better for UX than 8
      .max(20, "Username cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Usernames can only contain letters, numbers, periods, and underscores",
      )
      .transform((val) => val.toLowerCase()) // Always store as lowercase
      .refine((val) => !reservedUsernames.includes(val), {
        message: "This username is reserved and cannot be used",
      }),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string({ error: "Please confirm your password" })
      .min(8, "Confirm password must be at least 8 characters long"),
    displayName: z
      .string({ error: "Display name is required" })
      .min(2, "Display name must be at least 2 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserSignupType = z.infer<typeof userSignupSchema>;

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserSignupType>({
    resolver: zodResolver(userSignupSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: UserSignupType) => {
    const payload = {
      username: data.username,
      password: data.password,
      displayName: data.displayName,
      email: data.email,
    };
    try {
      const res = await signUpUser(payload);
      toast.success(`You have signed up ${res.user.profile.displayName}`);
      navigate("/auth/login");
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
      <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md p-5 md:p-8 flex flex-col gap-5 bg-secondary/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary/10 my-4 max-h-[95vh] overflow-y-auto transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full justify-between items-center mb-1">
            <div className="w-10" />
            <LogoDisplay type="card" />
            <ThemeToggle />
          </div>
          <Label className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Create an Account
          </Label>
          <p className="text-xs text-muted-foreground text-center">
            Join our community today
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3.5"
        >
          {/* Display Name */}
          <div className="space-y-1">
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                placeholder="Display Name"
                {...register("displayName")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <User className="w-4 h-4 text-primary/70" />
              </InputGroupAddon>
            </InputGroup>
            {errors.displayName && (
              <p className="text-[11px] font-medium text-destructive ml-1">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1">
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                placeholder="Username"
                {...register("username")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <User className="w-4 h-4 text-primary/70" />
              </InputGroupAddon>
            </InputGroup>
            {errors.username && (
              <p className="text-[11px] font-medium text-destructive ml-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                placeholder="Email"
                {...register("email")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <Mail className="w-4 h-4 text-primary/70" />
              </InputGroupAddon>
            </InputGroup>
            {errors.email && (
              <p className="text-[11px] font-medium text-destructive ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <Key className="w-4 h-4 text-primary/70" />
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
              <p className="text-[11px] font-medium text-destructive ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <InputGroup className="bg-background/50 rounded-lg overflow-hidden border-border/50 focus-within:border-primary/50 transition-colors">
              <InputGroupInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
                className="h-11 md:h-10 bg-transparent border-none focus-visible:ring-0"
              />
              <InputGroupAddon align="inline-start">
                <Key className="w-4 h-4 text-primary/70" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeClosed className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {errors.confirmPassword && (
              <p className="text-[11px] font-medium text-destructive ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 h-11 md:h-10 w-full bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
            {isSubmitting && <Spinner className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>

        {/* Footer */}
        <div className="flex flex-wrap justify-center gap-1.5 text-sm mt-1">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link
            to="/auth/login"
            className="text-primary font-bold hover:text-accent-foreground transition-all hover:underline"
          >
            Login
          </Link>
        </div>
        <div className="w-full flex items-center gap-3 py-2 px-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-[13px] text-muted-foreground">
            Just looking around?
            <Link
              to="/auth/login"
              className="ml-1.5 text-primary font-medium hover:underline"
            >
              Try the Guest Demo →
            </Link>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default SignUpPage;
