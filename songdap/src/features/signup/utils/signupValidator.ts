export function isSignupValid(
  nickname: string,
  agreeAge: boolean,
  agreeTerms: boolean
) {
  const hasNickname = nickname.trim().length > 0;
  return hasNickname && agreeAge && agreeTerms;
}


