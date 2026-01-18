"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiLink } from "react-icons/hi";
import { ROUTES } from "@/shared/lib/routes";
import { useAlbumData } from "./useAlbumData";
import AlbumInfoDisplay, { type AlbumData } from "./AlbumInfoDisplay";

type AlbumInfoContentProps = {
  albumData?: AlbumData | null;
  onComplete?: () => void;
};

export default function AlbumInfoContent({ albumData: initialAlbumData, onComplete }: AlbumInfoContentProps) {
  const router = useRouter();
  const { albumData, albumColor, todayDate } = useAlbumData(initialAlbumData);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

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
    const shareText = albumData.title;
    // 카카오톡 공유 URL 생성 (웹 링크 공유)
    const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_id=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(kakaoShareUrl, "_blank", "width=400,height=600");
  };

  if (!albumData) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {albumData && <AlbumInfoDisplay albumData={albumData} albumColor={albumColor} todayDate={todayDate} />}

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

      {/* 수정 버튼 */}
      <div className="mt-12">
        <button
          onClick={() => router.push(`${ROUTES.ALBUM.CREATE}?mode=edit`)}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-50 active:bg-gray-100 focus:outline-none transition-colors"
        >
          수정
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
