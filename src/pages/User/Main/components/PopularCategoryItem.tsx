import type { PopularCategories } from "@/types/publicFeed";
import { useTheme } from "@/context/theme-context";

function PopularCategoryItem({ category }: { category: PopularCategories }) {
  const { theme } = useTheme();

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const bgColor =
    resolvedTheme === "dark"
      ? category.colorDark || "#333"
      : category.colorLight || "#eee";

  const textColor = resolvedTheme === "dark" ? "#000" : "#fff";

  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className="truncate">{category.name}</span>
      <span className="ml-2 text-xs bg-black/10 dark:bg-black/90 dark:text-foreground rounded-full px-2 py-0.5">
        {category._count.posts}
      </span>
    </div>
  );
}

export default PopularCategoryItem;
