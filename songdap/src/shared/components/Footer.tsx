import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full px-6 py-10 bg-white border-t border-gray-200">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 text-center text-gray-700">



        <Link
          href="https://www.instagram.com/songdap_official/"
          target="_blank"
          aria-label="노답 인스타그램"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <FaInstagram className="w-7 h-7 text-gray-700" />
        </Link>

        <small className="text-xs text-gray-500 leading-relaxed">
          Copyright © songdap. All rights reserved.
        </small>

      </div>
    </footer>
  );
}
