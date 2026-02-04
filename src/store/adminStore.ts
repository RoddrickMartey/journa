import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* =======================
   Types
======================= */
export interface AdminUser {
  number: string;
  id: string;
  adminId: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string;
  avatarPath: string;
}

interface AdminUserState {
  user: AdminUser | null;
  isAuthorized: boolean;

  setUser: (user: AdminUser) => void;
  updateUser: (data: Partial<AdminUser>) => void;
  logoutUser: () => void;
}

/* =======================
   Store
======================= */
export const useAdminStore = create<AdminUserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthorized: false,

      setUser: (user) =>
        set({
          user,
          isAuthorized: true,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logoutUser: () =>
        set({
          user: null,
          isAuthorized: false,
        }),
    }),
    {
      name: "admin-user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
