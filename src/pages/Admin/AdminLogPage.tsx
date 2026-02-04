"use client";

import { useAllAdminLogs, useAdminLogStats } from "@/hooks/useLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

function AdminLogPage() {
  const { data: logsData, isLoading } = useAllAdminLogs();
  const { data: stats } = useAdminLogStats();

  // Extract logs safely
  const logs = logsData ?? [];

  return (
    <section className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        {stats && (
          <Badge variant="secondary">
            Total logs: {stats.totalLogs ?? logs.length}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Admin Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No logs found.</p>
          ) : (
            <ScrollArea className="h-125">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      {/* Admin */}
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger className="cursor-pointer font-medium">
                            {log.actor.adminId}
                          </HoverCardTrigger>
                          <HoverCardContent className="w-64 p-4 space-y-2">
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="shrink-0">
                                <img
                                  src={
                                    log.actor.avatarUrl || "/default-avatar.png"
                                  }
                                  alt={log.actor.name}
                                  className="w-16 h-16 rounded-full object-cover border border-border"
                                />
                              </div>

                              {/* Admin Info */}
                              <div className="flex flex-col">
                                <p className="text-sm font-semibold">
                                  {log.actor.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {log.actor.email}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Admin ID: {log.actor.adminId}
                                </p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>

                      {/* Action */}
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {log.action.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="max-w-75 wrap-break-word whitespace-normal">
                        {log.description}
                      </TableCell>

                      {/* Meta */}
                      <TableCell>
                        {log.meta && Object.keys(log.meta).length > 0 ? (
                          <HoverCard>
                            <HoverCardTrigger className="cursor-pointer text-sm text-blue-600">
                              View
                            </HoverCardTrigger>
                            <HoverCardContent className="max-h-64 w-80 overflow-auto">
                              <pre className="text-xs whitespace-pre-wrap">
                                {JSON.stringify(log.meta, null, 2)}
                              </pre>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-sm text-muted-foreground">
                        {format(
                          new Date(log.createdAt),
                          "EEEE, MMMM do yyyy 'at' h:mm a",
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default AdminLogPage;
