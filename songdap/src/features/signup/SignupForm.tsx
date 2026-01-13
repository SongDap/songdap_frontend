"use client"; // 이 컴포넌트와 그 자식들은 브라우저(클라이언트)에서 실행되어야 한다
import { useSignupForm } from "./hooks";
import {
  SignupHeader,
  NicknameInput,
  EmailInput,
  AgreementCheckbox,
  SubmitButton,
  SignupModal,
} from "./components";

export default function SignupForm() {
  const {
    nickname,
    setNickname,
    email,
    setEmail,
    agreed,
    setAgreed,
    showModal,
    setShowModal,
    nicknameLen,
    canSubmit,
    handleSubmit,
  } = useSignupForm();

  return (
    <main className="w-full px-4 pt-4 sm:pt-6 flex flex-col items-center">
      <article>
        <div className="relative z-10 mx-auto flex w-full max-w-[768px] flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-labelledby="signup-title">
            <SignupHeader />
            <NicknameInput
              nickname={nickname}
              setNickname={setNickname}
              nicknameLen={nicknameLen}
            />
            <EmailInput email={email} setEmail={setEmail} />
            <AgreementCheckbox agreed={agreed} setAgreed={setAgreed} />
            <SubmitButton canSubmit={canSubmit} />
          </form>
        </div>
      </article>
      <SignupModal showModal={showModal} setShowModal={setShowModal} />
    </main>
  );
}


