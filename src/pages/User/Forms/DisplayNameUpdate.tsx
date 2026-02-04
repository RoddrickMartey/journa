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
import { User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { userUpdateDisplayName } from "@/api/authApi";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

/* =======================
   Schema
======================= */

const userUpdateDisplayNameSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be at most 50 characters"),
});

type UserUpdateDisplayNameType = z.infer<typeof userUpdateDisplayNameSchema>;

/* =======================
   Component
======================= */

function DisplayNameUpdate() {
  const [editDisplayName, setEditDisplayName] = useState(false);

  const { profile, updateProfile } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserUpdateDisplayNameType>({
    resolver: zodResolver(userUpdateDisplayNameSchema),
    mode: "onSubmit",
    defaultValues: {
      displayName: profile?.displayName || "",
    },
  });

  const onSubmit = async (data: UserUpdateDisplayNameType) => {
    try {
      const res = await userUpdateDisplayName({
        displayName: data.displayName,
      });

      updateProfile({ displayName: res.displayName });
      toast.success("Display name updated");
      setEditDisplayName(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      reset({ displayName: profile?.displayName || "" });
    }
  };

  return (
    <section className="w-full  space-y-8 flex flex-col mt-28">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-card p-4 rounded-md w-full mx-2"
      >
        <Label>Display Name</Label>
        <div className="space-y-2">
          <InputGroup className={!editDisplayName ? "cursor-not-allowed" : ""}>
            <InputGroupInput
              placeholder="Display name"
              {...register("displayName")}
              disabled={!editDisplayName || isSubmitting}
            />
            <InputGroupAddon align="inline-start">
              <User className="w-4 h-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          {errors.displayName && (
            <p className="text-sm text-destructive">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {!editDisplayName ? (
            <Button type="button" onClick={() => setEditDisplayName(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditDisplayName(false);
                  reset({ displayName: profile?.displayName || "" });
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

export default DisplayNameUpdate;
