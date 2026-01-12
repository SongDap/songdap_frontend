// hooks/useSignupForm.ts
import { useState } from "react";
import { validateNickname, validateAgreement } from "../utils/signupUtils";
import { MAX_NICK } from "../constants";

export function useSignupForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const nicknameLen = nickname.length;

  const canSubmit =
    nickname.trim().length > 0 &&
    nickname.trim().length <= MAX_NICK &&
    agreed &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nicknameError = validateNickname(nickname);
    if (nicknameError) {
      alert(nicknameError);
      return;
    }

    const agreementError = validateAgreement(agreed);
    if (agreementError) {
      alert(agreementError);
      return;
    }

    try {
      setIsSubmitting(true);

      // await signup -> 나중에 api올 곳 이 주석에 바로 쓰면 됨

      setShowModal(true);
      console.log("=== 계정 생성, 회원가입 성공 ===");
    } catch (error) {
      console.error("===회원가입 실패===");
      alert("회원가입에 실패했어요ㅠㅠ 다시 시도해주세요");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    nickname,
    setNickname,
    email,
    setEmail,
    agreed,
    setAgreed,
    isSubmitting,
    showModal,
    setShowModal,
    nicknameLen,
    canSubmit,
    handleSubmit,
  };
}