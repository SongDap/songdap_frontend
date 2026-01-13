"use client";

import { useEffect, useState, useRef } from "react";
import { responsive, COLORS } from "@/features/album/create/constants";
import { LP, NicknameTag } from "@/shared/ui";
import AlbumDetailSongCard from "../components/AlbumDetailSongCard";
import type { AlbumData } from "@/features/song/components/types";

interface AlbumDetailLPViewProps {
  album: AlbumData;
  lpSize: number;
  onSongClick: (index: number) => void;
  onPlayClick: (index: number) => void;
}

interface SongCardPosition {
  x: number; // LP 중심 기준 상대 위치 (%)
  y: number; // LP 중심 기준 상대 위치 (%)
}

export default function AlbumDetailLPView({ album, lpSize, onSongClick, onPlayClick }: AlbumDetailLPViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [songCardPositions, setSongCardPositions] = useState<SongCardPosition[]>([]);

  // localStorage에서 노래 카드 위치 불러오기
  useEffect(() => {
    const savedPositions = localStorage.getItem(`album-${album.albumName}-song-positions`);
    
    if (savedPositions) {
      try {
        const positions = JSON.parse(savedPositions);
        setSongCardPositions(positions);
      } catch (e) {
        console.error("위치 데이터 파싱 실패:", e);
      }
    }
  }, [album.albumName]);

  // 노래 카드 위치 저장
  const saveSongCardPosition = (index: number, x: number, y: number) => {
    const newPositions = [...songCardPositions];
    newPositions[index] = { x, y };
    setSongCardPositions(newPositions);
    localStorage.setItem(`album-${album.albumName}-song-positions`, JSON.stringify(newPositions));
  };
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* LP */}
      <LP
        circleColor={album.lpCircleImageUrl ? undefined : (album.lpColor || COLORS.WHITE)}
        circleImageUrl={album.lpCircleImageUrl}
        size={lpSize}
      />
      
      {/* 앨범명, 닉네임, 태그 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: responsive.sizeVh(8, 10, 12, 12),
          zIndex: 10,
          pointerEvents: "none",
          width: `${lpSize * 0.8}px`,
          maxWidth: `${lpSize * 0.8}px`,
        }}
      >
        {/* 앨범명 */}
        {album.albumName && (
          <div
            style={{
              fontFamily: 'var(--font-cafe24-ssurround)',
              fontSize: `${lpSize * 0.09}px`,
              color: "#000",
              fontWeight: "900",
              WebkitTextStroke: "2px #ffffff",
              paintOrder: "stroke fill",
              textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
              wordBreak: "keep-all",
              overflowWrap: "break-word",
              textAlign: "center",
              width: "100%",
              maxWidth: "100%",
              lineHeight: "1.3",
              whiteSpace: "normal",
            }}
          >
            {album.albumName}
          </div>
        )}
        
        {/* 닉네임 */}
        {album.nickname && (
          <NicknameTag 
            nickname={album.nickname} 
            profileImageUrl={album.profileImageUrl}
            coverSize={lpSize}
          />
        )}
        
        {/* 태그 */}
        {album.categoryTag && (
          <div
            style={{
              padding: `${lpSize * 0.02}px ${lpSize * 0.03}px`,
              border: "1.5px solid #000",
              borderRadius: `${lpSize * 0.04}px`,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              fontFamily: 'var(--font-kyobo-handwriting)',
              fontSize: `${lpSize * 0.08}px`,
              color: "#000",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              boxSizing: "border-box",
            }}
          >
            {album.categoryTag}
          </div>
        )}
      </div>

      {/* 노래 카드들 (LP 주변에 배치) */}
      {Array.from({ length: album.songCount || 0 }).map((_, index) => {
        const savedPosition = songCardPositions[index];
        const defaultX = 50 + Math.cos((index * 2 * Math.PI) / (album.songCount || 1)) * 30; // LP 중심 기준 각도별 배치
        const defaultY = 50 + Math.sin((index * 2 * Math.PI) / (album.songCount || 1)) * 30;
        
        const x = savedPosition?.x ?? defaultX;
        const y = savedPosition?.y ?? defaultY;

        // 드래그 시작
        const handleDragStart = (e: React.MouseEvent) => {
          e.preventDefault();
          if (!containerRef.current) return;
          
          const containerRect = containerRef.current.getBoundingClientRect();
          const startX = e.clientX;
          const startY = e.clientY;
          const startLeft = x;
          const startTop = y;

          const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = ((moveEvent.clientX - startX) / containerRect.width) * 100;
            const deltaY = ((moveEvent.clientY - startY) / containerRect.height) * 100;
            
            const newX = Math.max(0, Math.min(100, startLeft + deltaX));
            const newY = Math.max(0, Math.min(100, startTop + deltaY));
            
            // 상태 업데이트 및 저장
            saveSongCardPosition(index, newX, newY);
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        };

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              width: "auto",
              maxWidth: "300px",
              zIndex: 20,
            }}
          >
            <div
              onMouseDown={handleDragStart}
              style={{
                cursor: "move",
                position: "relative",
              }}
            >
              <AlbumDetailSongCard
                index={index}
                isLast={index === (album.songCount || 0) - 1}
                songTitle={album.songs?.[index]?.title || `노래 제목 ${index + 1}`}
                artistName={album.songs?.[index]?.artist || `아티스트명 ${index + 1}`}
                onCardClick={() => onSongClick(index)}
                onPlayClick={(e) => {
                  e.stopPropagation();
                  onPlayClick(index);
                }}
                isLPView={true}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

