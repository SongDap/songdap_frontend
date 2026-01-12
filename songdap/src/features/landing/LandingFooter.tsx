import Image from "next/image";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="w-full px-6 py-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center text-gray-700">

        <hr className="w-full border-gray-300" />

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

        <small className="text-xs text-gray-500 leading-relaxed">
          Copyright © songdap. All rights reserved.
        </small>

      </div>
    </footer>

  );
}
