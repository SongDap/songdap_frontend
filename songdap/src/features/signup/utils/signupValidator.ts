const EMAIL_REGEX =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function isEmailValid(email: string) {
  const trimmed = email.trim();
  if (!trimmed) return true;
  return EMAIL_REGEX.test(trimmed);
}

export function isSignupValid(
  nickname: string,
  email: string,
  agreeAge: boolean,
  agreeTerms: boolean
) {
  const hasNickname = nickname.trim().length > 0;
  const emailOk = isEmailValid(email);
  return hasNickname && emailOk && agreeAge && agreeTerms;
}


