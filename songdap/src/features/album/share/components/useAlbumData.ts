"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AlbumData } from "./AlbumInfoDisplay";
import { useTempDataStore } from "@/shared/store/tempDataStore";
import { getAlbum } from "@/features/album/api";

type UseAlbumDataOptions = {
  shouldRemoveAfterLoad?: boolean;
};

export function useAlbumData(initialAlbumData?: AlbumData | null, options?: UseAlbumDataOptions) {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const tempAlbumData = useTempDataStore((state) => state.albumShareData);
  const clearAlbumShareData = useTempDataStore((state) => state.clearAlbumShareData);
  
  const [albumColor, setAlbumColor] = useState<string>("#929292");
  const [todayDate, setTodayDate] = useState<string>("");
  const [albumData, setAlbumData] = useState<AlbumData | null>(initialAlbumData || null);
  const [isLoading, setIsLoading] = useState(false);

  // 클라이언트에서만 앨범 데이터 로드 및 오늘 날짜 설정
  useEffect(() => {
    // props로 전달된 데이터가 있으면 사용
    if (initialAlbumData) {
      setAlbumData(initialAlbumData);
      setAlbumColor(initialAlbumData.color);
    } 
    // URL에 albumId가 있으면 API로 조회
    else if (albumId) {
      setIsLoading(true);
      getAlbum(albumId)
        .then((album) => {
          const data: AlbumData = {
            title: album.title,
            description: album.description,
            isPublic: album.isPublic,
            musicCount: album.musicCount,
            musicCountLimit: album.musicCountLimit,
            color: album.color,
          };
          setAlbumData(data);
          setAlbumColor(album.color);
        })
        .catch((error) => {
          console.error("앨범 조회 실패:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // 임시 데이터 저장소에서 가져오기 (UUID가 없을 때만)
    else if (tempAlbumData) {
      const data: AlbumData = {
        title: tempAlbumData.title || "",
        description: tempAlbumData.description || "",
        isPublic: tempAlbumData.isPublic ?? true,
        musicCount: tempAlbumData.musicCount ?? 0,
        musicCountLimit: tempAlbumData.musicCountLimit || 15,
        color: tempAlbumData.color || "#929292",
      };
      setAlbumData(data);
      setAlbumColor(data.color);
      
      // 사용 후 삭제 옵션이 활성화되어 있으면 삭제
      if (options?.shouldRemoveAfterLoad) {
        clearAlbumShareData();
      }
    }

    // 오늘 날짜를 YYYY.MM.DD 형식으로 포맷팅
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setTodayDate(`${year}.${month}.${day}`);
  }, [initialAlbumData, albumId, tempAlbumData, options, clearAlbumShareData]);

  return { albumData, albumColor, todayDate, isLoading };
}
