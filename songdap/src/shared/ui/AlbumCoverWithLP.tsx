"use client";

import Image from "next/image";
import LP from "./LP";

// 폰트 상수
const FONTS = {
  KYOBO_HANDWRITING: 'var(--font-kyobo-handwriting)',
  CAFE24_PROSLIM: 'var(--font-cafe24-proslim)',
} as const;

interface AlbumCoverWithLPProps {
  coverImageUrl?: string;
  coverColor?: string;
  lpCircleColor?: string;
  lpCircleImageUrl?: string;
  lpSize?: number;
  coverSize?: number;
  albumName?: string;
  tag?: string;
  nickname?: string;
  date?: string;
  showCoverText?: boolean;
}

export default function AlbumCoverWithLP({
  coverImageUrl,
  coverColor = "#ffffff",
  lpCircleColor,
  lpCircleImageUrl,
  lpSize = 225,
  coverSize = 250,
  albumName,
  tag,
  nickname,
  date,
  showCoverText = false,
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: showCoverText ? "flex-start" : "center",
          zIndex: 10,
          padding: showCoverText ? `${coverSize * 0.08}px ${coverSize * 0.06}px` : 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {coverImageUrl ? (
          <>
            <Image
              src={coverImageUrl}
              alt="Album cover"
              width={coverSize}
              height={coverSize}
              className="w-full h-full object-cover"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            />
            {showCoverText && (
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* 상단: 태그 */}
                {tag && (
                  <div
                    style={{
                      alignSelf: "flex-start",
                      padding: `${coverSize * 0.02}px ${coverSize * 0.03}px`,
                      border: "2px solid #000",
                      borderRadius: `${coverSize * 0.04}px`,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: `${coverSize * 0.08}px`,
                      color: "#000",
                    }}
                  >
                    {tag}
                  </div>
                )}
                
                {/* 하단: 앨범명, 닉네임, 날짜 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${coverSize * 0.02}px`,
                    width: "100%",
                  }}
                >
                  {albumName && (
                    <div
                      style={{
                        fontFamily: FONTS.KYOBO_HANDWRITING,
                        fontSize: `${coverSize * 0.12}px`,
                        color: "#000",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                        wordBreak: "break-word",
                      }}
                    >
                      {albumName}
                    </div>
                  )}
                  {nickname && (
                    <div
                      style={{
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: `${coverSize * 0.07}px`,
                        color: "#000",
                        textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {nickname}
                    </div>
                  )}
                  {date && (
                    <div
                      style={{
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: `${coverSize * 0.06}px`,
                        color: "#666",
                        textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {date}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: coverColor,
                position: "relative",
              }}
            />
            {showCoverText && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: `${coverSize * 0.08}px ${coverSize * 0.06}px`,
                  boxSizing: "border-box",
                }}
              >
                {/* 상단: 태그 */}
                {tag && (
                  <div
                    style={{
                      alignSelf: "flex-start",
                      padding: `${coverSize * 0.02}px ${coverSize * 0.03}px`,
                      border: "2px solid #000",
                      borderRadius: `${coverSize * 0.04}px`,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: `${coverSize * 0.08}px`,
                      color: "#000",
                    }}
                  >
                    {tag}
                  </div>
                )}
                
                {/* 하단: 앨범명, 닉네임, 날짜 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${coverSize * 0.02}px`,
                    width: "100%",
                  }}
                >
                  {albumName && (
                    <div
                      style={{
                        fontFamily: FONTS.KYOBO_HANDWRITING,
                        fontSize: `${coverSize * 0.12}px`,
                        color: "#000",
                        fontWeight: "bold",
                        wordBreak: "break-word",
                      }}
                    >
                      {albumName}
                    </div>
                  )}
                  {nickname && (
                    <div
                      style={{
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: `${coverSize * 0.07}px`,
                        color: "#000",
                      }}
                    >
                      {nickname}
                    </div>
                  )}
                  {date && (
                    <div
                      style={{
                        fontFamily: FONTS.CAFE24_PROSLIM,
                        fontSize: `${coverSize * 0.06}px`,
                        color: "#666",
                      }}
                    >
                      {date}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

