import { EyeIcon, ClockIcon, HeartIcon, MessageSquareIcon } from "lucide-react";
import { millify } from "millify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type StatProps = {
  count: number;
};

// ViewsCount Component
export function ViewsCount({ count }: StatProps) {
  const millifiedNumber = millify(count);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <EyeIcon size={18} />
            <span className="text-sm">{millifiedNumber}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {count.toLocaleString()} views
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ReadTime Component
export function ReadTime({ count }: StatProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <ClockIcon size={18} />
            <span className="text-sm">{count} min</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {count} minutes read
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// LikesCount Component
export function LikesCount({ count }: StatProps) {
  const millifiedNumber = millify(count);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <HeartIcon size={18} />
            <span className="text-sm">{millifiedNumber}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {count.toLocaleString()} likes
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// CommentsCount Component
export function CommentsCount({ count }: StatProps) {
  const millifiedNumber = millify(count);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            <MessageSquareIcon size={18} />
            <span className="text-sm">{millifiedNumber}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {count.toLocaleString()} comments
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
