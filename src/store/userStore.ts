import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";
type FontSize = "SMALL" | "MEDIUM" | "LARGE";
type LineHeight = "NORMAL" | "WIDE";

interface UserProfile {
  displayName: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  nationality: string | null;
  socials: { media: string; link: string }[];
}

interface UserSettings {
  theme: ThemePreference;
  fontSize: FontSize;
  lineHeight: LineHeight;
  notifications: boolean;
}

interface User {
  id: string;
  email: string;
  active: boolean;
  suspended: boolean;
  createdAt: Date | string;
}

// This matches your backend JSON structure
interface LoginResponse {
  user: User & {
    profile: UserProfile | null;
    settings: UserSettings | null;
  };
}

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  isAuthorized: boolean;

  // Updated Action to accept the nested backend object
  setUser: (data: LoginResponse) => void;
  updateUser: (data: Partial<User>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<UserSettings>) => void;
  logoutUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      settings: null,
      isAuthorized: false,

      setUser: (data) => {
        // Destructure profile and settings out, keep the rest as user data
        const { profile, settings, ...userData } = data.user;

        set({
          user: userData, // Just core user info
          profile: profile,
          settings: settings,
          isAuthorized: true,
        });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),

      updateSettings: (data) =>
        set((state) => ({
          settings: state.settings ? { ...state.settings, ...data } : null,
        })),

      logoutUser: () =>
        set({
          user: null,
          profile: null,
          settings: null,
          isAuthorized: false,
        }),
    }),
    {
      name: "user-auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
