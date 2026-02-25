"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import type { Comment } from "@/types/post";
import { useUserStore } from "@/store/userStore";
import { getInitials } from "@/lib/getInitials";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import ReportButton from "./ReportButton";

interface PostCommentsProps {
  comments: Comment[];
  commentCount: number;
  postId: string;
  slug: string;
}

export function PostComments({
  comments,
  commentCount,
  postId,
  slug,
}: PostCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { profile } = useUserStore();
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: (content: string) =>
      api.post(`/comments/post/${postId}`, { content }),
    onSuccess: () => {
      setNewComment("");
      toast.info("Comment added");
      queryClient.invalidateQueries({ queryKey: ["post-detail", slug] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => api.patch(`/comments/${commentId}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-detail", slug] });
      toast.success("Comment updated");
    },
    onError: (error) => {
      if (isAxiosError(error)) toast.error("Update failed");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => api.delete(`/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-detail", slug] });
      toast.info("Comment deleted");
    },
  });

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment);
  };

  const avatar = profile?.avatarUrl ? profile.avatarUrl : undefined;

  return (
    <section className="mt-12 space-y-8">
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold tracking-tight">Responses</h3>
        <span className="text-muted-foreground font-normal">
          ({commentCount})
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} />
            <AvatarFallback>
              {profile?.displayName ? getInitials(profile.displayName) : "?"}
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-25 bg-accent resize-none border-none focus-visible:ring-0 p-2 text-base"
            disabled={createCommentMutation.isPending}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <p className="text-xs text-muted-foreground sm:mr-auto">
            Tip: press{" "}
            <kbd className="px-1 py-0.5 bg-muted rounded">Win + .</kbd> to
            insert emoji
          </p>
          <Button
            disabled={!newComment.trim() || createCommentMutation.isPending}
            size="sm"
            className="rounded-full px-5"
            onClick={handleCommentSubmit}
          >
            {createCommentMutation.isPending ? "Posting..." : "Respond"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              updateComment={(content) =>
                updateCommentMutation.mutate({ commentId: comment.id, content })
              }
              deleteComment={() => deleteCommentMutation.mutate(comment.id)}
              updateLoading={updateCommentMutation.isPending}
              deleteLoading={
                deleteCommentMutation.isPending &&
                deleteCommentMutation.variables === comment.id
              }
            />
          ))
        ) : (
          <NoCommentsPlaceholder />
        )}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  slug,
  updateComment,
  deleteComment,
  updateLoading,
  deleteLoading,
}: {
  comment: Comment;
  slug: string;
  updateComment: (content: string) => void;
  deleteComment: () => void;
  updateLoading: boolean;
  deleteLoading: boolean;
}) {
  const { user, createdAt, content, isEdited, isLiked, _count, id } = comment;
  const { user: userData } = useUserStore();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const toggleLikeMutation = useMutation({
    mutationFn: () => api.post(`/comments/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-detail", slug] });
      toast.info(comment.isLiked ? "Comment Unliked" : "Comment Liked");
    },
  });

  const isOwnComment = userData?.id === user.id;

  return (
    <div className="group flex gap-4">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={user.profile.avatarUrl ?? ""} />
        <AvatarFallback>{getInitials(user.profile.displayName)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold hover:underline cursor-pointer">
              {user.profile.displayName}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              {isEdited && " • Edited"}
            </span>
          </div>

          {isOwnComment && (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteComment}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      updateComment(editContent);
                      setIsEditing(false);
                    }}
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-15 bg-accent resize-none border p-2 text-sm md:text-base focus-visible:ring-1"
          />
        ) : (
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed wrap-break-words">
            {content}
          </p>
        )}

        <div className="flex items-center justify-between w-full gap-6 pt-1">
          <button
            onClick={() => toggleLikeMutation.mutate()}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isLiked
                ? "text-red-500"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={toggleLikeMutation.isPending}
          >
            {toggleLikeMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            )}
            {_count.likes}
          </button>
          <ReportButton
            commentId={comment.id}
            reportedUserId={comment.user.id}
          />
        </div>
      </div>
    </div>
  );
}

function NoCommentsPlaceholder() {
  return (
    <div className="text-center py-10">
      <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground">
        No responses yet. Be the first to share your thoughts!
      </p>
    </div>
  );
}
