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

const userSignupSchema = z
  .object({
    username: z
      .string({ error: "Username is required" })
      .min(8, "Username must be at least 8 characters long"),
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
      {/* Responsive Container Logic:
        - max-w-[calc(100vw-2rem)]: Ensures card never touches edges on mobile
        - sm:max-w-md: Standard width for desktop
        - max-h-[95vh] + overflow-y-auto: Allows scrolling if the form is taller than the phone screen
      */}
      <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md p-5 md:p-8 flex flex-col gap-5 bg-secondary/80 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 my-4 max-h-[95vh] overflow-y-auto ">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full justify-between items-center mb-1">
            <div className="w-10" />
            <LogoDisplay type="card" />
            <ThemeToggle />
          </div>
          <Label className="text-xl font-bold tracking-tight">
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
            <InputGroup>
              <InputGroupInput
                placeholder="Display Name"
                {...register("displayName")}
                disabled={isSubmitting}
                className="h-11 md:h-10"
              />
              <InputGroupAddon align="inline-start">
                <User className="w-4 h-4 text-muted-foreground" />
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
            <InputGroup>
              <InputGroupInput
                placeholder="Username"
                {...register("username")}
                disabled={isSubmitting}
                className="h-11 md:h-10"
              />
              <InputGroupAddon align="inline-start">
                <User className="w-4 h-4 text-muted-foreground" />
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
            <InputGroup>
              <InputGroupInput
                placeholder="Email"
                {...register("email")}
                disabled={isSubmitting}
                className="h-11 md:h-10"
              />
              <InputGroupAddon align="inline-start">
                <Mail className="w-4 h-4 text-muted-foreground" />
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
            <InputGroup>
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                disabled={isSubmitting}
                className="h-11 md:h-10"
              />
              <InputGroupAddon align="inline-start">
                <Key className="w-4 h-4 text-muted-foreground" />
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
              <p className="text-[11px] font-medium text-destructive ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <InputGroup>
              <InputGroupInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
                className="h-11 md:h-10"
              />
              <InputGroupAddon align="inline-start">
                <Key className="w-4 h-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isSubmitting}
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
            className="mt-2 h-11 md:h-10 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
            {isSubmitting && <Spinner className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        {/* Footer */}
        <div className="flex flex-wrap justify-center gap-1.5 text-sm mt-1">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link
            to="/auth/login"
            className="text-primary font-semibold hover:underline transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    </AnimatedBackground>
  );
}

export default SignUpPage;
