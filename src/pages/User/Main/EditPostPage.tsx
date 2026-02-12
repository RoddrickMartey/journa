import {
  getPostForEditCall,
  updateContentCall,
  type PostForEdit,
} from "@/api/postApi";
import { useParams } from "react-router-dom";
import { EditContent } from "./components/EditContent";
import { Spinner } from "@/components/ui/spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { OutputData } from "@editorjs/editorjs";
import EditPostDetails from "./components/EditPostDetails";
import { toast } from "sonner";

function EditPost() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<PostForEdit>({
    queryKey: ["post", id],
    queryFn: () => getPostForEditCall(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: saveContent, isPending: saving } = useMutation({
    mutationFn: (content: OutputData) =>
      updateContentCall(content, id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["author-post", post?.slug] });
      toast.success("Content saved");
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Spinner />
      </div>
    );
  if (isError || !post)
    return (
      <div className="text-center p-20 text-destructive">
        Error loading post.
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto bg-background min-h-screen px-4 py-6 rounded-lg flex flex-col my-10 border shadow">
      {/* NEW COMPONENT HERE */}
      <EditPostDetails post={post} postId={id as string} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Post Content</h2>
        <EditContent
          postId={id as string}
          content={post.content ?? null}
          loading={saving}
          refetch={async () => {
            await queryClient.invalidateQueries({ queryKey: ["post", id] });
          }}
          saveContent={saveContent}
        />
      </div>
    </div>
  );
}

export default EditPost;
