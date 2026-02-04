"use client";

import { useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/adminCategoryApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description?: string;
  colorLight: string;
  colorDark: string;
};

// Helpers: hex <-> hsl and adjust lightness
function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color =
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function ensureLight(hex: string, minLight = 60) {
  const { h, s, l } = hexToHsl(hex);
  if (l >= minLight) return hex.toLowerCase();
  // raise lightness
  return hslToHex(h, Math.min(s, 90), minLight);
}

function deriveDark(hex: string, amount = 30) {
  const { h, s, l } = hexToHsl(hex);
  const newL = Math.max(0, l - amount);
  return hslToHex(h, s, newL);
}

function AdminCategories() {
  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
        refetchType: "all",
      }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: Partial<Category>;
    }) =>
      updateCategory(
        categoryId,
        data as {
          name: string;
          description?: string;
          colorLight: string;
          colorDark: string;
        },
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
        refetchType: "all",
      }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
        refetchType: "all",
      }),
  });

  // Local form state for create
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#60a5fa"); // default light blue

  // Update dialog state
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState("#60a5fa");

  const onCreate = () => {
    const safeColor = ensureLight(color, 60);
    const dark = deriveDark(safeColor, 30);
    createCategoryMutation.mutate(
      { name, description, colorLight: safeColor, colorDark: dark },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setColor("#60a5fa");
        },
      },
    );
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this category?")) return;
    deleteCategoryMutation.mutate(id);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditColor(cat.colorLight || "#60a5fa");
  };

  const onUpdate = async () => {
    if (!editing) return;
    const safeColor = ensureLight(editColor, 60);
    const dark = deriveDark(safeColor, 30);
    updateCategoryMutation.mutate(
      {
        categoryId: editing.id,
        data: {
          name: editName,
          description: editDescription,
          colorLight: safeColor,
          colorDark: dark,
        },
      },
      {
        onSuccess: () => setEditing(null),
      },
    );
  };

  if (isLoading) return <section>Loading...</section>;
  if (isError) return <section>Error loading categories</section>;

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: create form */}
        <div className="col-span-1 bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Create Category</h2>
            <p className="text-sm text-muted-foreground">
              Organize content with colors and descriptions
            </p>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Optional description"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(ensureLight(e.target.value, 60))}
                className="w-12 h-10 rounded-md border bg-transparent cursor-pointer"
              />
              <span className="text-sm text-muted-foreground font-mono">
                {color.toUpperCase()}
              </span>
            </div>
          </div>

          <Button
            onClick={onCreate}
            disabled={!name || createCategoryMutation.isPending}
            className="w-full"
          >
            {createCategoryMutation.isPending
              ? "Creating..."
              : "Create Category"}
          </Button>
        </div>

        {/* Right: categories list */}
        <div className="col-span-2 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Categories</h2>
            <p className="text-sm text-muted-foreground">
              Manage and edit existing categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {categories.map((cat: Category) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    background: `linear-gradient(135deg, ${cat.colorLight}20 0%, ${cat.colorDark}10 100%)`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-md shrink-0"
                        style={{ background: cat.colorLight }}
                      />
                      <div>
                        <h3 className="font-semibold leading-tight">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(cat)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(cat.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Edit dialog stays unchanged */}
      <AlertDialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Category</AlertDialogTitle>
            <AlertDialogDescription>
              Update category details. Color will be adjusted to a light variant
              automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 pt-2">
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2">Description</Label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-transparent text-sm"
              />
            </div>
            <div>
              <Label className="mb-2">Pick Color (light only)</Label>
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(ensureLight(e.target.value, 60))}
                className="w-12 h-10 p-0 border-0 bg-transparent"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onUpdate}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

export default AdminCategories;
