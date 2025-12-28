"use client";

import { useEffect, useState, useRef } from "react";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import { FaComment, FaLink } from "react-icons/fa";
import LP from "@/shared/ui/LP";
import { AlbumCoverWithLP } from "@/shared/ui";
import { COLORS, FONTS, TEXT_SIZES, SPACING, ALBUM_AREA, TEXT_STYLES, MESSAGE_STYLE, responsive } from "../constants";

interface AlbumAreaProps {
  albumName?: string;
  albumDescription?: string;
  category?: string;
  selectedTag?: string;
  situationValue?: string;
  isPublic?: string;
  songCount?: number;
  step?: number;
  maxStepReached?: number;
  lpColor?: string;
  lpCircleImageUrl?: string;
  coverColor?: string;
  coverImageUrl?: string;
}

const LP_SPACING = SPACING.LP_SPACING;

export default function AlbumArea({ 
  albumName = "", 
  albumDescription = "",
  category = "",
  selectedTag = "",
  situationValue = "",
  isPublic = "",
  songCount = 15,
  step = 1,
  maxStepReached = 1,
  lpColor = COLORS.WHITE,
  lpCircleImageUrl,
  coverColor = COLORS.WHITE,
  coverImageUrl,
}: AlbumAreaProps) {
  const [lpSize, setLpSize] = useState(250);
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // LP 크기 업데이트 (서비스 프레임 가로 길이 기준 반응형)
  useEffect(() => {
    const updateLpSize = () => {
      // 서비스 프레임 요소 찾기
      const serviceFrame = document.querySelector('.service-frame') as HTMLElement;
      if (!serviceFrame) {
        // 서비스 프레임을 찾을 수 없으면 기본값 사용
        setLpSize(250);
        return;
      }
      
      const serviceFrameWidth = serviceFrame.clientWidth;
      
      // LP 크기 계산 (서비스 프레임 가로 길이 기준)
      const minSize = 150;
      const maxSize = 250;
      let calculatedLpSize: number;
      
      // 서비스 프레임 너비에 비례하여 계산
      // 모바일: 너비의 40-50%
      // 태블릿: 너비의 30-35%
      // 데스크탑: 너비의 25-30%
      if (serviceFrameWidth <= 480) {
        // 모바일
        calculatedLpSize = Math.max(minSize, Math.min(serviceFrameWidth * 0.45, 200));
      } else if (serviceFrameWidth <= 768) {
        // 태블릿
        calculatedLpSize = Math.max(180, Math.min(serviceFrameWidth * 0.32, 220));
      } else if (serviceFrameWidth <= 1024) {
        // 노트북
        calculatedLpSize = Math.max(200, Math.min(serviceFrameWidth * 0.28, 240));
      } else {
        // 데스크탑
        calculatedLpSize = Math.max(220, Math.min(serviceFrameWidth * 0.25, maxSize));
      }
      
      setLpSize(Math.round(calculatedLpSize));
    };

    updateLpSize();
    window.addEventListener('resize', updateLpSize);
    
    // ResizeObserver로 서비스 프레임 크기 변화 감지
    const serviceFrame = document.querySelector('.service-frame') as HTMLElement;
    if (serviceFrame) {
      const resizeObserver = new ResizeObserver(updateLpSize);
      resizeObserver.observe(serviceFrame);
      
      return () => {
        window.removeEventListener('resize', updateLpSize);
        resizeObserver.disconnect();
      };
    }
    
    return () => window.removeEventListener('resize', updateLpSize);
  }, []);

  // 텍스트 스크롤 관리
  useEffect(() => {
    const textContainer = textScrollRef.current;
    const content = contentRef.current;
    if (!textContainer) return;

    let rafId: number | null = null;

    const updateScroll = () => {
      setContainerHeight(textContainer.clientHeight);
      if (content) {
        const totalHeight = content.getBoundingClientRect().height;
        setContentHeight(totalHeight);
        
        // 스크롤 범위 제한
        if (totalHeight > textContainer.clientHeight) {
          const maxScroll = totalHeight - textContainer.clientHeight;
          if (textContainer.scrollTop > maxScroll) {
            textContainer.scrollTop = maxScroll;
          }
        }
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
        });
      }
    };

    updateScroll();
    textContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    
    const observer = new ResizeObserver(updateScroll);
    if (content) {
      observer.observe(content);
    }
    
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      textContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScroll);
      observer.disconnect();
    };
  }, [
    albumName ?? '',
    albumDescription ?? '',
    category ?? '',
    selectedTag ?? '',
    situationValue ?? '',
    isPublic ?? '',
    songCount ?? 15,
  ]);

  const hasContent = albumName.trim().length > 0 || 
                     albumDescription.trim().length > 0 || 
                     (category === "mood" && selectedTag && selectedTag !== "+ 직접 입력") || 
                     (category === "situation" && situationValue) ||
                     (maxStepReached >= 3 && (isPublic || songCount > 0));
  const shouldScroll = contentHeight > containerHeight && containerHeight > 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: step === 5 ? 'auto' : `calc(${lpSize}px + clamp(16px, calc(20 * 100vh / 1024), 20px))`,
        height: step === 5 ? 'auto' : `calc(${lpSize}px + clamp(16px, calc(20 * 100vh / 1024), 20px))`,
        paddingTop: step === 5 ? 'clamp(20px, calc(40 * 100vh / 1024), 40px)' : '10px',
        paddingBottom: step === 5 ? 'clamp(20px, calc(40 * 100vh / 1024), 40px)' : 'clamp(8px, calc(10 * 100vh / 1024), 10px)',
        paddingLeft: SPACING.SIDE_PADDING,
        paddingRight: SPACING.SIDE_PADDING,
        boxSizing: 'border-box',
        display: step === 5 ? 'flex' : 'block',
        flexDirection: step === 5 ? 'column' : 'initial',
        alignItems: step === 5 ? 'center' : 'initial',
      }}
    >
      <div
        style={{
          position: step === 5 ? 'relative' : 'absolute',
          left: step === 5 ? 'auto' : SPACING.SIDE_PADDING,
          top: step === 5 ? 'auto' : SPACING.LP_PADDING,
          width: step === 5 ? 'auto' : `${lpSize}px`,
          height: step === 5 ? 'auto' : `${lpSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: step === 5 ? 'center' : (maxStepReached >= 4 ? 'flex-start' : 'center'),
          zIndex: 1,
          margin: step === 5 ? '0 auto' : '0',
        }}
      >
        {maxStepReached >= 4 ? (
          <AlbumCoverWithLP
            coverImageUrl={coverImageUrl}
            coverColor={coverColor}
            lpCircleColor={lpColor}
            lpCircleImageUrl={lpCircleImageUrl}
            lpSize={Math.round(lpSize * 0.9)} // LP는 커버보다 10% 작게
            coverSize={lpSize} // 앨범 커버는 LP와 동일한 크기 (가로세로 비율 유지)
            albumName={step === 5 ? albumName : undefined}
            tag={step === 5 ? (category === "mood" && selectedTag && selectedTag !== "+ 직접 입력" ? selectedTag : category === "situation" ? situationValue : undefined) : undefined}
            nickname={step === 5 ? "닉네임" : undefined}
            date={step === 5 ? new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
            showCoverText={step === 5}
          />
        ) : (
          <LP size={lpSize} circleColor={lpColor} />
        )}
      </div>

      {/* step5일 때 앨범 아래 정보 표시 */}
      {step === 5 && (
        <div
          style={{
            marginTop: 'clamp(15px, calc(30 * 100vh / 1024), 30px)',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 'clamp(8px, calc(15 * 100vh / 1024), 15px)',
            width: "100%",
          }}
        >
          {/* 공개여부, 노래 개수 태그 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: responsive.sizeVh(6, 10, 10, 10),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isPublic && (
              <div
                style={{
                  padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(12, 20, 20, 20),
                  backgroundColor: COLORS.WHITE,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: responsive.fontSize(16, 20, 22, 25),
                  color: COLORS.BLACK,
                  boxSizing: "border-box",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: responsive.sizeVh(4, 5, 5, 5),
                }}
              >
                {isPublic === "public" ? <HiLockOpen size={responsive.sizeVh(16, 20, 22, 25)} /> : <HiLockClosed size={responsive.sizeVh(16, 20, 22, 25)} />}
                <span>{isPublic === "public" ? "공개" : "비공개"}</span>
              </div>
            )}
            {songCount > 0 && (
              <div
                style={{
                  padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
                  border: "3px solid #000000",
                  borderRadius: responsive.sizeVh(12, 20, 20, 20),
                  backgroundColor: COLORS.WHITE,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: responsive.fontSize(16, 20, 22, 25),
                  color: COLORS.BLACK,
                  boxSizing: "border-box",
                  display: "inline-block",
                }}
              >
                {songCount}곡
              </div>
            )}
          </div>
          {/* 앨범설명 */}
          {albumDescription.trim().length > 0 && (
            <div
              style={{
                fontSize: TEXT_SIZES.ALBUM_TEXT,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                color: COLORS.BLACK,
                textAlign: "center",
                width: `${lpSize}px`,
                maxWidth: `${lpSize}px`,
                maxHeight: `calc(${TEXT_SIZES.ALBUM_TEXT} * 1.5 * 2)`,
                overflowY: "auto",
                lineHeight: "1.5",
                ...TEXT_STYLES.WORD_BREAK,
                boxSizing: "border-box",
              }}
            >
              {albumDescription}
            </div>
          )}
          
          {/* 공유 버튼 */}
          <div
            style={{
              display: "flex",
              gap: 'clamp(8px, calc(16 * 100vh / 1024), 16px)',
              marginTop: 'clamp(10px, calc(20 * 100vh / 1024), 20px)',
              width: "100%",
              justifyContent: "center",
            }}
          >
            {/* 카카오톡에 공유하기 */}
            <button
              onClick={() => {
                // 카카오톡 공유 기능 구현 예정
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 'clamp(4px, calc(8 * 100vh / 1024), 8px)',
                padding: `clamp(8px, calc(12 * 100vh / 1024), 12px) clamp(16px, calc(24 * 100vh / 1024), 24px)`,
                border: "3px solid #000000",
                borderRadius: "10px",
                backgroundColor: COLORS.WHITE,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <FaComment size={20} />
              <span>카카오톡에 공유하기</span>
            </button>
            
            {/* 링크 복사하기 */}
            <button
              onClick={async () => {
                try {
                  const currentUrl = window.location.href;
                  await navigator.clipboard.writeText(currentUrl);
                  // 복사 완료 알림 표시 예정
                } catch (err) {
                  // 에러 처리 예정
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 'clamp(4px, calc(8 * 100vh / 1024), 8px)',
                padding: `clamp(8px, calc(12 * 100vh / 1024), 12px) clamp(16px, calc(24 * 100vh / 1024), 24px)`,
                border: "3px solid #000000",
                borderRadius: "10px",
                backgroundColor: COLORS.WHITE,
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <FaLink size={20} />
              <span>링크 복사하기</span>
            </button>
          </div>
        </div>
      )}

      {step !== 5 && (
        <div
          ref={textScrollRef}
          className="album-area-scroll"
          style={{
            position: 'absolute',
            left: maxStepReached >= 4
              ? `calc(${SPACING.SIDE_PADDING} + ${lpSize}px + ${lpSize * 0.9 / 2}px + ${responsive.min(10, 768)})`
              : `calc(${SPACING.SIDE_PADDING} + ${lpSize}px + ${LP_SPACING})`,
            top: SPACING.LP_PADDING,
            width: maxStepReached >= 4
              ? `calc(100% - ${SPACING.SIDE_PADDING} * 2 - ${lpSize}px - ${lpSize * 0.9 / 2}px - ${responsive.min(10, 768)})`
              : `calc(100% - ${SPACING.SIDE_PADDING} * 2 - ${lpSize}px - ${LP_SPACING})`,
            height: `${lpSize}px`,
            overflowY: shouldScroll ? 'auto' : 'hidden',
            overflowX: 'hidden',
          }}
        >
        {!hasContent ? (
          <div style={MESSAGE_STYLE}>
            <div>앨범 정보를</div>
            <div>채워주세요</div>
          </div>
        ) : (
          <div ref={contentRef} style={TEXT_STYLES.WORD_BREAK}>
            {((category === "mood" && selectedTag && selectedTag !== "+ 직접 입력") || (category === "situation" && situationValue)) && (
              <div
                style={{
                  marginBottom: 'calc(10 * 100vh / 1024)',
                }}
              >
                <div
                  style={{
                    padding: '5px 10px',
                    border: '3px solid #000000',
                    borderRadius: '20px',
                    backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                    fontFamily: FONTS.KYOBO_HANDWRITING,
                    fontSize: TEXT_SIZES.ALBUM_TEXT,
                    color: COLORS.BLACK,
                    boxSizing: 'border-box',
                    display: 'inline-block',
                  }}
                >
                  {category === "mood" ? selectedTag : situationValue}
                </div>
              </div>
            )}
            {albumName.trim().length > 0 && (
              <div
                style={{
                  fontSize: TEXT_SIZES.ALBUM_TEXT,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  marginBottom: 'calc(10 * 100vh / 1024)',
                  color: COLORS.BLACK,
                  ...TEXT_STYLES.WORD_BREAK,
                }}
              >
                앨범명: {albumName}
              </div>
            )}
            {albumDescription.trim().length > 0 && (
              <div
                style={{
                  fontSize: TEXT_SIZES.ALBUM_TEXT,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  marginBottom: 'calc(10 * 100vh / 1024)',
                  color: COLORS.BLACK,
                  ...TEXT_STYLES.WORD_BREAK,
                }}
              >
                앨범설명: {albumDescription}
              </div>
            )}
            {maxStepReached >= 3 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: responsive.sizeVh(6, 10, 10, 10),
                  alignItems: 'center',
                }}
              >
                {isPublic && (
                  <div
                    style={{
                      padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
                      border: '3px solid #000000',
                      borderRadius: responsive.sizeVh(12, 20, 20, 20),
                      backgroundColor: COLORS.WHITE,
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: TEXT_SIZES.ALBUM_TEXT,
                      color: COLORS.BLACK,
                      boxSizing: 'border-box',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: responsive.sizeVh(4, 5, 5, 5),
                    }}
                  >
                    {isPublic === "public" ? <HiLockOpen size={responsive.sizeVh(16, 20, 22, 25)} /> : <HiLockClosed size={responsive.sizeVh(16, 20, 22, 25)} />}
                    <span>{isPublic === "public" ? "공개" : "비공개"}</span>
                  </div>
                )}
                {songCount > 0 && (
                  <div
                    style={{
                      padding: `${responsive.sizeVh(4, 5, 5, 5)} ${responsive.sizeVh(8, 10, 10, 10)}`,
                      border: '3px solid #000000',
                      borderRadius: responsive.sizeVh(12, 20, 20, 20),
                      backgroundColor: COLORS.WHITE,
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: TEXT_SIZES.ALBUM_TEXT,
                      color: COLORS.BLACK,
                      boxSizing: 'border-box',
                      display: 'inline-block',
                    }}
                  >
                    {songCount}곡
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

