"use client";

import Image from "next/image";
import LP from "./LP";

/**
 * 폰트 상수
 * - KYOBO_HANDWRITING: 교보 손글씨체 (태그)
 * - CAFE24_PROSLIM: 카페24 프로 슬림 (닉네임)
 * - CAFE24_SSURROUND: 카페24 써라운드 (앨범명, 날짜)
 */
const FONTS = {
  KYOBO_HANDWRITING: 'var(--font-kyobo-handwriting)',
  CAFE24_PROSLIM: 'var(--font-cafe24-proslim)',
  HSS_AEMAEUL: 'var(--font-hssaemaeul)',
  CAFE24_SSURROUND: 'var(--font-cafe24-ssurround)',
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
  /** 하단에 표시할 커스텀 콘텐츠 (닉네임 태그, 기타 정보 등) */
  bottomContent?: React.ReactNode;
  date?: string;
  showCoverText?: boolean;
}

/**
 * 앨범 커버와 LP를 함께 표시하는 컴포넌트
 * 
 * @description
 * - LP는 앨범 커버 뒤에 배치되며, 커버의 오른쪽 끝이 LP 중심에 오도록 위치
 * - step 5에서는 앨범명, 닉네임, 날짜가 앨범 커버 위에 표시됨
 * - 하단에 18% padding을 두어 세모 띠 공간 확보
 */
export default function AlbumCoverWithLP({
  coverImageUrl,
  coverColor = "#ffffff",
  lpCircleColor,
  lpCircleImageUrl,
  lpSize = 225,
  coverSize = 250,
  albumName,
  tag,
  bottomContent,
  date,
  showCoverText = false,
}: AlbumCoverWithLPProps) {
  /**
   * 색상을 어둡게 만드는 함수 (앨범 커버 테두리용)
   * @param hex - 원본 hex 색상
   * @returns 80% 어두워진 hex 색상
   */
  const getDarkerColor = (hex: string) => {
    // # 제거
    const color = hex.replace("#", "");
    // R, G, B 추출
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // 각각 20% 정도 어둡게 (최소값 0)
    const darken = (val: number) => Math.max(0, Math.min(255, Math.floor(val * 0.8)));
    
    const dr = darken(r).toString(16).padStart(2, "0");
    const dg = darken(g).toString(16).padStart(2, "0");
    const db = darken(b).toString(16).padStart(2, "0");
    
    return `#${dr}${dg}${db}`;
  };

  const borderColor = getDarkerColor(coverColor);

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
          circleColor={lpCircleColor !== undefined ? lpCircleColor : coverColor} 
          circleImageUrl={lpCircleImageUrl !== undefined ? lpCircleImageUrl : coverImageUrl}
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
          border: `5px solid ${borderColor}`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: showCoverText ? "flex-start" : "center",
          zIndex: 10,
          padding: showCoverText ? `${coverSize * 0.05}px ${coverSize * 0.06}px ${coverSize * 0.18}px ${coverSize * 0.06}px` : 0,
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
                {/* 상단: 태그 & 앨범명 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${coverSize * 0.02}px`,
                    width: "100%",
                    maxHeight: "65%",
                  }}
                >
                  {tag && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        padding: `${coverSize * 0.02}px ${coverSize * 0.03}px`,
                        border: "2px solid #000",
                        borderRadius: `${coverSize * 0.04}px`,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        fontFamily: FONTS.KYOBO_HANDWRITING,
                        fontSize: `${coverSize * 0.10}px`,
                        color: "#000",
                      }}
                    >
                      {tag}
                    </div>
                  )}
                  {albumName && (
                    <div
                      className="album-title-scroll"
                      style={{
                        fontFamily: FONTS.CAFE24_SSURROUND,
                        fontSize: `${coverSize * 0.12}px`,
                        color: "#000",
                        fontWeight: "900",
                        WebkitTextStroke: "2px #ffffff",
                        paintOrder: "stroke fill",
                        textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
                        wordBreak: "break-word",
                        overflowY: "auto",
                        maxHeight: `${coverSize * 0.45}px`,
                        lineHeight: "1.2",
                        paddingTop: `${coverSize * 0.01}px`,
                      }}
                    >
                      {albumName}
                    </div>
                  )}
                </div>
                
                {/* 하단: 커스텀 콘텐츠 (닉네임 등), 날짜 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${coverSize * 0.02}px`,
                    width: "100%",
                    marginBottom: 0,
                  }}
                >
                  {/* 커스텀 콘텐츠 슬롯 (재사용 가능) */}
                  {bottomContent}
                  
                  {/* 날짜 */}
                  {date && (
                    <div
                      style={{
                        fontFamily: FONTS.CAFE24_SSURROUND,
                        fontSize: `${coverSize * 0.08}px`,
                        color: "#000",
                        fontWeight: "900",
                        WebkitTextStroke: "1.5px #ffffff",
                        paintOrder: "stroke fill",
                        textShadow: "0 0 2px rgba(255, 255, 255, 0.9)",
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
                  padding: `${coverSize * 0.05}px ${coverSize * 0.06}px ${coverSize * 0.18}px ${coverSize * 0.06}px`,
                  boxSizing: "border-box",
                }}
              >
                {/* 상단: 태그 & 앨범명 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${coverSize * 0.02}px`,
                    width: "100%",
                    maxHeight: "65%",
                  }}
                >
                  {tag && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        padding: `${coverSize * 0.02}px ${coverSize * 0.03}px`,
                        border: "2px solid #000",
                        borderRadius: `${coverSize * 0.04}px`,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        fontFamily: FONTS.KYOBO_HANDWRITING,
                        fontSize: `${coverSize * 0.10}px`,
                        color: "#000",
                      }}
                    >
                      {tag}
                    </div>
                  )}
                  {albumName && (
                    <div
                      className="album-title-scroll"
                      style={{
                        fontFamily: FONTS.CAFE24_SSURROUND,
                        fontSize: `${coverSize * 0.12}px`,
                        color: "#000",
                        fontWeight: "900",
                        WebkitTextStroke: "2px #ffffff",
                        paintOrder: "stroke fill",
                        textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
                        wordBreak: "break-word",
                        overflowY: "auto",
                        maxHeight: `${coverSize * 0.45}px`,
                        lineHeight: "1.2",
                        paddingTop: `${coverSize * 0.01}px`,
                      }}
                    >
                      {albumName}
                    </div>
                  )}
                </div>
                
                {/* 하단: 커스텀 콘텐츠 (닉네임 등), 날짜 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${coverSize * 0.02}px`,
                    width: "100%",
                    marginBottom: 0,
                  }}
                >
                  {/* 커스텀 콘텐츠 슬롯 (재사용 가능) */}
                  {bottomContent}
                  
                  {/* 날짜 */}
                  {date && (
                    <div
                      style={{
                        fontFamily: FONTS.CAFE24_SSURROUND,
                        fontSize: `${coverSize * 0.08}px`,
                        color: "#000",
                        fontWeight: "900",
                        WebkitTextStroke: "1.5px #ffffff",
                        paintOrder: "stroke fill",
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

