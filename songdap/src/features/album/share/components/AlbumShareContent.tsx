"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiLink } from "react-icons/hi";
import { ROUTES } from "@/shared/lib/routes";
import { useAlbumData } from "./useAlbumData";
import AlbumInfoDisplay, { type AlbumData } from "./AlbumInfoDisplay";
import { buildSongAddUrlFromAlbumInfo } from "@/shared/lib/songAddLink";
import { shareKakaoFeed } from "@/shared/lib/kakaoShare";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { trackEvent } from "@/lib/gtag";

type AlbumShareContentProps = {
  albumData?: AlbumData | null;
  onComplete?: () => void;
};

export default function AlbumShareContent({ albumData: initialAlbumData, onComplete }: AlbumShareContentProps) {
  const router = useRouter();
  const { albumData, albumColor, todayDate } = useAlbumData(initialAlbumData, { shouldRemoveAfterLoad: true });
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [showPrivateModal, setShowPrivateModal] = useState<boolean>(false);
  const user = useOauthStore((s) => s.user);

  const handleLinkCopy = () => {
    // 버튼 클릭 추적
    trackEvent(
      { event: "select_content", content_type: "album_share_link", item_id: albumData?.uuid || "" },
      { category: "album", action: "share_link_click", label: albumData?.uuid || "" }
    );

    // 비공개 앨범 체크
    if (!albumData?.isPublic) {
      setShowPrivateModal(true);
      return;
    }

    if (!albumData?.uuid) return;

    const songAddUrl = buildSongAddUrlFromAlbumInfo({
      id: albumData.uuid,
      title: albumData.title,
      color: albumColor,
      description: albumData.description || "",
      musicCount: albumData.musicCount ?? 0,
      musicCountLimit: albumData.musicCountLimit,
      createdAt: albumData.createdAt || "",
      isPublic: albumData.isPublic,
    });
    
    navigator.clipboard.writeText(songAddUrl).then(() => {
      setIsLinkCopied(true);
      // 완료 이벤트 추적
      trackEvent(
        { event: "share_album", item_id: albumData.uuid },
        { category: "album", action: "share", label: albumData.uuid }
      );
      setTimeout(() => setIsLinkCopied(false), 2000);
    });
  };

  const handleKakaoShare = async () => {
    // 버튼 클릭 추적
    trackEvent(
      { event: "select_content", content_type: "album_share_kakao", item_id: albumData?.uuid || "" },
      { category: "album", action: "share_kakao_click", label: albumData?.uuid || "" }
    );

    // 비공개 앨범 체크
    if (!albumData?.isPublic) {
      setShowPrivateModal(true);
      return;
    }

    if (!albumData?.uuid) return;

    const shareUrl = buildSongAddUrlFromAlbumInfo({
      id: albumData.uuid,
      title: albumData.title,
      color: albumColor,
      description: albumData.description || "",
      musicCount: albumData.musicCount ?? 0,
      musicCountLimit: albumData.musicCountLimit,
      createdAt: albumData.createdAt || "",
      isPublic: albumData.isPublic,
    });
    try {
      const nickname = user?.nickname ?? "누군가";
      await shareKakaoFeed({
        title: albumData.title,
        description: `"${nickname}"님의 앨범에 노래를 추가해주세요♪`,
        url: shareUrl,
        imageUrl: `${window.location.origin}/images/logo.png`,
        buttonTitle: "노래 추가하기",
      });
      // 완료 이벤트 추적
      trackEvent(
        { event: "share_album", item_id: albumData.uuid },
        { category: "album", action: "share_kakao", label: albumData.uuid }
      );
    } catch (err) {
      console.error("카카오 공유 실패:", err);
      alert("카카오 공유에 실패했어요. 링크 복사로 다시 시도해 주세요.");
    }
  };

  if (!albumData) {
    return null;
  }

  return (
    <>
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
            onClick={() => {
              trackEvent(
                { event: "select_content", content_type: "album_edit_button", item_id: albumData?.uuid || "" },
                { category: "album", action: "edit_click", label: albumData?.uuid || "" }
              );
              router.push(`${ROUTES.ALBUM.CREATE}?mode=edit`);
            }}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-50 active:bg-gray-100 focus:outline-none transition-colors"
          >
            수정
          </button>
        </div>

        {/* 완료 버튼 */}
        {onComplete && (
          <div className="mt-3">
            <button
              onClick={() => {
                trackEvent(
                  { event: "select_content", content_type: "album_share_complete", item_id: albumData?.uuid || "" },
                  { category: "album", action: "share_complete_click", label: albumData?.uuid || "" }
                );
                onComplete();
              }}
              className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors"
            >
              완료
            </button>
          </div>
        )}
      </div>

      {/* 비공개 앨범 모달 */}
      {showPrivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">공유 불가</h2>
            <p className="text-gray-600 mb-6">
              비공개 앨범은 공유가 불가합니다.<br />
              비공개를 해제해주세요.
            </p>
            <button
              onClick={() => setShowPrivateModal(false)}
              className="w-full py-2.5 px-4 bg-[#006FFF] text-white rounded-lg font-medium hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
