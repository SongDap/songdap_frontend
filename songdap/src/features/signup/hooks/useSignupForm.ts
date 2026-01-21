"use client";

import { useState, useMemo, useCallback } from "react";
import { isSignupValid } from "../utils/signupValidator";

export function useSignupForm() {
  const [nickname, setNickname] = useState("");
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
    () => isSignupValid(nickname, agreeAge, agreeTerms),
    [nickname, agreeAge, agreeTerms]
  );

  return {
    nickname,
    agreeAll,
    agreeAge,
    agreeTerms,
    setNickname,
    toggleAll,
    toggleAge,
    toggleTerms,
    isValid,
  };
}

