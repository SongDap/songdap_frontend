import SignupForm from "@/features/signup/SignupForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden flex items-center justify-center px-4 py-10">
      {/* 배경 이미지 */}
      <Image
        src="/images/mainBackground.png"
        alt="backgroundimage"
        fill
        priority
        className="object-cover object-center -z-10 pointer-events-none"
      />

      {/* 내용 (배경 위로) */}
      <section className="relative z-10 w-full flex items-center justify-center">
        <SignupForm />
      </section>
    </main>
  );
}
