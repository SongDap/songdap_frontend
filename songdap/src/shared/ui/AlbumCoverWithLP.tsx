"use client";

import Image from "next/image";
import LP from "./LP";

interface AlbumCoverWithLPProps {
  coverImageUrl?: string;
  coverColor?: string;
  lpCircleColor?: string;
  lpCircleImageUrl?: string;
  lpSize?: number;
  coverSize?: number;
}

export default function AlbumCoverWithLP({
  coverImageUrl,
  coverColor = "#ffffff",
  lpCircleColor,
  lpCircleImageUrl,
  lpSize = 225,
  coverSize = 250,
}: AlbumCoverWithLPProps) {
  // 앨범 커버의 왼쪽 끝을 기준으로 위치 조정
  // 앨범 커버의 오른쪽 끝이 LP의 중심에 오도록 위치 계산
  // LP 중심: lpSize / 2
  // 앨범 커버 오른쪽 끝이 LP 중심에 오려면: left = lpSize / 2 - coverSize
  const coverLeft = lpSize / 2 - coverSize;
  
  // 컨테이너는 앨범 커버 전체를 포함할 수 있도록 크기 조정
  // 앨범 커버의 왼쪽 끝이 컨테이너의 왼쪽 끝에 오도록 조정
  // coverLeft가 음수이면 앨범 커버가 LP 왼쪽으로 나가므로 그만큼 컨테이너가 커져야 함
  const containerWidth = coverLeft < 0 
    ? Math.max(lpSize, coverSize + Math.abs(coverLeft))
    : Math.max(lpSize, coverLeft + coverSize);
  const containerHeight = Math.max(lpSize, coverSize);
  
  // 앨범 커버의 왼쪽 끝이 컨테이너의 왼쪽 끝에 오도록 LP 위치 조정
  const lpLeft = coverLeft < 0 ? Math.abs(coverLeft) : 0;
  
  return (
    <div
      className="relative"
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {/* LP - 하단 정렬 기준 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: lpLeft,
          width: lpSize,
          height: lpSize,
        }}
      >
        <LP 
          circleColor={lpCircleColor || coverColor} 
          circleImageUrl={lpCircleImageUrl || coverImageUrl}
          size={lpSize} 
        />
      </div>

      {/* 앨범 커버 - LP 위에 위치, 왼쪽 끝이 컨테이너 왼쪽에 맞춤, 하단 정렬 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: coverSize,
          height: coverSize,
          backgroundColor: coverColor,
          border: "2.5px solid #000",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt="Album cover"
            width={coverSize}
            height={coverSize}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: coverColor,
            }}
          />
        )}
      </div>
    </div>
  );
}

