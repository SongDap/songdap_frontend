// components/AddAlbumButton.tsx
import Link from "next/link";

export function AddAlbumCard() {
  return (
    <Link
      href="/album/create"
      className="
        inline-flex items-center gap-3
        text-[18px] font-semibold text-black
        hover:opacity-80
      "
    >
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-black bg-white leading-none"
        aria-hidden
      >
        <span className="flex items-center justify-center h-full w-full">+</span>
      </span>

      <span>앨범 추가</span>
    </Link>
  );
}
