"use client";
import { useState, useEffect, useRef } from "react";
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
  
  const hasLoadedRef = useRef(false);
  const currentAlbumIdRef = useRef<string | null>(null);

  // 클라이언트에서만 앨범 데이터 로드 및 오늘 날짜 설정
  useEffect(() => {
    // URL에 albumId가 있으면 항상 API로 조회 (최신 데이터 확보)
    if (albumId && albumId !== currentAlbumIdRef.current) {
      currentAlbumIdRef.current = albumId;
      hasLoadedRef.current = false;
      setIsLoading(true);
      
      getAlbum(albumId)
        .then((album) => {
          const data: AlbumData = {
            uuid: albumId,
            title: album.title,
            description: album.description,
            isPublic: album.isPublic,
            musicCount: album.musicCount,
            musicCountLimit: album.musicCountLimit,
            color: album.color,
            createdAt: album.createdAt,
          };
          setAlbumData(data);
          setAlbumColor(album.color);
          hasLoadedRef.current = true;
        })
        .catch((error) => {
          hasLoadedRef.current = true;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // albumId가 없고 아직 로드되지 않았을 때만 처리
    else if (!albumId && !hasLoadedRef.current) {
      // 임시 데이터 저장소에서 가져오기 (albumId가 없을 때만)
      if (tempAlbumData) {
        const data: AlbumData = {
          uuid: tempAlbumData.uuid,
          title: tempAlbumData.title || "",
          description: tempAlbumData.description || "",
          isPublic: tempAlbumData.isPublic ?? true,
          musicCount: tempAlbumData.musicCount ?? 0,
          musicCountLimit: tempAlbumData.musicCountLimit || 15,
          color: tempAlbumData.color || "#929292",
          createdAt: tempAlbumData.createdAt,
        };
        setAlbumData(data);
        setAlbumColor(data.color);
        
        // 사용 후 삭제 옵션이 활성화되어 있으면 삭제
        if (options?.shouldRemoveAfterLoad) {
          clearAlbumShareData();
        }
        hasLoadedRef.current = true;
      }
      // props로 전달된 데이터가 있으면 사용 (fallback)
      else if (initialAlbumData) {
        setAlbumData(initialAlbumData);
        setAlbumColor(initialAlbumData.color);
        hasLoadedRef.current = true;
      }
    }

    // 오늘 날짜를 YYYY.MM.DD 형식으로 포맷팅
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setTodayDate(`${year}.${month}.${day}`);
  }, [albumId]); // albumId만 dependency로 추적

  const refetch = async () => {
    const searchParams_local = new URLSearchParams(window.location.search);
    const albumId_local = searchParams_local.get("albumId");
    if (!albumId_local) return;
    
    setIsLoading(true);
    try {
      const album = await getAlbum(albumId_local);
      const data: AlbumData = {
        uuid: albumId_local,
        title: album.title,
        description: album.description,
        isPublic: album.isPublic,
        musicCount: album.musicCount,
        musicCountLimit: album.musicCountLimit,
        color: album.color,
        createdAt: album.createdAt,
      };
      setAlbumData(data);
      setAlbumColor(album.color);
    } catch (error) {
      // 앨범 새로고침 실패
    } finally {
      setIsLoading(false);
    }
  };

  return { albumData, albumColor, todayDate, isLoading, refetch };
}
