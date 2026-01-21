"use client";
import { useState, useEffect } from "react";
import { AlbumData } from "./AlbumInfoDisplay";

type UseAlbumDataOptions = {
  shouldRemoveAfterLoad?: boolean;
};

export function useAlbumData(initialAlbumData?: AlbumData | null, options?: UseAlbumDataOptions) {
  const [albumColor, setAlbumColor] = useState<string>("#929292"); // color 필드를 albumColor로 관리 (UI 호환성)
  const [todayDate, setTodayDate] = useState<string>("");
  const [albumData, setAlbumData] = useState<AlbumData | null>(initialAlbumData || null);

  // 클라이언트에서만 앨범 데이터 로드 및 오늘 날짜 설정
  useEffect(() => {
    // props로 전달된 데이터가 있으면 사용
    if (initialAlbumData) {
      setAlbumData(initialAlbumData);
      setAlbumColor(initialAlbumData.color);
    } else {
      // sessionStorage에서 앨범 데이터 가져오기
      const savedData = sessionStorage.getItem("albumCreateData");
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setAlbumData(data);
          setAlbumColor(data.color || data.albumColor); // 호환성을 위해 albumColor도 체크
          
          // 사용 후 삭제 옵션이 활성화되어 있으면 삭제
          if (options?.shouldRemoveAfterLoad) {
            sessionStorage.removeItem("albumCreateData");
          }
        } catch (error) {
          console.error("Failed to parse album data:", error);
        }
      }
    }

    // 오늘 날짜를 YYYY.MM.DD 형식으로 포맷팅
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setTodayDate(`${year}.${month}.${day}`);
  }, [initialAlbumData, options]);

  return { albumData, albumColor, todayDate };
}
