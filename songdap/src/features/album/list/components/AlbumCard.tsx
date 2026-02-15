"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlbumCover } from "@/shared/ui";
import { HiLockClosed, HiShare, HiLink, HiX, HiLockOpen, HiLockClosed as HiLockClosedIcon } from "react-icons/hi";
import AlbumCardEditMode from "./AlbumCardEditMode";
import { buildAlbumShareUrlFromAlbumInfo } from "@/shared/lib/songAddLink";
import { shareKakaoFeed } from "@/shared/lib/kakaoShare";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { trackEvent } from "@/lib/gtag";
import { updateAlbumVisibility, getAlbum } from "@/features/album/api";

type AlbumCardProps = {
  id: string;
  albumName: string;
  albumColor: string;
  isPublic: boolean;
  songCount: number;
  imageUrl?: string | null;
  href?: string;
  createdAt?: string;
  musicCountLimit?: number;
  description?: string;
  isEditMode?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onInfoClick?: (id: string) => void;
};

export default function AlbumCard({
  id,
  albumName,
  albumColor,
  isPublic,
  songCount,
  imageUrl,
  href,
  createdAt,
  musicCountLimit,
  description,
  isEditMode = false,
  onDelete,
  onEdit,
  onInfoClick,
}: AlbumCardProps) {
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const user = useOauthStore((s) => s.user);

  // PC: 240x240, 모바일: 화면에 2개가 나오도록 (약 170px)
  const coverSizePC = 240;
  const coverSizeMobile = 170;
  const lpSizePC = coverSizePC * 0.8; // 192
  const lpSizeMobile = coverSizeMobile * 0.8; // 136

  // 클라이언트에서만 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLinkCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    // 비공개 앨범 체크
    if (!isPublic) {
      setShowPrivateModal(true);
      return;
    }
    if (typeof window === "undefined") return;
    
    const songAddUrl = buildAlbumShareUrlFromAlbumInfo({
      id,
      title: albumName,
      color: albumColor,
      description: description || "",
      musicCount: songCount,
      musicCountLimit: typeof musicCountLimit === "number" ? musicCountLimit : 10,
      createdAt: createdAt || "",
      isPublic,
    });
    navigator.clipboard.writeText(songAddUrl).then(() => {
      trackEvent(
        { event: "select_content", content_type: "album_link_copy", item_id: id },
        { category: "album", action: "share_link_copy", label: id }
      );
      setIsLinkCopied(true);
      setTimeout(() => {
        setIsLinkCopied(false);
        setShowShareMenu(false);
      }, 2000);
    });
  };

  const handleKakaoShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    // 비공개 앨범 체크
    if (!isPublic) {
      setShowPrivateModal(true);
      return;
    }
    if (typeof window === "undefined") return;
    
    const shareUrl = buildAlbumShareUrlFromAlbumInfo({
      id,
      title: albumName,
      color: albumColor,
      description: description || "",
      musicCount: songCount,
      musicCountLimit: typeof musicCountLimit === "number" ? musicCountLimit : 10,
      createdAt: createdAt || "",
      isPublic,
    });
    try {
      const nickname = user?.nickname ?? "누군가";
      await shareKakaoFeed({
        title: albumName,
        description: `"${nickname}"님의 앨범에 노래를 추가해주세요♪`,
        url: shareUrl,
        imageUrl: `${window.location.origin}/images/logo.png`,
        buttonTitle: "노래 추가하기",
      });
      trackEvent(
        { event: "share_album", item_id: id },
        { category: "album", action: "share_kakao", label: id }
      );
    } catch (err) {
      // 최소 fallback: 링크 복사
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsLinkCopied(true);
        setTimeout(() => {
          setIsLinkCopied(false);
          setShowShareMenu(false);
        }, 2000);
        return;
      } catch {
        // ignore
      }
      alert("카카오 공유에 실패했어요. 링크 복사로 다시 시도해 주세요.");
    } finally {
      setShowShareMenu(false);
    }
  };

  const handleOpenDetail = () => {
    if (!isEditMode && !showShareMenu) {
      trackEvent(
        { event: "select_item", items: [{ item_id: id }] },
        { category: "album", action: "select", label: id }
      );
      router.push(href || `/album?id=${id}`);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3 group album-card-item">
        {/* 앨범 커버 - 클릭 가능 */}
        <div 
          className="w-[170px] h-[170px] md:w-[240px] md:h-[240px] relative cursor-pointer"
          onClick={handleOpenDetail}
        >
          {/* 모바일 버전 */}
          <div className="md:hidden">
            <AlbumCover
              size={coverSizeMobile}
              backgroundColorHex={albumColor}
              imageUrl={imageUrl}
              lpSize={lpSizeMobile}
              className="w-full h-full"
            />
          </div>
          {/* PC 버전 */}
          <div className="hidden md:block">
            <AlbumCover
              size={coverSizePC}
              backgroundColorHex={albumColor}
              imageUrl={imageUrl}
              lpSize={lpSizePC}
              className="w-full h-full"
            />
          </div>

          {/* 편집 모드 */}
          {isEditMode && (
            <AlbumCardEditMode
              id={id}
              albumName={albumName}
              onDelete={onDelete}
              onEdit={onEdit}
              onInfoClick={onInfoClick}
            />
          )}

          {/* 오른쪽 위 자물쇠 아이콘 (비공개일 때만) */}
          {!isPublic && (
            <div className="absolute top-2 right-2 flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
              <HiLockClosed className="w-4 h-4 text-gray-700" />
            </div>
          )}
        </div>

        {/* 앨범 정보 */}
        <div className="text-left w-[170px] md:w-[240px]">
          {/* 등록 날짜 */}
          {createdAt && (
            <p className="text-xs text-gray-500 mb-1">{createdAt}</p>
          )}
          {/* 앨범명 + 공유 아이콘 */}
          <div className="flex items-center justify-between gap-2">
            <h3 
              className="text-base md:text-lg font-semibold text-gray-900 flex-1 truncate cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleOpenDetail}
            >
              {albumName}
            </h3>
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowShareMenu(!showShareMenu);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="공유하기"
              >
                <HiShare className="w-4 h-4 text-gray-600" />
              </button>

              {/* 공유 메뉴 */}
              {showShareMenu && (
                <>
                  {/* 백드롭 */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowShareMenu(false)}
                  />
                  {/* 메뉴 */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* 링크 복사 */}
                    <button
                      onClick={handleLinkCopy}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiLink className="w-5 h-5 text-gray-600" />
                      <span>{isLinkCopied ? "복사됨!" : "링크 복사하기"}</span>
                    </button>

                    {/* 카카오톡 공유 */}
                    <button
                      onClick={handleKakaoShare}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-600"
                      >
                        <path
                          d="M10 0C4.48 0 0 3.84 0 8.57c0 3.04 1.92 5.72 4.8 7.28l-.96 3.6c-.16.6.48 1.04 1 .72l4.4-2.52c.48.08.96.12 1.48.12 5.52 0 10-3.84 10-8.57C20 3.84 15.52 0 10 0z"
                          fill="#000000"
                        />
                      </svg>
                      <span>카카오톡으로 공유하기</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
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
