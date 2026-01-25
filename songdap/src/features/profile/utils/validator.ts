const MAX_NICKNAME_LENGTH = 16;

export function isNicknameValid(nickname: string) {
  const trimmed = nickname.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_NICKNAME_LENGTH;
}

export function isProfileImageValid(profileImage?: string) {
  if (!profileImage) return true;
  return profileImage.startsWith("data:image/");
}

