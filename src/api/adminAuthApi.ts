import { api } from "@/lib/axios";

// Public routes
export const loginAdmin = (credentials: {
  username: string;
  password: string;
}) => api.post("/admin/login", credentials);

export const createAdmin = (adminData: {
  email: string;
  password: string;
  username: string;
  name: string;
  number?: string;
  avatar?: string;
}) => api.post("/admin/create", adminData);

// Protected routes (authenticated admin required)
export const getAdminProfile = () => api.get("/admin/profile");

export const getAdminById = (adminId: string) => api.get(`/admin/${adminId}`);

export const getAllAdmins = () =>
  api.get<
    {
      number: string;
      email: string;
      name: string;
      id: string;
      adminId: string;
      avatarUrl: string;
      avatarPath: string;
    }[]
  >("/admin");

// Update routes (piece by piece)
export const updateAdminEmail = (data: { email: string }) =>
  api.put("/admin/update/email", data);

export const updateAdminUsername = (data: { username: string }) =>
  api.put("/admin/update/username", data);

export const updateAdminName = (data: { name: string }) =>
  api.put("/admin/update/name", data);

export const updateAdminNumber = (data: { number: string }) =>
  api.put("/admin/update/number", data);

export const updateAdminAvatar = (data: { avatar: string }) =>
  api.put("/admin/update/avatar", data);

// Update multiple fields at once
export const updateAdminProfile = (profileData: {
  email?: string;
  username?: string;
  name?: string;
  number?: string;
  avatar?: string;
}) => api.put("/admin/update/profile", profileData);

// Password route
export const changeAdminPassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.put("/admin/change-password", data);
