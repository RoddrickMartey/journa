import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserPlus, UserMinus, Check, Loader2, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import { useUserStore } from "@/store/userStore";
import type { QueryKey } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FollowButtonProps {
  authorId: string;
  isFollowing: boolean;
  isBlocked?: boolean;
  invalidateKeys?: QueryKey[];
  className?: string;
}

export function FollowButton({
  authorId,
  isFollowing,
  invalidateKeys = [],
  isBlocked,
  className,
}: FollowButtonProps) {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useUserStore();
  const [blockedState, setBlockedState] = useState(!!isBlocked);

  const blockMutation = useMutation({
    mutationFn: () => api.post(`/blocks/${authorId}`),
    onSuccess: () => {
      const newState = !blockedState;
      setBlockedState(newState);

      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );

      toast.success(newState ? "User blocked" : "User unblocked");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const res = error.response?.data as { message: string };
        toast.warning(res.message);
      }
    },
  });

  const followMutation = useMutation({
    mutationFn: () => api.post(`/subscriptions/${authorId}`),
    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
      toast.success(isFollowing ? "Unfollowed" : "Following author");
    },
  });

  const renderContent = () => {
    if (followMutation.isPending) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
      <motion.span
        key={isFollowing ? (isHovered ? "unfollow" : "following") : "follow"}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.15 }}
        className="flex items-center justify-center whitespace-nowrap"
      >
        {isFollowing ? (
          isHovered ? (
            <>
              <UserMinus className="mr-2 h-4 w-4" /> Unfollow
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" /> Following
            </>
          )
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Follow
          </>
        )}
      </motion.span>
    );
  };

  if (!user || user.id === authorId) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Follow Button */}
      <Button
        variant={isFollowing ? "outline" : "secondary"}
        size="sm"
        disabled={followMutation.isPending || blockedState}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          followMutation.mutate();
        }}
        className={cn(
          "relative rounded-full px-6 transition-all duration-300 ease-in-out",
          "min-w-35 h-9 overflow-hidden",
          isFollowing
            ? "border-slate-200 hover:border-destructive hover:text-destructive hover:bg-destructive/5"
            : "bg-secondary hover:bg-secondary/80",
          className,
        )}
      >
        {renderContent()}
      </Button>

      {/* Dropdown Block Menu */}
      <div className="relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                disabled={blockMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  blockMutation.mutate();
                }}
              >
                {blockMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : blockedState ? (
                  <UserPlus className="h-4 w-4" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              {blockedState ? "Unblock user" : "Block user"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
