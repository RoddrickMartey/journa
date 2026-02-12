"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { InfoIcon, ImageIcon, XIcon, Trash } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { createPostCall } from "@/api/postApi";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100, "Title cannot exceed 50 characters."),

  summary: z
    .string()
    .min(5, "Summary must be at least 5 characters.")
    .max(450, "Summary cannot exceed 450 characters.")
    .optional(),

  categoryId: z.uuid("Please select a valid category."),

  tags: z
    .array(
      z
        .string()
        .min(1, "Tags cannot be empty.")
        .max(20, "Tags cannot exceed 250 characters."),
    )
    .min(1, "Please add at least one tag."),

  coverImageBase64: z.string().nullable(),
});

type CreatePost = z.infer<typeof createPostSchema>;

type Category = {
  id: string;
  name: string;
  colorLight: string;
  colorDark: string;
  description: string | null;
};

export default function CreatePostPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [fetchingCat, setFetchingCat] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<CreatePost>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      summary: "",
      categoryId: "",
      tags: [],
      coverImageBase64: null,
    },
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (values: CreatePost) => {
    try {
      const res = await createPostCall(values);
      navigate(`/user/post/edit/${res.data.id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleFileSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
  };

  const handleCropDone = async (file: File) => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);

    try {
      setLoading(true);
      const base64 = await compressAndConvertToBase64(file);
      form.setValue("coverImageBase64", base64);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCrop = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
  };

  const fetchCategories = async () => {
    setFetchingCat(true);
    try {
      const res = await api.get("/category");
      setCategories(res.data);
      setFetchingCat(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    }
  };

  const addTag = (value: string) => {
    if (!value) return;

    // Convert to lowercase, trim, replace spaces with dash, remove special chars
    const sanitized = value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // spaces → dash
      .replace(/[^a-z0-9-]/g, ""); // remove anything not letter/number/dash

    if (!sanitized) return;

    const currentTags = form.getValues("tags");

    // Check for duplicates
    if (currentTags.includes(sanitized)) {
      setTagInput("");
      toast.info("Tag already added");
      return;
    }

    // Enforce max limit
    if (currentTags.length >= 5) {
      setTagInput("");
      toast.info("Maximum of 5 tags allowed");
      return;
    }

    form.setValue("tags", [...currentTags, sanitized]);
    setTagInput("");
  };

  const deleteTag = (value: string) => {
    const current = form.getValues("tags");
    form.setValue(
      "tags",
      current.filter((t) => t !== value),
    );
  };

  const removeCover = () => {
    form.setValue("coverImageBase64", null);
  };

  const {
    formState: { isSubmitting, errors },
  } = form;

  const summary = form.watch("summary");

  // Characters left (0 if exceeds 250)
  const charsLeft = Math.max(450 - (summary?.length ?? 0), 0);

  return (
    <section className="min-h-screen flex justify-center py-6 px-4 sm:py-10 bg-card w-full md:w-4/5 lg:w-2/3 xl:max-w-4xl mx-auto my-0 sm:my-10 rounded-lg shadow border">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Create Post</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">Title</label>
            <InputGroup>
              <InputGroupInput
                placeholder="Post title"
                {...form.register("title")}
                disabled={isSubmitting}
              />
              <InputGroupAddon align="inline-end">
                <InfoIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">Summary</label>
            <InputGroup>
              <InputGroupTextarea
                placeholder="Short summary"
                {...form.register("summary")}
                disabled={isSubmitting}
              />
            </InputGroup>
            <p className="text-sm">{charsLeft} characters left</p>
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">Category</label>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || fetchingCat}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                  {fetchingCat && <Spinner />}
                </>
              )}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">Tags</label>
            <InputGroup>
              <InputGroupInput
                placeholder="Press Enter to add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                disabled={isSubmitting}
              />
            </InputGroup>

            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("tags").map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1 rounded-full bg-muted text-xs sm:text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => deleteTag(tag)}
                    disabled={isSubmitting}
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">Cover Image</label>
            <InputGroup>
              <InputGroupInput
                type="file"
                accept="image/*"
                disabled={loading || isSubmitting}
                className="text-sm file:text-sm" // Styles the file picker text
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleFileSelect(file);
                }}
              />
              <InputGroupAddon align="inline-end">
                <ImageIcon />
              </InputGroupAddon>
            </InputGroup>

            {form.watch("coverImageBase64") && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto" // Full width on mobile
                onClick={removeCover}
                disabled={isSubmitting}
              >
                <Trash className="mr-2 h-4 w-4" /> Remove Cover Image
              </Button>
            )}
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="mb-4">
              <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Some fields need your attention</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {errors.title && <li>{errors.title.message}</li>}

                    {errors.summary && <li>{errors.summary.message}</li>}

                    {errors.categoryId && <li>{errors.categoryId.message}</li>}

                    {errors.tags && (
                      <li>
                        {errors.tags.message ??
                          "Please review the tags you added."}
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-6 text-lg sm:py-2 sm:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Post" : "Create Post"}
            {isSubmitting && <Spinner />}
          </Button>
        </form>
      </div>

      {imageSrc && (
        <CropImage
          imageSrc={imageSrc}
          aspect={16 / 9}
          loading={loading}
          onCropComplete={handleCropDone}
          onCancel={handleCancelCrop}
        />
      )}
    </section>
  );
}
