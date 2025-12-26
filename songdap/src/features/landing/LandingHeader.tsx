import Image from "next/image";

export default function LandingHeader() {
  return (
    <header className="flex flex-1 flex-col items-center justify-center gap-10">
      <Image
        src="/images/logo_name.png"
        alt="Songdap logo"
        width={320}
        height={64}
        priority
        className="
          w-[37vw]
          max-w-[320px]
          min-w-[240px]
          h-auto
        "
      />
    </header>
  );
}

