"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared";
import { AlbumCover } from "@/shared/ui";
import { CreateAlbumForm, EditAlbumForm } from "@/features/album/create/components";
import { getRandomColorFromPalette } from "@/shared/lib/mockData";

export default function CreateAlbumPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  const [albumColor, setAlbumColor] = useState<string>("#929292"); // 기본값으로 고정
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서만 랜덤 색상 생성
  useEffect(() => {
    setIsMounted(true);
    setAlbumColor(getRandomColorFromPalette());
  }, []);

  // 헤더 제목: 수정 모드면 "앨범 수정하기", 아니면 "새 앨범 만들기"
  const headerTitle = isEditMode ? "앨범 수정하기" : "새 앨범 만들기";

  return (
    <>
      <PageHeader title={headerTitle} />
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
            {isEditMode ? (
              <EditAlbumForm 
                albumColor={albumColor}
                onAlbumColorChange={setAlbumColor}
              />
            ) : (
              <CreateAlbumForm 
                albumColor={albumColor}
                onAlbumColorChange={setAlbumColor}
              />
            )}
          </div>
            </div>
          </div>
    </>
  );
}
