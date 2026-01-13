// components/AlbumShelf.tsx
import type { ReactNode } from "react";
import Image from "next/image";
import { AlbumCoverWithLP } from "@/shared/ui";
import { AlbumInfoButton } from "@/features/song";
import type { AlbumData } from "@/features/song/components/types";

interface AlbumShelfProps {
  items: AlbumData[];
  shelfKey: string;
  onOpenModal: (album: AlbumData) => void;
}

export function AlbumShelf({ items, shelfKey, onOpenModal }: AlbumShelfProps) {
  const renderShelfSlots = (items: AlbumData[], shelfKey: string) => {
    const slots: ReactNode[] = [];

    // 1) 앨범들
    items.forEach((album, idx) => {
      slots.push(
        <div key={`${shelfKey}-album-${idx}`} className="flex flex-col items-center gap-2">
          <button type="button" onClick={() => onOpenModal(album)} className="cursor-pointer">
            <AlbumCoverWithLP
              coverSize={140}
              lpSize={126}
              coverColor={album.coverColor}
              lpCircleColor={album.lpColor}
              coverImageUrl={album.coverImageUrl}
              lpCircleImageUrl={album.lpCircleImageUrl}
              albumName={album.albumName}
              tag={album.categoryTag}
              date={album.createdDate}
              showCoverText={true}
            />
          </button>
          <AlbumInfoButton coverSize={140} onClick={() => onOpenModal(album)} />
        </div>
      );
    });

    // 2) 빈칸은 더미로 채워 정렬 유지
    while (slots.length < 3) {
      slots.push(<div key={`${shelfKey}-empty-${slots.length}`} className="h-[170px] w-[140px]" />);
    }

    return slots;
  };

  return (
    <section className="w-full">
      <div className="relative mx-auto w-full max-w-[640px]">
        <div className="absolute left-1/2 top-[-54px] -translate-x-1/2 flex items-end gap-6">
          {renderShelfSlots(items, shelfKey)}
        </div>

        <div className="relative h-[56px] w-full max-w-[640px]">
          <Image src="/images/listLine.png" alt={`shelf ${shelfKey}`} fill className="object-contain" priority={shelfKey === "shelf1"} />
        </div>
      </div>
    </section>
  );
}