import type { UserInfo } from "@/features/oauth/model/types";

export type ProfileResponse = UserInfo;

export type UpdateProfileRequest = {
  nickname: string;
  email?: string;
  profileImage?: string;
};

