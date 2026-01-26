"use client";

import { useCallback, useMemo, useState } from "react";
import { isNicknameValid, isProfileImageValid } from "../utils/validator";

type UseProfileFormOptions = {
  initialNickname?: string;
  initialProfileImage?: string;
};

export function useProfileForm(options: UseProfileFormOptions = {}) {
  const [nickname, setNickname] = useState(options.initialNickname || "");
<<<<<<< HEAD
  const [profileImageDataUrl, setProfileImageDataUrl] = useState(
    options.initialProfileImage || ""
  );

  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);
=======
  const [profileImageDataUrl, setProfileImageDataUrl] = useState("");
  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);

>>>>>>> 596d664 (회원탈퇴 api추가 연결, 프로필이미지 편집 axios 수정)
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
<<<<<<< HEAD
    setIsProfileImageChanged(true);

=======

    setIsProfileImageChanged(true);
>>>>>>> 596d664 (회원탈퇴 api추가 연결, 프로필이미지 편집 axios 수정)
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
<<<<<<< HEAD
  
    return (
      nickname.trim() !== initialNickname.trim() ||
      isProfileImageChanged
    );
  }, [nickname, isProfileImageChanged, options.initialNickname])
=======
    return nickname.trim() !== initialNickname.trim() || isProfileImageChanged;
  }, [nickname, isProfileImageChanged, options.initialNickname]);
>>>>>>> 596d664 (회원탈퇴 api추가 연결, 프로필이미지 편집 axios 수정)

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

