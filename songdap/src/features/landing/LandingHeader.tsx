import Image from "next/image";
import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="flex flex-1 flex-col items-center justify-center gap-10">
      <Link href="/" aria-label="Go to homepage"> {/* 메인페이지로 다시 돌아오기*/}
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
      </Link>
    </header>
  );
}

