import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { userUpdateSocails } from "@/api/authApi";
import { z } from "zod";
import { isAxiosError } from "axios";

/* =======================
   Schema
======================= */

const userUpdateSocialsFormSchema = z.object({
  socials: z.array(
    z.object({
      media: z.string().min(1, "Social media name is required"),
      link: z.string().url("Invalid URL"),
    }),
  ),
});

type UserUpdateSocialsFormType = z.infer<typeof userUpdateSocialsFormSchema>;

/* =======================
   Component
======================= */

function SocialsUpdate() {
  const { profile, updateProfile } = useUserStore();
  const [editSocials, setEditSocials] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserUpdateSocialsFormType>({
    resolver: zodResolver(userUpdateSocialsFormSchema),
    defaultValues: {
      socials: profile?.socials ?? [],
    },
    shouldUnregister: false, // ✅ FIX (critical)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  /* ---------- Submit ---------- */
  const onSubmit = async (data: UserUpdateSocialsFormType) => {
    try {
      const res = await userUpdateSocails(data.socials);
      updateProfile({ socials: res.socials });
      toast.success("Socials updated");
      setEditSocials(false);
      reset({ socials: res.socials });
    } catch (error: Error | unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }

      reset({ socials: profile?.socials ?? [] });
    }
  };

  return (
    <section className="w-full space-y-8 flex flex-col mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-4 rounded-md w-full mx-2"
      >
        <Label>Social Links</Label>

        {/* ================= Socials ================= */}
        <div className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No socials added yet.
            </p>
          ) : (
            <div>
              {profile?.socials.map((social, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Label className="text-sm">{social.media} :</Label>
                  <Label className="text-sm">{social.link}</Label>
                </div>
              ))}
            </div>
          )}

          {fields.map((field, index) => {
            const fieldErrors = errors.socials?.[index];

            return (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Media (e.g. Twitter)"
                      {...register(`socials.${index}.media`)}
                      disabled={!editSocials || isSubmitting}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputGroupInput
                      placeholder="https://example.com"
                      {...register(`socials.${index}.link`)}
                      disabled={!editSocials || isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    </InputGroupAddon>
                  </InputGroup>

                  {(fieldErrors?.media || fieldErrors?.link) && (
                    <p className="text-sm text-destructive">
                      {fieldErrors.media?.message || fieldErrors.link?.message}
                    </p>
                  )}
                </div>

                {editSocials && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= Add Social ================= */}
        {editSocials && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={isSubmitting}
            onClick={() => append({ media: "", link: "" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social
          </Button>
        )}

        {/* ================= Actions ================= */}
        <div className="flex gap-2 justify-end">
          {!editSocials ? (
            <Button type="button" onClick={() => setEditSocials(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  setEditSocials(false);
                  reset({ socials: profile?.socials ?? [] });
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

export default SocialsUpdate;
