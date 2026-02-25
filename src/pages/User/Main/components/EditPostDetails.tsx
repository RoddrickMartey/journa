"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ImageIcon, XIcon, Trash, Save } from "lucide-react";
import { CropImage } from "@/pages/User/components/CropImage";
import { compressAndConvertToBase64 } from "@/lib/compressAndConvertToBase64";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePostDetailsCall,
  type PostForEdit,
  type UpdatePostPayload,
} from "@/api/postApi";
import { isAxiosError } from "axios";

const updatePostSchema = z
  .object({
    title: z.string().min(3).max(100),
    summary: z.string().max(450).nullable(),
    categoryId: z.uuid(),
    tags: z.array(z.string()).min(1),
  })
  .partial();

type UpdatePost = z.infer<typeof updatePostSchema>;

type Category = {
  id: string;
  name: string;
  colorLight: string;
  colorDark: string;
  description: string | null;
};

interface Props {
  post: PostForEdit;
  postId: string;
}

function EditPostDetails({ post, postId }: Props) {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const form = useForm<UpdatePost>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      summary: post.summary ?? "",
      categoryId: post.category.id,
      tags: post.tags ?? [],
    },
  });

  // Normalize null/empty before sending PATCH payload
  const normalizePayload = (
    values: Partial<UpdatePost>,
  ): UpdatePostPayload => ({
    ...values,
    summary: values.summary === undefined ? undefined : values.summary || null,
  });

  const { mutate: updateField, isPending: isInputUpdate } = useMutation({
    mutationFn: (payload: UpdatePostPayload) =>
      updatePostDetailsCall(payload, postId),
    onSuccess: () => {
      toast.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : "Update failed";
      toast.error(message);
    },
  });

  const { mutate: removeCoverImage, isPending: isRemoving } = useMutation({
    mutationFn: () =>
      api.delete(`/posts/post-update-details/${postId}/cover-image`),
    onSuccess: () => {
      toast.success("Cover image removed");
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  useEffect(() => {
    api.get<Category[]>("/category").then((res) => setCategories(res.data));
  }, []);

  const handleCropDone = async (file: File) => {
    setImageSrc(null);
    try {
      const base64 = await compressAndConvertToBase64(file);
      updateField({ coverImageBase64: base64 });
    } catch {
      toast.error("Image processing failed");
    }
  };

  const addTag = (val: string) => {
    const sanitized = val
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (!sanitized) return;

    const current = form.getValues("tags") ?? [];
    if (current.includes(sanitized)) return setTagInput("");

    form.setValue("tags", [...current, sanitized]);
    setTagInput("");
  };

  return (
    <div className="space-y-8 border-b pb-10 mb-10">
      <div className="space-y-3">
        <label className="text-sm font-medium">Cover Image</label>
        {post.coverImageUrl ? (
          <div className="relative group w-full max-h-120 overflow-hidden rounded-xl border">
            <img
              src={post.coverImageUrl}
              alt="Cover"
              className="w-full h-48 md:h-auto aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => document.getElementById("edit-cover")?.click()}
                disabled={isRemoving || isInputUpdate}
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeCoverImage()}
                disabled={isRemoving}
              >
                {isRemoving || isInputUpdate ? (
                  <Spinner />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}{" "}
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition"
            onClick={() => document.getElementById("edit-cover")?.click()}
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload cover image
            </p>
          </div>
        )}

        <input
          id="edit-cover"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImageSrc(URL.createObjectURL(file));
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <div className="flex gap-2">
            <InputGroup className="flex-1">
              <InputGroupInput
                {...form.register("title")}
                placeholder="Post Title"
                disabled={isInputUpdate}
              />
            </InputGroup>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                updateField(
                  normalizePayload({ title: form.getValues("title") }),
                )
              }
              disabled={isInputUpdate}
            >
              {isInputUpdate ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  updateField(normalizePayload({ categoryId: val }));
                }}
                value={field.value}
                disabled={isInputUpdate}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span>{cat.name}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground italic">
                          {cat.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Summary</label>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <InputGroupTextarea
                {...form.register("summary")}
                className="min-h-25 border rounded-lg bg-input"
                disabled={isInputUpdate}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {Math.max(250 - (form.watch("summary")?.length || 0), 0)}{" "}
                characters left
              </p>
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                updateField(
                  normalizePayload({ summary: form.getValues("summary") }),
                )
              }
              disabled={isInputUpdate}
            >
              {isInputUpdate ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex gap-2 items-start">
            <div className="flex-1 space-y-3">
              <InputGroupInput
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag(tagInput))
                }
                placeholder="Type tag and press Enter"
                disabled={isInputUpdate}
              />

              <div className="flex flex-wrap gap-2">
                {form.watch("tags")?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    #{tag}
                    <XIcon
                      className={`w-3 h-3 cursor-pointer hover:text-destructive ${isInputUpdate ? "pointer-events-none opacity-50" : ""}`}
                      onClick={() => {
                        if (isInputUpdate) return;

                        form.setValue(
                          "tags",
                          (form.getValues("tags") ?? []).filter(
                            (t) => t !== tag,
                          ),
                        );
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                updateField(normalizePayload({ tags: form.getValues("tags") }))
              }
              disabled={isInputUpdate}
            >
              {isInputUpdate ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {imageSrc && (
        <CropImage
          imageSrc={imageSrc}
          aspect={16 / 9}
          loading={isInputUpdate}
          onCropComplete={handleCropDone}
          onCancel={() => setImageSrc(null)}
        />
      )}
    </div>
  );
}

export default EditPostDetails;
