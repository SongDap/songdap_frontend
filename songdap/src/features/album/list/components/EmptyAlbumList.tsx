// components/EmptyAlbumList.tsx
import Image from "next/image";
import { AddAlbumCard } from "./AddAlbumCard";

export function EmptyAlbumList() {
  return (
    <div className="mt-16 w-full flex flex-col items-center gap-24">
      {/* 선반 2개 */}
      <div className="relative h-[56px] w-full max-w-[640px]">
        <Image src="/images/listLine.png" alt="shelf top" fill className="object-contain" priority />
      </div>
      <div className="relative h-[56px] w-full max-w-[640px]">
        <Image src="/images/listLine.png" alt="shelf bottom" fill className="object-contain" />
      </div>

    </div>
  );
}