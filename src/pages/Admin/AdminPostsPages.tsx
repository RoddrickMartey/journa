import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Ban,
  RotateCcw,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { isAxiosError } from "axios";

interface Post {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  createdAt: string;
  suspended: boolean;
  isDeleted: boolean;
  published: boolean;
  author: {
    username: string;
    profile: { displayName: string; avatarUrl: string | null };
  };
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

function AdminPostsPages() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  // 1. Fetch Posts
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["admin-posts", page, debouncedSearch],
    queryFn: async () => {
      const res = await api.get("/admin-fetch/posts", {
        params: { page, q: debouncedSearch, limit: 10 },
      });
      return res.data;
    },
  });

  // 2. Post Suspension/Unsuspension Mutation
  const postActionMutation = useMutation({
    mutationFn: async ({
      postId,
      currentlySuspended,
    }: {
      postId: string;
      currentlySuspended: boolean;
    }) => {
      const action = currentlySuspended ? "unsuspend" : "suspend";
      setLoadingPostId(postId);

      return api.post(`/admin-suspension/posts/${postId}/${action}`);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-posts"],
      });

      toast.success(
        variables.currentlySuspended
          ? "Post has been successfully unsuspended"
          : "Post has been successfully suspended",
      );
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update post status",
        );
      }
    },

    onSettled: () => {
      setLoadingPostId(null);
    },
  });

  console.log(data?.posts[0]);

  return (
    <div className="p-6 space-y-6 w-3/4 mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Post Management</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search titles or authors..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : data?.posts.length ? (
                  data.posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-75">
                        <div className="flex flex-col">
                          <span className="font-medium truncate">
                            {post.title}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            /{post.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={post.author.profile.avatarUrl || ""}
                            />
                            <AvatarFallback>
                              {post.author.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            @{post.author.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {post.suspended ? (
                            <Badge variant="destructive">Suspended</Badge>
                          ) : post.isDeleted ? (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              User Deleted
                            </Badge>
                          ) : post.published ? (
                            <Badge className="bg-green-600">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* THE SUSPEND / UNSUSPEND BUTTON */}
                        <Button
                          variant={post.suspended ? "outline" : "destructive"}
                          size="sm"
                          className="min-w-25"
                          disabled={
                            postActionMutation.isPending &&
                            loadingPostId === post.id
                          }
                          onClick={() =>
                            postActionMutation.mutate({
                              postId: post.id,
                              currentlySuspended: post.suspended,
                            })
                          }
                        >
                          {postActionMutation.isPending &&
                          loadingPostId === post.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                          ) : post.suspended ? (
                            <RotateCcw className="h-3.5 w-3.5 mr-2" />
                          ) : (
                            <Ban className="h-3.5 w-3.5 mr-2" />
                          )}

                          {post.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {data?.pagination.page} of {data?.pagination.totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data?.pagination.totalPages || 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPostsPages;
