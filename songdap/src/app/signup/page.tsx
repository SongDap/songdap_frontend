import SignupForm from "@/features/signup/SignupForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden">      {/* 배경 이미지 */}
      <Image
        src="/images/mainBackground.png"
        alt="backgroundimage"
        fill
        priority
        className="object-cover object-center -z-10 pointer-events-none"
      />

      {/* 내용 (배경 위로) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[600px] flex-col">

        <main className="w-full max-w-[600px] flex flex-col items-center justify-start pt-10 pb-10">
          <SignupForm />
        </main>
      </div>
    </div>
  );
}
