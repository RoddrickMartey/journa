import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { User, Mail } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { userUpdateEmail, userUpdateUsername } from "@/api/authApi";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

/* =======================
   Schemas
======================= */

const userUpdateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const userUpdateUsernameSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters long"),
});

type UserUpdateEmailType = z.infer<typeof userUpdateEmailSchema>;
type UserUpdateUsernameType = z.infer<typeof userUpdateUsernameSchema>;

/* =======================
   Component
======================= */

function UserDetails() {
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const { user, updateUser } = useUserStore();

  /* ---------- Username Form ---------- */
  const {
    register: registerUsername,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
    reset: resetUsername,
  } = useForm<UserUpdateUsernameType>({
    resolver: zodResolver(userUpdateUsernameSchema),
    mode: "onSubmit",
  });

  const onSubmitUsername = async (data: UserUpdateUsernameType) => {
    try {
      const res = await userUpdateUsername({ username: data.username });
      console.log("Update username response:", res);
      resetUsername({ username: "" });
    } catch (error) {
      console.log(error);
      resetUsername({ username: "" });
      toast.error("Something went wrong");
    }
    setEditUsername(false);
  };

  /* ---------- Email Form ---------- */
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    resetField: resetFieldEmail,
  } = useForm<UserUpdateEmailType>({
    resolver: zodResolver(userUpdateEmailSchema),
    mode: "onSubmit",
    defaultValues: { email: user?.email || "" },
  });

  const onSubmitEmail = async (data: UserUpdateEmailType) => {
    try {
      const res = await userUpdateEmail({ email: data.email });
      console.log("Update email response:", res);
      updateUser({ email: res.email });
    } catch (error) {
      console.log(error);
      resetFieldEmail("email");
      toast.error("Something went wrong");
    }
    setEditEmail(false);
  };

  return (
    <section className="w-full space-y-8 flex flex-col mt-10">
      <Separator />

      <header className="space-y-1">
        <h1 className="text-lg font-semibold">User Details</h1>
        <p className="text-sm text-muted-foreground">
          View and edit your username and email address.
        </p>
      </header>

      {/* ================= Username ================= */}
      <form
        onSubmit={handleUsernameSubmit(onSubmitUsername)}
        className="space-y-4 bg-card p-4 rounded-md w-full mx-2"
      >
        <Label>Username</Label>
        <div className="space-y-2">
          <InputGroup className={!editUsername ? "cursor-not-allowed" : ""}>
            <InputGroupInput
              placeholder="Username"
              {...registerUsername("username")}
              disabled={!editUsername || isUsernameSubmitting}
            />
            <InputGroupAddon align="inline-start">
              <User className="w-4 h-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          {usernameErrors.username && (
            <p className="text-sm text-destructive">
              {usernameErrors.username.message}
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {!editUsername ? (
            <Button type="button" onClick={() => setEditUsername(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditUsername(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUsernameSubmitting}>
                {isUsernameSubmitting ? <Spinner /> : "Save"}
              </Button>
            </>
          )}
        </div>
      </form>

      <Separator />

      {/* ================= Email ================= */}
      <form
        onSubmit={handleEmailSubmit(onSubmitEmail)}
        className="space-y-4 bg-card p-4 rounded-md w-full mx-2"
      >
        <Label>E-mail</Label>
        <div className="space-y-2">
          <InputGroup className={!editEmail ? "cursor-not-allowed" : ""}>
            <InputGroupInput
              placeholder="Email"
              {...registerEmail("email")}
              disabled={!editEmail || isEmailSubmitting}
            />
            <InputGroupAddon align="inline-start">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          {emailErrors.email && (
            <p className="text-sm text-destructive">
              {emailErrors.email.message}
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {!editEmail ? (
            <Button type="button" onClick={() => setEditEmail(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditEmail(false);
                  resetFieldEmail("email");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEmailSubmitting}>
                {isEmailSubmitting ? <Spinner /> : "Save"}
              </Button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}

export default UserDetails;
