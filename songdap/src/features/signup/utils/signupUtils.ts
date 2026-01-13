// utils/signupUtils.ts
import { MAX_NICK } from "../constants";

export function validateNickname(nickname: string): string | null {
  if (!nickname.trim()) {
    return "닉네임을 입력해주세요";
  }
  if (nickname.trim().length > MAX_NICK) {
    return `닉네임은 최대 ${MAX_NICK}까지 가능합니다.`;
  }
  return null;
}

export function validateAgreement(agreed: boolean): string | null {
  if (!agreed) {
    return "이용약관 및 개인정보에 동의해주세요";
  }
  return null;
}