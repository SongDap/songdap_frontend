"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlbumCover } from "@/shared/ui";
import { HiLockOpen, HiLockClosed, HiLink } from "react-icons/hi";
import { ROUTES } from "@/shared/lib/routes";

type AlbumData = {
  albumName: string;
  albumDescription: string;
  isPublic: boolean;
  songCount: number;
  albumColor: string;
};

type AlbumShareContentProps = {
  albumData?: AlbumData | null;
  onComplete?: () => void;
};

export default function AlbumShareContent({ albumData: initialAlbumData, onComplete }: AlbumShareContentProps) {
  const router = useRouter();
  const [albumColor, setAlbumColor] = useState<string>("#929292");
  const [todayDate, setTodayDate] = useState<string>("");
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [albumData, setAlbumData] = useState<AlbumData | null>(initialAlbumData || null);

  // 클라이언트에서만 앨범 데이터 로드 및 오늘 날짜 설정
  useEffect(() => {
    // props로 전달된 데이터가 있으면 사용
    if (initialAlbumData) {
      setAlbumData(initialAlbumData);
      setAlbumColor(initialAlbumData.albumColor);
    } else {
      // sessionStorage에서 앨범 데이터 가져오기
      const savedData = sessionStorage.getItem("albumCreateData");
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setAlbumData(data);
          setAlbumColor(data.albumColor);
          // 사용 후 삭제
          sessionStorage.removeItem("albumCreateData");
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
  }, [initialAlbumData]);

  const handleLinkCopy = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    });
  };

  const handleKakaoShare = () => {
    if (!albumData) return;
    // TODO: 카카오톡 공유 API 연동
    const shareUrl = window.location.href;
    const shareText = albumData.albumName;
    // 카카오톡 공유 URL 생성 (웹 링크 공유)
    const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_id=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(kakaoShareUrl, "_blank", "width=400,height=600");
  };

  if (!albumData) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* 앨범 커버 */}
      <div className="flex justify-center mb-8">
        <AlbumCover 
          size={150} 
          backgroundColor={undefined}
          backgroundColorHex={albumColor}
        />
      </div>

      {/* 공개 여부 태그 + 앨범명 */}
      <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
        {/* 공개/비공개 태그 */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
            albumData.isPublic
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          {albumData.isPublic ? (
            <HiLockOpen className="w-4 h-4" />
          ) : (
            <HiLockClosed className="w-4 h-4" />
          )}
          <span>{albumData.isPublic ? "공개" : "비공개"}</span>
        </div>

        {/* 앨범명 */}
        <span className="text-[30px] font-bold text-gray-900 leading-none">
          {albumData.albumName}
        </span>
      </div>

      {/* 앨범 설명 */}
      {albumData.albumDescription && (
        <div className="mb-6">
          <p className="text-base text-gray-700">
            &ldquo;{albumData.albumDescription}&rdquo;
          </p>
        </div>
      )}

      {/* 곡개수 | 날짜 */}
      {todayDate && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          <span>곡 {albumData.songCount}개</span>
          <span>|</span>
          <span>{todayDate}</span>
        </div>
      )}

      {/* 공유 버튼 */}
      <div className="flex items-center justify-center gap-3">
        {/* 링크 복사하기 */}
        <button
          onClick={handleLinkCopy}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <HiLink className="w-5 h-5" />
          <span>{isLinkCopied ? "복사됨!" : "링크 복사하기"}</span>
        </button>

        {/* 카카오톡으로 공유하기 */}
        <button
          onClick={handleKakaoShare}
          className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] rounded-lg text-base text-gray-900 hover:bg-[#FDD835] active:bg-[#FBC02D] transition-colors font-medium"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.48 0 0 3.84 0 8.57c0 3.04 1.92 5.72 4.8 7.28l-.96 3.6c-.16.6.48 1.04 1 .72l4.4-2.52c.48.08.96.12 1.48.12 5.52 0 10-3.84 10-8.57C20 3.84 15.52 0 10 0z"
              fill="#000000"
            />
          </svg>
          <span>카카오톡으로 공유하기</span>
        </button>
      </div>

      {/* 이전 버튼 */}
      <div className="mt-12">
        <button
          onClick={() => router.push(ROUTES.ALBUM.CREATE)}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-50 active:bg-gray-100 focus:outline-none transition-colors"
        >
          이전
        </button>
      </div>

      {/* 완료 버튼 */}
      {onComplete && (
        <div className="mt-3">
          <button
            onClick={onComplete}
            className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors"
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
}
