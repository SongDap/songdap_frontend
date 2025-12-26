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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const updateScroll = () => {
      setContainerHeight(container.clientHeight);
      if (content) {
        const rect = content.getBoundingClientRect();
        const topOffset = parseFloat(getComputedStyle(content).top) || 0;
        const totalHeight = topOffset + rect.height;
        setContentHeight(totalHeight);
        
        // 스크롤 범위를 넘은 영역까지만 제한
        if (totalHeight > container.clientHeight) {
          const maxScroll = totalHeight - container.clientHeight;
          if (container.scrollTop > maxScroll) {
            container.scrollTop = maxScroll;
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
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    
    const observer = new ResizeObserver(updateScroll);
    if (content) {
      observer.observe(content);
    }
    
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScroll);
      observer.disconnect();
    };
  }, [albumName, albumDescription]);

  const hasContent = albumName.trim().length > 0 || albumDescription.trim().length > 0;
  const messageLeft = `calc(${LP_SIZE_STYLE} + ${LP_SPACING})`;
  const contentMaxWidth = `calc(100% - ${LP_SIZE_STYLE} - ${LP_SPACING})`;
  const lpBaseTop = containerHeight > 0 ? (containerHeight / 2) - (lpSize / 2) : 0;
  const shouldScroll = contentHeight > containerHeight && containerHeight > 0;
  const albumAreaHeight = `calc(${LP_SIZE_STYLE} + ${LP_PADDING})`;

  return (
    <div
      ref={scrollContainerRef}
      className="album-area-scroll"
      style={{
        position: 'relative',
        width: '100%',
        height: albumAreaHeight,
        overflowY: shouldScroll ? 'auto' : 'hidden',
      }}
    >
      {/* LP */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: containerHeight > 0 ? `${lpBaseTop}px` : `calc(50% - ${LP_SIZE_STYLE} / 2)`,
          width: LP_SIZE_STYLE,
          height: LP_SIZE_STYLE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LP size={lpSize} circleColor="#ffffff" />
      </div>

      {/* 메시지 또는 앨범명/설명 */}
      {!hasContent ? (
        <div
          className="font-[var(--font-galmuri9)]"
          style={{
            position: 'absolute',
            left: messageLeft,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '10px',
            border: '1px solid #000000',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            fontSize: MESSAGE_TEXT_SIZE,
            maxWidth: `calc(100% - ${LP_SIZE_STYLE} - ${LP_SPACING} - 20px)`,
            wordWrap: 'break-word',
            textAlign: 'center',
          }}
        >
          <div>앨범명과 설명을</div>
          <div style={{ paddingLeft: MESSAGE_TEXT_SIZE }}>채워주세요</div>
        </div>
      ) : (
        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            left: messageLeft,
            top: '0',
            maxWidth: contentMaxWidth,
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
  );
}

