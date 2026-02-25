import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BigLikeButtonProps {
  isLiked: boolean;
  count: number;
  postId: string;
  slug: string;
}

export function BigLikeButton({
  isLiked,
  count,
  postId,
  slug,
}: BigLikeButtonProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`/post-likes/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-detail", slug] });

      const message = isLiked ? "Appreciation removed" : "Appreciation added!";

      toast.success(message, {
        icon: (
          <Heart
            className={cn("h-4 w-4", !isLiked && "fill-red-500 text-red-500")}
          />
        ),
      });
    },
    onError: () => {
      toast.error("Could not process appreciation");
    },
  });

  return (
    <div className="flex flex-col items-center gap-2.5 select-none">
      <button
        disabled={isPending}
        onClick={() => mutate()}
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full",
          "border-2 transition-all duration-300 ease-out",
          "shadow-sm backdrop-blur-sm",
          isLiked
            ? "border-red-500/80 bg-red-50/40 text-red-500 dark:bg-red-950/20"
            : "border-muted hover:border-red-400/80 hover:bg-red-50/30 dark:hover:bg-red-950/10",
          "hover:scale-[1.04] active:scale-95",
          isPending && "opacity-70 cursor-not-allowed",
        )}
      >
        <Heart
          className={cn(
            "h-10 w-10 transition-all duration-300",
            isLiked
              ? "fill-current scale-110"
              : "group-hover:scale-110 text-muted-foreground",
          )}
        />
      </button>

      <div className="flex flex-col items-center leading-tight">
        <span
          className={cn(
            "text-2xl font-bold tracking-tight transition-colors tabular-nums",
            isLiked ? "text-red-500" : "text-foreground",
          )}
        >
          {count}
        </span>

        <span className="text-[10px] font-extrabold tracking-[0.28em] uppercase text-muted-foreground/60 mt-0.5">
          Appreciations
        </span>
      </div>
    </div>
  );
}
