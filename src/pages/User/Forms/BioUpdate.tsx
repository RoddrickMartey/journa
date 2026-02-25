import { userUpdateBio } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const bioSchema = z.object({
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
});

type BioUpdateType = z.infer<typeof bioSchema>;

function BioUpdate() {
  const [editMode, setEditMode] = useState(false);
  const { profile, updateProfile } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BioUpdateType>({
    resolver: zodResolver(bioSchema),
    defaultValues: { bio: profile?.bio || "" },
  });

  const onSubmit = async (data: BioUpdateType) => {
    try {
      const result = await userUpdateBio({ bio: data.bio || null });
      updateProfile({ bio: result.bio });
      toast.success("Bio updated successfully!");
      setEditMode(false);
    } catch (error: Error | unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className=" w-full mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 rounded-md w-full mx-2"
      >
        {/* Bio Field */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="block text-sm font-medium ">
            Bio{" "}
            <span className="text-sm">
              (clear the field to remove your bio)
            </span>
          </Label>
          <Textarea
            {...register("bio")}
            rows={7}
            disabled={!editMode || isSubmitting}
          />

          {errors.bio && (
            <p className="text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {editMode ? (
            <>
              <Button
                type="button"
                onClick={() => setEditMode(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit">
                {isSubmitting ? <Spinner /> : "Update Bio"}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BioUpdate;
