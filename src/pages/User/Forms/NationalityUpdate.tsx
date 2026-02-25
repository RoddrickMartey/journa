import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { userUpdateNationality } from "@/api/authApi";
import { useUserStore } from "@/store/userStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { countries as allCountries } from "@/data/countries";
import { Input } from "@/components/ui/input";
import CountryFlag from "@/components/CountryFlag";
import { countryFlagMap } from "@/data/countriesWithFlags";
import { toast } from "sonner";
import { isAxiosError } from "axios";

// Schema
const userUpdateNationalitySchema = z.object({
  nationality: z.string().nullable(),
});
type UserUpdateNationalityType = z.infer<typeof userUpdateNationalitySchema>;

function NationalityUpdate() {
  const { profile, updateProfile } = useUserStore();
  const [filter, setFilter] = useState("");
  const [selectOpen, setSelectOpen] = useState(false); // control Select open state

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UserUpdateNationalityType>({
    resolver: zodResolver(userUpdateNationalitySchema),
    defaultValues: { nationality: profile?.nationality || null },
  });

  const filteredOptions = useMemo(() => {
    if (filter.length >= 3) {
      return allCountries.filter((c) =>
        c.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    return [];
  }, [filter]);

  const onSubmit = async (data: UserUpdateNationalityType) => {
    try {
      const result = await userUpdateNationality(data);
      updateProfile({ nationality: result.nationality });
      reset({ nationality: result.nationality });
      setFilter(result.nationality || "");
      toast.success("Nationality updated successfully");
    } catch (error: Error | unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleRemoveNationality = async () => {
    try {
      const result = await userUpdateNationality({ nationality: null });
      updateProfile({ nationality: result.nationality });
      reset({ nationality: null });
      setFilter("");
      toast.success("Nationality removed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove nationality");
    }
  };

  return (
    <div className="mt-4 w-full mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 rounded-md w-full mx-2"
      >
        {profile?.nationality ? (
          <CountryFlag
            name={profile.nationality}
            code={
              countryFlagMap.find((c) => c.name === profile.nationality)
                ?.code || ""
            }
          />
        ) : (
          <h1>None</h1>
        )}

        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <div>
              {/* Input to type and filter */}
              <Input
                className="w-full mb-2"
                placeholder="Type nationality..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  if (e.target.value.length >= 3) {
                    setSelectOpen(true); // open select when typing >=3 chars
                  } else {
                    setSelectOpen(false);
                  }
                }}
                disabled={isSubmitting}
              />

              <Select
                value={field.value || ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  setFilter(val);
                  setSelectOpen(false); // close after selecting
                }}
                open={selectOpen}
                onOpenChange={setSelectOpen}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-match" disabled>
                      No matches
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Nationality"}
          </Button>

          {profile?.nationality && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" disabled={isSubmitting}>
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Nationality</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove your nationality?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveNationality}
                    disabled={isSubmitting}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </div>
  );
}

export default NationalityUpdate;
