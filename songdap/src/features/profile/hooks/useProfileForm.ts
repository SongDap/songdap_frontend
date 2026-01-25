"use client";

import { useCallback, useMemo, useState } from "react";
import { isNicknameValid, isProfileImageValid } from "../utils/validator";

type UseProfileFormOptions = {
  initialNickname?: string;
  initialProfileImage?: string;
};

export function useProfileForm(options: UseProfileFormOptions = {}) {
  const [nickname, setNickname] = useState(options.initialNickname || "");
  const [profileImageDataUrl, setProfileImageDataUrl] = useState(
    options.initialProfileImage || ""
  );

  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);
  const setProfileImage = useCallback((file: File | null) => {
    if (!file) {
      setProfileImageDataUrl("");
      setIsProfileImageChanged(false);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileImageDataUrl("");
      setIsProfileImageChanged(false);
      return;
    }
    setIsProfileImageChanged(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImageDataUrl(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  }, []);

  const isNicknameOk = useMemo(() => isNicknameValid(nickname), [nickname]);
  const isProfileImageOk = useMemo(
    () => isProfileImageValid(profileImageDataUrl),
    [profileImageDataUrl]
  );

  const isValid = useMemo(
    () => isNicknameOk && isProfileImageOk,
    [isNicknameOk, isProfileImageOk]
  );

  const isDirty = useMemo(() => {
    const initialNickname = options.initialNickname || "";
  
    return (
      nickname.trim() !== initialNickname.trim() ||
      isProfileImageChanged
    );
  }, [nickname, isProfileImageChanged, options.initialNickname])

  return {
    nickname,
    profileImageDataUrl,
    setNickname,
    setProfileImage,
    isNicknameOk,
    isProfileImageOk,
    isValid,
    isDirty,
  };
}

