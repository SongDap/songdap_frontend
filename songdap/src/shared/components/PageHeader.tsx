"use client";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HiLockClosed } from "react-icons/hi";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { ROUTES } from "@/shared/lib/routes";
import { BottomConfirmModal } from "@/shared/ui";

type PageHeaderProps = {
  title: string;
  backButtonText?: string;
  backgroundColor?: string; // 앨범 색상 (배경에 사용)
  hideTextOnMobile?: boolean; // 모바일에서 텍스트 숨김, 아이콘만 표시
  isPublic?: boolean; // 비공개일 때 자물쇠 아이콘 표시
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부 (기본값: true)
  backHref?: string; // 뒤로가기 시 이동할 경로(정렬/페이지 유지용)
  rightAction?: ReactNode; // 헤더 우측 액션(예: 앨범 정보 버튼)
};

export default function PageHeader({
  title,
  backButtonText = "내 앨범",
  backgroundColor,
  hideTextOnMobile,
  isPublic,
  showBackButton = true,
  backHref,
  rightAction,
}: PageHeaderProps) {
  const router = useRouter();
  const { user } = useOauthStore();
  const [showModal, setShowModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const resolvedBackHref = backHref || ROUTES.ALBUM.LIST;

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleBackClick = () => {
    // 모바일에서는 모달 표시, PC에서는 window.confirm 사용
    if (window.innerWidth < 768) {
      setShowModal(true);
    } else {
      if (window.confirm("모든 작업을 취소하고 내 앨범으로 돌아가겠습니까?")) {
        router.push(resolvedBackHref);
      }
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    router.push(resolvedBackHref);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <header 
        className="w-full border-b border-gray-200"
        style={backgroundColor ? {
          background: `linear-gradient(to bottom, ${backgroundColor}, ${backgroundColor})`,
        } : {
          background: 'white',
        }}
      >
        <div 
          className="w-full"
          style={backgroundColor ? {
            background: 'rgba(255, 255, 255, 0.8)',
          } : undefined}
        >
        <div className="h-[95px] px-4 flex items-center justify-between md:px-20 max-w-[1440px] mx-auto relative">
          {/* 내 앨범 버튼 */}
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-base text-gray-800 hover:text-[#006FFF] active:text-[#006FFF] transition-colors"
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={hideTextOnMobile ? "block" : "hidden md:block"}
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className={hideTextOnMobile ? "hidden md:inline underline md:no-underline" : "underline md:no-underline"}>
              {backButtonText}
            </span>
          </button>
          )}

          {/* 가운데 타이틀 */}
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-[30px] font-bold text-gray-900 truncate max-w-[70%] md:max-w-none flex items-center justify-center gap-2">
            {isPublic === false && (
              <HiLockClosed className="w-4 h-4 md:w-5 md:h-5 text-gray-900 flex-shrink-0" />
            )}
            <span className="truncate">{title}</span>
          </h1>

          {/* 오른쪽 액션(상세 페이지 등에서 사용) */}
          {rightAction && showBackButton && (
            <div className="flex items-center gap-2 ml-auto">
              {rightAction}
            </div>
          )}

          {/* 오른쪽 헤더 메뉴 (데스크탑용) */}
          {!showBackButton && (
            <>
              <div className="hidden md:flex items-center gap-3 ml-auto">
                <a
                  href="/album/list"
                  className="px-3 py-2 rounded-lg text-base text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  내 앨범
                </a>
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileMenuOpen(!profileMenuOpen);
                    }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={user?.profileImage || "https://placehold.co/36x36"}
                      alt={user?.nickname || "프로필"}
                      className="w-9 h-9 rounded-full"
                    />
                    <span className="text-base text-gray-900 max-w-[200px] truncate" title={user?.nickname || "사용자"}>
                      {user?.nickname?.slice(0, 16) || "사용자"}
                      {user?.nickname && user.nickname.length > 16 && "..."}
                    </span>
                  </button>
                  
                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-base text-gray-800 hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileMenuOpen(false);
                          }}
                        >
                          프로필 편집
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 모바일 메뉴 버튼 */}
              <div className="md:hidden ml-auto">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="menu"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 7h16M4 12h16M4 17h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* 오른쪽 프로필 (기존 버전 - showBackButton이 true일 때) */}
          {showBackButton && (
            <div className="flex items-center gap-2">
              <img
                src={user?.profileImage || "https://placehold.co/36x36"}
                alt={user?.nickname || "프로필"}
                className="w-9 h-9 rounded-full"
              />
              <span className="text-base text-gray-900 max-w-[200px] truncate hidden md:inline" title={user?.nickname || "사용자"}>
                {user?.nickname?.slice(0, 16) || "사용자"}
                {user?.nickname && user.nickname.length > 16 && "..."}
              </span>
            </div>
          )}
      </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {!showBackButton && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="flex flex-col px-4 py-3 gap-1">
              {/* Mobile profile */}
              <div className="flex flex-col gap-2 px-3 py-2 mb-2 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={user?.profileImage || "https://placehold.co/36x36"}
                    alt={user?.nickname || "프로필"}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-base text-gray-900 truncate" title={user?.nickname || "사용자"}>
                    {user?.nickname?.slice(0, 16) || "사용자"}
                    {user?.nickname && user.nickname.length > 16 && "..."}
                  </span>
                </div>
                <a
                  href="#"
                  className="px-3 py-2 rounded-lg text-base text-gray-800 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  프로필 편집
                </a>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                <a
                  href="/album/list"
                  className="px-3 py-2 rounded-lg text-base text-white font-medium"
                  style={{ backgroundColor: "#006FFF" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  내 앨범
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

    {/* 모바일 확인 모달 */}
    <BottomConfirmModal
      isOpen={showModal}
      message="모든 작업을 취소하고 내 앨범으로 돌아가겠습니까?"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  </>
  );
}
