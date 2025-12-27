"use client";

import { useEffect, useState, useRef } from "react";
import LP from "@/shared/ui/LP";

interface AlbumAreaProps {
  albumName?: string;
  albumDescription?: string;
}

// 상수 정의
const MESSAGE_TEXT_SIZE = 'calc(30 * min(100vw, 768px) / 768)';
const LP_SIZE_STYLE = 'clamp(calc(200 * 100vh / 1024), calc(250 * 100vh / 1024), calc(300 * 100vh / 1024))';
const ALBUM_TEXT_SIZE = 'calc(35 * min(100vw, 768px) / 768)';
const LP_PADDING = 'calc(10 * 100vh / 1024)';
const LP_SPACING = 'calc(30 * min(100vw, 768px) / 768)';

export default function AlbumArea({ albumName = "", albumDescription = "" }: AlbumAreaProps) {
  const [lpSize, setLpSize] = useState(250);
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLpSize = () => {
      const vh = window.innerHeight;
      const baseSize = (250 * vh) / 1024;
      const minSize = (200 * vh) / 1024;
      const maxSize = (300 * vh) / 1024;
      const calculatedSize = Math.max(minSize, Math.min(maxSize, baseSize));
      setLpSize(Math.round(calculatedSize));
    };

    updateLpSize();
    window.addEventListener('resize', updateLpSize);
    return () => window.removeEventListener('resize', updateLpSize);
  }, []);

  useEffect(() => {
    const textContainer = textScrollRef.current;
    const content = contentRef.current;
    if (!textContainer) return;

    let rafId: number | null = null;

    const updateScroll = () => {
      setContainerHeight(textContainer.clientHeight);
      if (content) {
        const rect = content.getBoundingClientRect();
        const totalHeight = rect.height;
        setContentHeight(totalHeight);
        
        // 스크롤 범위를 넘은 영역까지만 제한
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
  }, [albumName, albumDescription]);

  const hasContent = albumName.trim().length > 0 || albumDescription.trim().length > 0;
  const messageLeft = `calc(${LP_SIZE_STYLE} + ${LP_SPACING})`;
  const contentMaxWidth = `calc(100% - ${LP_SIZE_STYLE} - ${LP_SPACING})`;
  const albumAreaHeight = `calc(${LP_SIZE_STYLE} + ${LP_PADDING})`;
  const shouldScroll = contentHeight > containerHeight && containerHeight > 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: albumAreaHeight,
      }}
    >
      {/* LP - 고정 위치 */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: `calc(50% - ${LP_SIZE_STYLE} / 2)`,
          width: LP_SIZE_STYLE,
          height: LP_SIZE_STYLE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <LP size={lpSize} circleColor="#ffffff" />
      </div>

      {/* 텍스트 영역 - 스크롤 가능 */}
      <div
        ref={textScrollRef}
        className="album-area-scroll"
        style={{
          position: 'absolute',
          left: messageLeft,
          top: '0',
          width: contentMaxWidth,
          height: '100%',
          overflowY: shouldScroll ? 'auto' : 'hidden',
          overflowX: 'hidden',
        }}
      >
        {!hasContent ? (
          <div
            className="font-[var(--font-galmuri9)]"
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              transform: 'translateY(-50%)',
              padding: '10px',
              border: '1px solid #000000',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              fontSize: MESSAGE_TEXT_SIZE,
              maxWidth: '100%',
              maxHeight: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              textAlign: 'center',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4',
              boxSizing: 'border-box',
            }}
          >
            앨범명과 설명을 채워주세요
          </div>
        ) : (
          <div
            ref={contentRef}
            style={{
              wordWrap: 'break-word',
            }}
          >
            {albumName.trim().length > 0 && (
              <div
                style={{
                  fontSize: ALBUM_TEXT_SIZE,
                  fontFamily: 'var(--font-kyobo-handwriting)',
                  marginBottom: 'calc(10 * 100vh / 1024)',
                }}
              >
                앨범명: {albumName}
              </div>
            )}
            {albumDescription.trim().length > 0 && (
              <div
                style={{
                  fontSize: ALBUM_TEXT_SIZE,
                  fontFamily: 'var(--font-kyobo-handwriting)',
                }}
              >
                앨범설명: {albumDescription}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

