import { useQuery } from "@tanstack/react-query";
import {
  allAdminLogs,
  adminLogStats,
  adminMyLogs,
  adminLogsByAction,
  adminLogsByAdminId,
  adminLogById,
} from "@/api/adminLogApi";
import type { LogAction } from "@/api/adminLogApi";

/* ------------------ Query Keys ------------------ */

export const logKeys = {
  all: ["logs"] as const,
  stats: ["logs", "stats"] as const,
  mine: ["logs", "mine"] as const,
  byAction: (action: LogAction) => ["logs", "action", action] as const,
  byAdmin: (adminId: string) => ["logs", "admin", adminId] as const,
  byId: (logId: string) => ["logs", "id", logId] as const,
};

/* ------------------ Queries ------------------ */

export const useAllAdminLogs = () =>
  useQuery({
    queryKey: logKeys.all,
    queryFn: allAdminLogs,
  });

export const useAdminLogStats = () =>
  useQuery({
    queryKey: logKeys.stats,
    queryFn: adminLogStats,
  });

export const useAdminMyLogs = () =>
  useQuery({
    queryKey: logKeys.mine,
    queryFn: adminMyLogs,
  });

export const useAdminLogsByAction = (action: LogAction) =>
  useQuery({
    queryKey: logKeys.byAction(action),
    queryFn: () => adminLogsByAction(action),
    enabled: Boolean(action),
  });

export const useAdminLogsByAdminId = (adminId: string) =>
  useQuery({
    queryKey: logKeys.byAdmin(adminId),
    queryFn: () => adminLogsByAdminId(adminId),
    enabled: Boolean(adminId),
  });

export const useAdminLogById = (logId: string) =>
  useQuery({
    queryKey: logKeys.byId(logId),
    queryFn: () => adminLogById(logId),
    enabled: Boolean(logId),
  });
