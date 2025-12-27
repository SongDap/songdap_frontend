"use client";

import { useEffect, useState, useRef } from "react";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import { FaComment, FaLink } from "react-icons/fa";
import LP from "@/shared/ui/LP";
import { AlbumCoverWithLP } from "@/shared/ui";
import { COLORS, FONTS, TEXT_SIZES, SPACING, ALBUM_AREA, TEXT_STYLES, MESSAGE_STYLE, responsive } from "./constants";

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
  coverColor = COLORS.WHITE,
  coverImageUrl,
}: AlbumAreaProps) {
  const [lpSize, setLpSize] = useState(250);
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // LP 크기 업데이트
  useEffect(() => {
    const updateLpSize = () => {
      const albumAreaHeight = (270 * window.innerHeight) / 1024;
      setLpSize(Math.round(albumAreaHeight - 20));
    };

    updateLpSize();
    window.addEventListener('resize', updateLpSize);
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
        height: step === 5 ? 'auto' : ALBUM_AREA.HEIGHT,
        paddingTop: step === 5 ? responsive.vh(40) : SPACING.LP_PADDING,
        paddingBottom: step === 5 ? responsive.vh(40) : SPACING.LP_PADDING,
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
          width: step === 5 ? 'auto' : ALBUM_AREA.LP_SIZE,
          height: step === 5 ? 'auto' : ALBUM_AREA.LP_SIZE,
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
            lpCircleColor={coverColor}
            lpCircleImageUrl={coverImageUrl}
            lpSize={Math.round(lpSize * (225 / 250))}
            coverSize={lpSize}
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
            marginTop: responsive.vh(30),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: responsive.vh(15),
            width: "100%",
          }}
        >
          {/* 공개여부, 노래 개수 태그 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isPublic && (
              <div
                style={{
                  padding: "5px 10px",
                  border: "3px solid #000000",
                  borderRadius: "20px",
                  backgroundColor: COLORS.WHITE,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: "calc(25 * min(100vw, 768px) / 768)",
                  color: COLORS.BLACK,
                  boxSizing: "border-box",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {isPublic === "public" ? <HiLockOpen size={16} /> : <HiLockClosed size={16} />}
                <span>{isPublic === "public" ? "공개" : "비공개"}</span>
              </div>
            )}
            {songCount > 0 && (
              <div
                style={{
                  padding: "5px 10px",
                  border: "3px solid #000000",
                  borderRadius: "20px",
                  backgroundColor: COLORS.WHITE,
                  fontFamily: FONTS.KYOBO_HANDWRITING,
                  fontSize: "calc(25 * min(100vw, 768px) / 768)",
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
              gap: responsive.vh(16),
              marginTop: responsive.vh(20),
              width: "100%",
              justifyContent: "center",
            }}
          >
            {/* 카카오톡에 공유하기 */}
            <button
              onClick={() => {
                // TODO: 카카오톡 공유 기능 구현
                console.log("카카오톡 공유");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: responsive.vh(8),
                padding: `${responsive.vh(12)} ${responsive.vh(24)}`,
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
                  // TODO: 복사 완료 알림 표시
                  console.log("링크 복사 완료:", currentUrl);
                } catch (err) {
                  console.error("링크 복사 실패:", err);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: responsive.vh(8),
                padding: `${responsive.vh(12)} ${responsive.vh(24)}`,
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
              ? `calc(${SPACING.SIDE_PADDING} + ${lpSize}px + ${lpSize * (225 / 250) / 2}px + ${responsive.min(10, 768)})`
              : `calc(${SPACING.SIDE_PADDING} + ${ALBUM_AREA.LP_SIZE} + ${LP_SPACING})`,
            top: SPACING.LP_PADDING,
            width: maxStepReached >= 4
              ? `calc(100% - ${SPACING.SIDE_PADDING} * 2 - ${lpSize}px - ${lpSize * (225 / 250) / 2}px - ${responsive.min(10, 768)})`
              : `calc(100% - ${SPACING.SIDE_PADDING} * 2 - ${ALBUM_AREA.LP_SIZE} - ${LP_SPACING})`,
            height: ALBUM_AREA.LP_SIZE,
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
                    fontSize: 'calc(25 * min(100vw, 768px) / 768)',
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
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                {isPublic && (
                  <div
                    style={{
                      padding: '5px 10px',
                      border: '3px solid #000000',
                      borderRadius: '20px',
                      backgroundColor: COLORS.WHITE,
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: 'calc(25 * min(100vw, 768px) / 768)',
                      color: COLORS.BLACK,
                      boxSizing: 'border-box',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {isPublic === "public" ? <HiLockOpen size={16} /> : <HiLockClosed size={16} />}
                    <span>{isPublic === "public" ? "공개" : "비공개"}</span>
                  </div>
                )}
                {songCount > 0 && (
                  <div
                    style={{
                      padding: '5px 10px',
                      border: '3px solid #000000',
                      borderRadius: '20px',
                      backgroundColor: COLORS.WHITE,
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: 'calc(25 * min(100vw, 768px) / 768)',
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

