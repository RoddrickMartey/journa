import { api } from "@/lib/axios";
import type { UserPublicProfile } from "@/types/user";

export const fetchUserPublicProfile = async (username: string) => {
  const res = await api.get<UserPublicProfile>(
    `/user/public-profile/${username}`,
  );
  return res.data;
};
