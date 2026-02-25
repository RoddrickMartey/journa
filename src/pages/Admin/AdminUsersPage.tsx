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

interface User {
  id: string;
  username: string;
  email: string;
  active: boolean;
  suspended: boolean;
  createdAt: string;
  profile: {
    avatarUrl: string | null;
    displayName: string;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Fetching Users
  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin-users", page, debouncedSearch],
    queryFn: async () => {
      const res = await api.get("/admin-fetch/users", {
        params: { page, q: debouncedSearch, limit: 10 },
      });
      return res.data;
    },
  });

  // Suspension Mutation
  const suspensionMutation = useMutation({
    mutationFn: async ({
      userId,
      isSuspended,
    }: {
      userId: string;
      isSuspended: boolean;
    }) => {
      const action = isSuspended ? "unsuspend" : "suspend";
      return api.post(`/admin-suspension/users/${userId}/${action}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(
        variables.isSuspended ? "User unsuspended" : "User suspended",
      );
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-3/4 mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users.length ? (
                  data.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profile.avatarUrl || ""} />
                          <AvatarFallback>
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.profile.displayName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            @{user.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        {user.suspended ? (
                          <Badge variant="destructive">Suspended</Badge>
                        ) : user.active ? (
                          <Badge variant="default" className="bg-green-600">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={user.suspended ? "outline" : "destructive"}
                          size="sm"
                          className="h-8"
                          disabled={suspensionMutation.isPending}
                          onClick={() =>
                            suspensionMutation.mutate({
                              userId: user.id,
                              isSuspended: user.suspended,
                            })
                          }
                        >
                          {suspensionMutation.isPending &&
                          suspensionMutation.variables?.userId === user.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          ) : user.suspended ? (
                            <RotateCcw className="h-3 w-3 mr-2" />
                          ) : (
                            <Ban className="h-3 w-3 mr-2" />
                          )}
                          {user.suspended ? "Unsuspend" : "Suspend"}
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
                      No users found.
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

export default AdminUsersPage;
