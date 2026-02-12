import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderX, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmptyPosts() {
  const navigate = useNavigate();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderX />
        </EmptyMedia>
        <EmptyTitle>No Post Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any post yet. Get started by creating your first
          post.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={() => navigate("/posts/new")}>
          Create Post <Plus />
        </Button>
      </EmptyContent>
    </Empty>
  );
}
