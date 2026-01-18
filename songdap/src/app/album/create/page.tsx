"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/shared";
import { AlbumCover } from "@/shared/ui";
import { CreateAlbumForm } from "@/features/album/create/components";

// 색상 팔레트 리스트
const presetColors = [
  "#00c7fc",
  "#3a88fe",
  "#5e30eb",
  "#d357fe",
  "#ed719e",
  "#ff6251",
  "#ff8647",
  "#ffb43f",
  "#fecb3e",
  "#FFD93D",
  "#e4ef65",
  "#96d35f",
  "#929292",
];

// 색상 팔레트에서 랜덤 색상 선택
function getRandomColorFromPalette(): string {
  const randomIndex = Math.floor(Math.random() * presetColors.length);
  return presetColors[randomIndex];
}

export default function CreateAlbumPage() {
  const [albumColor, setAlbumColor] = useState<string>("#929292"); // 기본값으로 고정
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서만 랜덤 색상 생성
  useEffect(() => {
    setIsMounted(true);
    setAlbumColor(getRandomColorFromPalette());
  }, []);

  return (
    <>
      <PageHeader title="새 앨범 만들기" />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          {/* 앨범 커버 */}
          <div className="flex justify-center">
            <AlbumCover 
              size={150} 
              backgroundColor={undefined}
              backgroundColorHex={albumColor}
            />
          </div>

          {/* 폼 */}
          <div className="max-w-2xl mx-auto mt-8">
            <CreateAlbumForm 
              albumColor={albumColor}
              onAlbumColorChange={setAlbumColor}
            />
          </div>
            </div>
          </div>
    </>
  );
}
