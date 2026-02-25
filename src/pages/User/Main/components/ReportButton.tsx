import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

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
import { Flag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAxiosError } from "axios";

type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "ABUSE"
  | "FALSE_INFORMATION"
  | "OTHER";

interface ReportButtonProps {
  reportedUserId?: string;
  postId?: string;
  commentId?: string;
  trigger?: React.ReactNode;
}

function ReportButton({
  reportedUserId,
  postId,
  commentId,
  trigger,
}: ReportButtonProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/reports", {
        reportedUserId,
        postId,
        commentId,
        reason,
        message: message.trim() || undefined,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Report submitted successfully");
      setOpen(false);
      setReason("");
      setMessage("");
    },
    onError: (error: Error) => {
      if (isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "Failed to submit report",
        );
      }
    },
  });

  const handleSubmit = () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    mutation.mutate();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              {trigger ? (
                // Wrap the custom trigger to ensure it receives Radix props
                <span>{trigger}</span>
              ) : (
                <Button
                  type="button" // Explicitly prevent any form bubble-up
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive rounded-full"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              )}
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Report</p>
          </TooltipContent>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Report Content</AlertDialogTitle>
              <AlertDialogDescription>
                Select a reason for reporting this content.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select
                  value={reason}
                  onValueChange={(value) => setReason(value as ReportReason)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPAM">Spam</SelectItem>
                    <SelectItem value="HARASSMENT">Harassment</SelectItem>
                    <SelectItem value="ABUSE">Abuse</SelectItem>
                    <SelectItem value="FALSE_INFORMATION">
                      False Information
                    </SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional details (optional)</Label>
                <Textarea
                  placeholder="Provide more context..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Report"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ReportButton;
