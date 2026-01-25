"use client";

import { useState, useMemo, useCallback } from "react";
import { isEmailValid, isSignupValid } from "../utils/signupValidator";

export function useSignupForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageDataUrl, setProfileImageDataUrl] = useState("");
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const setProfileImage = useCallback((file: File | null) => {
    if (!file) {
      setProfileImageDataUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileImageDataUrl("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImageDataUrl(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  }, []);

  const toggleAll = useCallback(() => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeAge(next);
    setAgreeTerms(next);
  }, [agreeAll]);

  const toggleAge = useCallback(() => {
    const next = !agreeAge;
    setAgreeAge(next);
    setAgreeAll(next && agreeTerms);
  }, [agreeAge, agreeTerms]);

  const toggleTerms = useCallback(() => {
    const next = !agreeTerms;
    setAgreeTerms(next);
    setAgreeAll(next && agreeAge);
  }, [agreeTerms, agreeAge]);

  const isValid = useMemo(
    () => isSignupValid(nickname, email, agreeAge, agreeTerms),
    [nickname, email, agreeAge, agreeTerms]
  );

  const isEmailOk = useMemo(() => isEmailValid(email), [email]);

  return {
    nickname,
    email,
    profileImageDataUrl,
    agreeAll,
    agreeAge,
    agreeTerms,
    setNickname,
    setEmail,
    setProfileImage,
    toggleAll,
    toggleAge,
    toggleTerms,
    isValid,
    isEmailOk,
  };
}

