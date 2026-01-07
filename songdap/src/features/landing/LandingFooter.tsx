import Image from "next/image";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-black px-6 py-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center text-white">
        <p></p>
        {/* 구분선 */}
        <hr className="w-full border-white/20" />

        {/* 인스타그램 링크 */}
        <Link
          href="https://www.instagram.com/songdap_official/"
          target="_blank"
          aria-label="노답 인스타그램"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <Image
            src="/images/instaLogo.png"
            alt="Songdap Instagram"
            width={28}
            height={28}
          />
        </Link>

        {/* 카피라이트 */}
        <small className="text-xs text-white/70 leading-relaxed">
          Copyright © songdap. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
