"use client";

import { AlbumCoverWithLP } from "@/shared/ui";
import { responsive } from "@/features/album/create/constants";
import AlbumInfoButton from "./AlbumInfoButton";

interface SongAddHeaderProps {
  nickname: string;
  albumName: string;
  coverColor: string;
  lpColor: string;
  coverImageUrl?: string;
  lpCircleImageUrl?: string;
  coverSize: number;
  lpSize: number;
  sidePadding: string;
  topPadding: string;
  onOpenModal: () => void;
}

/**
 * 노래 추가 페이지의 상단 헤더 컴포넌트
 * 닉네임 텍스트와 앨범 커버/LP를 표시
 */
export default function SongAddHeader({
  nickname,
  albumName,
  coverColor,
  lpColor,
  coverImageUrl,
  lpCircleImageUrl,
  coverSize,
  lpSize,
  sidePadding,
  topPadding,
  onOpenModal,
}: SongAddHeaderProps) {
  return (
    <div
      style={{
        position: "relative",
        paddingTop: topPadding,
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        flexShrink: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 20,
      }}
    >
      {/* 텍스트 영역 */}
      <div
        style={{
          fontFamily: "var(--font-hssaemaeul), '새마을체', sans-serif",
          fontSize: responsive.fontSize(40, 60, 70, 70),
          color: "#5088c5",
          WebkitTextStroke: "2px #000",
          lineHeight: 1.1,
          flex: 1,
          minWidth: 0,
          whiteSpace: "normal",
          wordBreak: "keep-all",
          overflowWrap: "break-word",
        }}
      >
        <div>
          <span>{nickname}</span>
          <span
            style={{
              marginLeft: responsive.sizeVw(4, 6, 6, 6),
              fontSize: responsive.fontSize(30, 50, 56, 60),
              fontFamily: "var(--font-hssaemaeul), '새마을체', sans-serif",
              color: "#000000",
              WebkitTextStroke: "0px transparent",
            }}
          >
            님의
          </span>
        </div>
        <div
          style={{
            marginTop: responsive.sizeVh(2, 4, 4, 4),
            fontSize: responsive.fontSize(30, 50, 56, 60),
            fontFamily: "var(--font-hssaemaeul), '새마을체', sans-serif",
            color: "#000000",
            WebkitTextStroke: "0px transparent",
          }}
        >
          <div>앨범에서 곡을</div>
          <div>추가해주세요~</div>
        </div>
      </div>

      {/* 앨범 커버 + LP (우측, 텍스트 하단과 정렬) */}
      <div
        style={{
          flexShrink: 0,
        }}
      >
        <AlbumCoverWithLP
          coverSize={coverSize}
          lpSize={lpSize}
          coverColor={coverColor}
          lpCircleColor={lpColor}
          coverImageUrl={coverImageUrl}
          lpCircleImageUrl={lpCircleImageUrl}
          albumName={albumName}
          tag={undefined}
          date={undefined}
          showCoverText={true}
          bottomContent={<AlbumInfoButton coverSize={coverSize} onClick={onOpenModal} />}
        />
      </div>
    </div>
  );
}

