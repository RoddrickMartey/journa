import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  ExternalLink,
  User as UserIcon,
  FileText,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Report {
  id: string;
  reason: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  message: string | null;
  createdAt: string;

  reporter: {
    id: string;
    email: string;
    username: string;
  };

  reportedUser: {
    id: string;
    username: string;
    suspended: boolean;
  } | null;

  post: {
    id: string;
    title: string;
    slug: string;
  } | null;

  comment: {
    id: string;
    content: string;
  } | null;
}

interface ReportsResponse {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

function AdminReportsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<ReportsResponse>({
    queryKey: ["admin-reports", page],
    queryFn: async () => {
      const res = await api.get("/admin-fetch/reports", {
        params: { page, limit: 10 },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const getReportTarget = (report: Report) => {
    if (report.comment)
      return {
        label: "Comment",
        icon: <MessageSquare className="h-3 w-3" />,
        color: "bg-blue-500/10 text-blue-600",
      };

    if (report.post)
      return {
        label: "Post",
        icon: <FileText className="h-3 w-3" />,
        color: "bg-purple-500/10 text-purple-600",
      };

    if (report.reportedUser)
      return {
        label: "User",
        icon: <UserIcon className="h-3 w-3" />,
        color: "bg-orange-500/10 text-orange-600",
      };

    return {
      label: "Unknown",
      icon: <UserIcon className="h-3 w-3" />,
      color: "bg-gray-500/10 text-gray-600",
    };
  };
  console.log(data);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Content Reports</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and manage reported content and users.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason & Message</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-destructive"
                    >
                      Failed to load reports.
                    </TableCell>
                  </TableRow>
                ) : data?.reports.length ? (
                  data.reports.map((report) => {
                    const target = getReportTarget(report);

                    return (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${target.color} border-none`}
                          >
                            <span className="flex items-center gap-1">
                              {target.icon} {target.label}
                            </span>
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="max-w-55">
                            <p className="font-medium text-xs uppercase text-muted-foreground">
                              {report.reason.replace(/_/g, " ")}
                            </p>
                            <p className="text-sm truncate italic text-muted-foreground">
                              {report.message || "No description"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="text-sm">
                          @{report.reporter.username}
                        </TableCell>

                        <TableCell className="text-sm">
                          {report.reportedUser ? (
                            <div className="flex flex-col">
                              <span>@{report.reportedUser.username}</span>
                              {report.reportedUser.suspended && (
                                <span className="text-[10px] text-destructive font-bold italic underline">
                                  SUSPENDED
                                </span>
                              )}
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              report.status === "PENDING"
                                ? "destructive"
                                : report.status === "REVIEWED"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-125">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {target.icon} Report Details
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Status</Label>
                                    <p className="font-medium">
                                      {report.status}
                                    </p>
                                  </div>

                                  <div>
                                    <Label>Date</Label>
                                    <p className="text-sm flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        report.createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <Label>Reporter's Context</Label>
                                  <p className="font-semibold text-destructive uppercase text-xs mb-1">
                                    Reason: {report.reason.replace(/_/g, " ")}
                                  </p>
                                  <div className="bg-muted p-3 rounded-md italic text-sm border-l-4 border-destructive/50">
                                    "{report.message || "No message provided."}"
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <Label className="mb-2 block">
                                    Source Content
                                  </Label>

                                  {report.comment && (
                                    <div className="p-3 border rounded-lg bg-blue-500/5 space-y-2">
                                      <p className="text-xs font-bold text-blue-600 uppercase">
                                        Comment Content
                                      </p>
                                      <p className="text-sm leading-relaxed italic border-t pt-2">
                                        "{report.comment.content}"
                                      </p>
                                    </div>
                                  )}

                                  {report.post && (
                                    <div className="p-3 border rounded-lg bg-purple-500/5 space-y-2">
                                      <p className="text-xs font-bold text-purple-600 uppercase">
                                        Post Details
                                      </p>
                                      <p className="text-sm font-semibold">
                                        {report.post.title}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground italic">
                                        Slug: {report.post.slug}
                                      </p>
                                    </div>
                                  )}

                                  {!report.comment &&
                                    !report.post &&
                                    report.reportedUser && (
                                      <div className="p-3 border rounded-lg bg-orange-500/5">
                                        <p className="text-xs font-bold text-orange-600 uppercase">
                                          User Account
                                        </p>
                                        <p className="text-sm font-medium">
                                          @{report.reportedUser.username}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          ID: {report.reportedUser.id}
                                        </p>
                                      </div>
                                    )}
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DialogClose>
                                <Button variant="destructive">
                                  Take Action
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No reports available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {data?.pagination.page ?? 1} of{" "}
              {data?.pagination.totalPages ?? 1}
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
              disabled={page >= (data?.pagination.totalPages ?? 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

export default AdminReportsPage;
