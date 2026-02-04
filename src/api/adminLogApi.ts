import { api } from "@/lib/axios";

export type LogAction =
  | "UPDATE_PROFILE"
  | "SUSPEND_USER"
  | "ACTIVATE_USER"
  | "RESTORE_USER"
  | "DELETE_POST"
  | "RESTORE_POST"
  | "CREATE_CATEGORY"
  | "DELETE_CATEGORY"
  | "OTHER";

export interface LogActor {
  id: string;
  adminId: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export interface Log {
  id: string;
  actor: LogActor;
  action: LogAction;
  description: string;
  meta: Record<string, unknown>;
  createdAt: string; // ISO string from API
}

export interface LogStats {
  totalLogs: number;
  adminLogs: number;
}

const BASE_URL = "/logs";

/**
 * Extract logs array from API response
 */
const extractLogs = (res: { data?: { logs?: Log[] } }): Log[] => res.data?.logs ?? [];

export const allAdminLogs = async (): Promise<Log[]> => {
  const res = await api.get(`${BASE_URL}/`);
  return extractLogs(res);
};

export const adminLogStats = async (): Promise<LogStats> => {
  const res = await api.get(`${BASE_URL}/stats`);
  return res.data;
};

export const adminMyLogs = async (): Promise<Log[]> => {
  const res = await api.get(`${BASE_URL}/my-logs`);
  return extractLogs(res);
};

export const adminLogsByAction = async (
  action: LogAction
): Promise<Log[]> => {
  const res = await api.get(`${BASE_URL}/action/${action}`);
  return extractLogs(res);
};

export const adminLogsByAdminId = async (
  adminId: string
): Promise<Log[]> => {
  const res = await api.get(`${BASE_URL}/admin/${adminId}`);
  return extractLogs(res);
};

export const adminLogById = async (logId: string): Promise<Log> => {
  const res = await api.get(`${BASE_URL}/${logId}`);
  return res.data; // single log, not array
};
