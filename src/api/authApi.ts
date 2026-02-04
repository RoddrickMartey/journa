import { api } from "@/lib/axios";

type SignUpPayload = {
  username: string;
  password: string;
  displayName: string;
  email: string;
};

type LogInPayload = {
  username: string;
  password: string;
};

type UserUpdateEmailPayload = {
  email: string;
};

type UserUpdateUsernamePayload = {
  username: string;
};

type UserUpdateAvatarPayload = {
  avatar: string;
};

type UserUpdateCoverPayload = {
  cover: string;
};

export const signUpUser = async (payload: SignUpPayload) => {
  try {
    const res = await api.post("/user/signup", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logInUser = async (payload: LogInPayload) => {
  try {
    const res = await api.post("/user/login", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateEmail = async (payload: UserUpdateEmailPayload) => {
  try {
    const res = await api.put("/user/update/email", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateUsername = async (
  payload: UserUpdateUsernamePayload,
) => {
  try {
    const res = await api.put("/user/update/username", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const userUpdateAvatar = async (payload: UserUpdateAvatarPayload) => {
  try {
    const res = await api.put("/user/update/avatar", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateCover = async (payload: UserUpdateCoverPayload) => {
  try {
    const res = await api.put("/user/update/cover", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateBio = async (payload: { bio: string | null }) => {
  try {
    const res = await api.put("/user/update/bio", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateNationality = async (payload: {
  nationality: string | null;
}) => {
  try {
    const res = await api.put("/user/update/nationality", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateDisplayName = async (payload: {
  displayName: string;
}) => {
  try {
    const res = await api.put("/user/update/displayname", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userUpdateSocails = async (
  payload: { media: string; link: string }[],
) => {
  try {
    const res = await api.put("/user/update/socials", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const changeUserPassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const res = await api.put("/user/change-password", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";
type FontSize = "SMALL" | "MEDIUM" | "LARGE";
type LineHeight = "NORMAL" | "WIDE";
export const userUpdateSettings = async (payload: {
  theme: ThemePreference;
  fontSize: FontSize;
  lineHeight: LineHeight;
}) => {
  try {
    const res = await api.put("/user/update/settings", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
