import Image from "next/image";

export default function LandingMain() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10">
      <Image
        src="/images/lp_mainpage.png"
        alt="mainpage"
        width={360}
        height={360}
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

