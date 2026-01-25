"use client";

import { useCallback, useMemo, useState } from "react";
import { isNicknameValid, isProfileImageValid } from "../utils/validator";

type UseProfileFormOptions = {
  initialNickname?: string;
  initialProfileImage?: string;
};

export function useProfileForm(options: UseProfileFormOptions = {}) {
  const [nickname, setNickname] = useState(options.initialNickname || "");
  // NOTE: 현재 백엔드는 profileImage를 URL(string)로 받음.
  // 프론트에서 파일 업로드를 URL로 변환하는 업로드 API가 없으므로,
  // 프로필 편집에서는 이미지를 변경하지 않고(카카오 프로필 URL 유지) 닉네임만 수정한다.

  const isNicknameOk = useMemo(() => isNicknameValid(nickname), [nickname]);
  const isProfileImageOk = true;

  const isValid = useMemo(
    () => isNicknameOk && isProfileImageOk,
    [isNicknameOk, isProfileImageOk]
  );

  const isDirty = useMemo(() => {
    const initialNickname = options.initialNickname || "";
  
    return (
      nickname.trim() !== initialNickname.trim()
    );
  }, [nickname, options.initialNickname])

  return {
    nickname,
    setNickname,
    isNicknameOk,
    isProfileImageOk,
    isValid,
    isDirty,
  };
}

