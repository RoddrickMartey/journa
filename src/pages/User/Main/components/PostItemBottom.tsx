import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { Edit, Trash, Undo, View, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
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
import { useUserStore } from "@/store/userStore";

type PostItemBottomProps = {
  id: string;
  slug: string;
  isDeleted: boolean;
  published: boolean;
};

function PostItemBottom({
  id,
  slug,
  isDeleted,
  published,
}: PostItemBottomProps) {
  const { profile } = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [`user-posts-${profile?.displayName}`],
    });

  // Mutation: Toggle Publish
  const { mutate: togglePublish, isPending: isPublishing } = useMutation({
    mutationFn: () => api.put(`/posts/post-toggle-publishment/${id}`),
    onSuccess: () => {
      invalidate();
      toast.info(published ? "Post moved to Drafts" : "Post Published!");
    },
  });

  // Mutation: Trash/Restore
  const { mutate: toggleTrash, isPending: isTrashing } = useMutation({
    mutationFn: () => api.put(`/posts/post-trash/${id}`),
    onSuccess: () => {
      invalidate();
      toast.success(
        isDeleted ? "Post restored to drafts" : "Post moved to trash",
      );
    },
  });

  // Mutation: Permanent Delete
  const { mutate: hardDelete, isPending: isHardDeleting } = useMutation({
    mutationFn: () => api.delete(`/posts/post-permanent/${id}`),
    onSuccess: () => {
      invalidate();
      toast.error("Post permanently deleted");
    },
  });

  const isLoading = isPublishing || isTrashing || isHardDeleting;

  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center justify-between w-full border-t py-4">
      {/* LEFT: STATUS & PUBLISH */}
      <div className="flex items-center gap-4">
        {!isDeleted && (
          <Button
            onClick={() => togglePublish()}
            disabled={isLoading}
            variant={published ? "secondary" : "default"}
            size="sm"
          >
            {isPublishing && <Spinner className="mr-2" />}
            {published ? "Unpublish" : "Publish"}
          </Button>
        )}

        {isDeleted && (
          <div className="flex items-center gap-2 text-destructive font-medium bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
            <Trash2 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">In Trash</span>
          </div>
        )}
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex space-x-2 items-center">
        {!isDeleted && (
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => navigate(`/user/post/edit/${id}`)}
            disabled={isLoading}
            title="Edit"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>
        )}

        {!isDeleted && (
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => navigate(`/author/read/${slug}`)}
            disabled={isLoading}
            title="View"
          >
            <View className="h-4 w-4 text-blue-600" />
          </Button>
        )}

        {/* TRASH / RESTORE DIALOG */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon-sm"
              variant="outline"
              disabled={isLoading}
              className={isDeleted ? "text-amber-600" : "text-red-600"}
              title={isDeleted ? "Restore" : "Trash"}
            >
              {isTrashing ? (
                <Spinner />
              ) : isDeleted ? (
                <Undo className="h-4 w-4" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isDeleted ? "Restore Post?" : "Move to Trash?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isDeleted
                  ? "This will move the post back to your drafts where you can edit or republish it."
                  : "This post will be hidden from the public. You can restore it later from your trash."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toggleTrash()}
                className={
                  isDeleted
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* PERMANENT DELETE (Only visible in trash) */}
        {isDeleted && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon-sm"
                variant="destructive"
                disabled={isLoading}
                title="Delete Forever"
              >
                {isHardDeleting ? (
                  <Spinner />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-red-600">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  Permanent Deletion
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action is <strong>irreversible</strong>. This post will
                  be scrubbed from our database forever.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Post</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => hardDelete()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

export default PostItemBottom;
