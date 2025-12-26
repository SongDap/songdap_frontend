import Image from "next/image";

export default function LandingFooter() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10">
      <Image
        src="/kakaoLoginMain.png"
        alt="kakaoLogin"
        width={360}
        height={96}
        priority
        className="
          w-[35vw]
          max-w-[360px]
          min-w-[260px]
          h-auto
        "
      />
    </main>
  );
}
