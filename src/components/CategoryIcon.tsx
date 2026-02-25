import { useTheme } from "@/context/theme-context";
import {
  Laptop,
  Home,
  Briefcase,
  FlaskConical,
  HeartPulse,
  GraduationCap,
  Film,
  Palette,
  Users,
  FileText,
  DollarSign,
  Utensils,
  Landmark,
  Trophy,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

type Category = {
  id: string;
  name: string;
  colorLight: string;
  colorDark: string;
};

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Technology: Laptop,
  Lifestyle: Home,
  Business: Briefcase,
  Science: FlaskConical,
  Health: HeartPulse,
  Education: GraduationCap,
  Entertainment: Film,
  Creativity: Palette,
  Social: Users,
  General: FileText,
  Finance: DollarSign,
  Food: Utensils,
  History: Landmark,
  Sports: Trophy,
  Spirituality: Sparkles,
};

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({
  category,
  className,
}: CategoryBadgeProps) {
  const { theme } = useTheme();

  const resolvedTheme = useMemo(() => {
    if (theme !== "system") return theme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, [theme]);

  const catTheme =
    resolvedTheme === "dark"
      ? category.colorDark || "#333"
      : category.colorLight || "#eee";

  const textColor =
    resolvedTheme === "dark" ? category.colorLight : category.colorDark;

  const Icon = CATEGORY_ICON_MAP[category.name] ?? FileText;

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest ${className ?? ""}`}
      style={{ backgroundColor: catTheme, color: textColor }}
    >
      <Icon size={15} aria-hidden="true" />
      {category.name}
    </Badge>
  );
}
