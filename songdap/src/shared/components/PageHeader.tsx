"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiLockClosed } from "react-icons/hi";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { ROUTES } from "@/shared/lib/routes";
import { BottomConfirmModal } from "@/shared/ui";

// 프로필 메뉴 항목
const PROFILE_MENU_ITEMS = [
  { label: "내 앨범", href: "/album/list" },
  { label: "서비스 소개", href: "/introduceService" },
  { label: "프로필 편집", href: "/profile/edit" },
];

// 뒤로가기 아이콘 SVG
const BackIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

type PageHeaderProps = {
  title: string | ReactNode;
  isPublic?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  rightAction?: ReactNode;
  backgroundColor?: string;
  showLogo?: boolean;
};

export default function PageHeader({
  title,
  isPublic,
  showBackButton = true,
  backHref,
  rightAction,
  backgroundColor,
  showLogo = false,
}: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useOauthStore((s) => s.user);
  const logout = useOauthStore((s) => s.logout);
  const isAuthenticated = useOauthStore((s) => s.isAuthenticated);
  const [showModal, setShowModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const profileMenuRefPcBack = useRef<HTMLDivElement>(null);
  const profileMenuRefPcLogo = useRef<HTMLDivElement>(null);
  const profileMenuRefMobBack = useRef<HTMLDivElement>(null);
  const profileMenuRefMobLogo = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resolvedBackHref = backHref || ROUTES.ALBUM.LIST;

  const allProfileRefs = [profileMenuRefPcBack, profileMenuRefPcLogo, profileMenuRefMobBack, profileMenuRefMobLogo];

  // 로그인 후 돌아올 URL (앨범 상세 등 현재 페이지 유지)
  const returnPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  // 카카오 로그인 URL (state에 복귀 경로 전달)
  const JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${JAVASCRIPT_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${encodeURIComponent(returnPath)}`;

  const handleLogin = () => {
    if (!JAVASCRIPT_KEY || !REDIRECT_URI) {
      alert("로그인 설정 누락");
      return;
    }
    window.location.assign(kakaoURL);
  };

  // 메뉴 외부 클릭 시 닫기 (4개 영역 + 드롭다운 포털 모두 확인)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideProfile = allProfileRefs.some((ref) => ref.current?.contains(target));
      const isInsideDropdown = dropdownRef.current?.contains(target);
      if (!isInsideProfile && !isInsideDropdown) {
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

  // 드롭다운 위치 계산 (보이는 프로필 영역 기준) + 포털용
  useEffect(() => {
    if (!profileMenuOpen || typeof document === "undefined") {
      setDropdownPosition(null);
      return;
    }
    const DROPDOWN_WIDTH = 224;
    const GAP = 8;
    for (const ref of allProfileRefs) {
      const el = ref.current;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.top >= 0 && rect.top < 300) {
        setDropdownPosition({
          top: rect.bottom + GAP,
          left: Math.min(rect.right - DROPDOWN_WIDTH, window.innerWidth - DROPDOWN_WIDTH - 16),
        });
        return;
      }
    }
    setDropdownPosition(null);
  }, [profileMenuOpen]);

  const handleBackClick = () => {
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

  const handleMenuItemClick = () => {
    setProfileMenuOpen(false);
  };

  const headerBackground = backgroundColor
    ? {
        background: `linear-gradient(to bottom, ${backgroundColor}, ${backgroundColor})`,
      }
    : {
        background: "white",
      };

  const headerOverlay = backgroundColor ? { background: "rgba(255, 255, 255, 0.8)" } : undefined;

  const titleClass = "text-gray-900 flex items-center justify-center gap-2";
  const pcTitleClass = `${titleClass} text-2xl font-bold`;
  const mobileTitleClass = `${titleClass} text-lg font-semibold`;

  return (
    <>
      <header
        className="w-full"
        style={headerBackground}
      >
        <div className="w-full" style={headerOverlay}>
          {/* PC 헤더 - 뒤로가기 */}
          {showBackButton && !showLogo && (
            <div className="hidden md:flex h-[95px] px-20 items-center max-w-[1440px] mx-auto relative">
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors absolute left-20"
                aria-label="뒤로가기"
              >
                <BackIcon />
              </button>

              <h1 className={`${pcTitleClass} absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-[50%]`}>
                {isPublic === false && (
                  <HiLockClosed className="w-5 h-5 text-gray-900 flex-shrink-0" />
                )}
                <span className="line-clamp-2 text-center">{title}</span>
              </h1>

              <div className="flex items-center gap-2 absolute right-20">
                {rightAction}
                <div ref={profileMenuRefPcBack}>
                  {isAuthenticated ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(!profileMenuOpen);
                      }}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={user?.profileImage || "https://placehold.co/40x40"}
                        alt={user?.nickname || "프로필"}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-base text-gray-900 max-w-[200px] truncate">
                        {user?.nickname || "사용자"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 text-base text-gray-900 hover:text-[#006FFF] transition-colors cursor-pointer"
                    >
                      로그인이 필요합니다.
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PC 헤더 - 로고 */}
          {showLogo && (
            <div className="hidden md:flex h-[95px] px-20 items-center max-w-[1440px] mx-auto relative">
              <button
                onClick={() => router.push("/")}
                className="hover:opacity-80 transition-opacity absolute left-20"
                aria-label="홈으로 이동"
              >
                <img
                  src="/images/logo.png"
                  alt="로고"
                  className="h-10 object-contain"
                />
              </button>

              <h1 className={`${pcTitleClass} absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-[50%]`}>
                {isPublic === false && (
                  <HiLockClosed className="w-5 h-5 text-gray-900 flex-shrink-0" />
                )}
                <span className="line-clamp-2 text-center">{title}</span>
              </h1>

              <div className="flex items-center gap-2 absolute right-20">
                {rightAction}
                <div ref={profileMenuRefPcLogo}>
                  {isAuthenticated ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(!profileMenuOpen);
                      }}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={user?.profileImage || "https://placehold.co/40x40"}
                        alt={user?.nickname || "프로필"}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-base text-gray-900 max-w-[200px] truncate">
                        {user?.nickname || "사용자"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 text-base text-gray-900 hover:text-[#006FFF] transition-colors cursor-pointer"
                    >
                      로그인이 필요합니다.
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 모바일 헤더 - 뒤로가기 */}
          {showBackButton && !showLogo && (
            <div className="md:hidden h-[70px] px-4 flex items-center relative">
              <button
                onClick={handleBackClick}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors absolute left-4"
                aria-label="뒤로가기"
              >
                <BackIcon />
              </button>

              <h1 className={`${mobileTitleClass} absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-[60%]`}>
                {isPublic === false && (
                  <HiLockClosed className="w-4 h-4 text-gray-900 flex-shrink-0" />
                )}
                <span className="line-clamp-2 text-center">{title}</span>
              </h1>

              <div className="flex items-center gap-1 absolute right-4">
                {rightAction}
                <div ref={profileMenuRefMobBack}>
                  {isAuthenticated ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(!profileMenuOpen);
                      }}
                      className="flex items-center hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={user?.profileImage || "https://placehold.co/40x40"}
                        alt={user?.nickname || "프로필"}
                        className="w-9 h-9 rounded-full"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="px-2 py-1.5 text-xs text-gray-900 hover:text-[#006FFF] transition-colors cursor-pointer"
                    >
                      로그인
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 모바일 헤더 - 로고 */}
          {showLogo && (
            <div className="md:hidden h-[70px] px-4 flex items-center relative">
              <button
                onClick={() => router.push("/")}
                className="hover:opacity-80 transition-opacity absolute left-4"
                aria-label="홈으로 이동"
              >
                <img
                  src="/images/logo.png"
                  alt="로고"
                  className="h-8 object-contain"
                />
              </button>

              <h1 className={`${mobileTitleClass} absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-[60%]`}>
                {isPublic === false && (
                  <HiLockClosed className="w-4 h-4 text-gray-900 flex-shrink-0" />
                )}
                <span className="line-clamp-2 text-center">{title}</span>
              </h1>

              <div className="flex items-center gap-1 absolute right-4">
                {rightAction}
                <div ref={profileMenuRefMobLogo}>
                  {isAuthenticated ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(!profileMenuOpen);
                      }}
                      className="flex items-center hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={user?.profileImage || "https://placehold.co/40x40"}
                        alt={user?.nickname || "프로필"}
                        className="w-10 h-10 rounded-full"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="px-2 py-1.5 text-xs text-gray-900 hover:text-[#006FFF] transition-colors cursor-pointer"
                    >
                      로그인
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 프로필 드롭다운 포털 (overflow 등으로 잘리지 않도록 body에 렌더) */}
      {profileMenuOpen &&
        isAuthenticated &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] py-2"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          >
            {PROFILE_MENU_ITEMS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="block px-4 py-2.5 text-base text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={handleMenuItemClick}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              onClick={() => {
                setProfileMenuOpen(false);
                logout();
                router.replace("/");
              }}
            >
              로그아웃
            </button>
          </div>,
          document.body
        )}

      <BottomConfirmModal
        isOpen={showModal}
        message="모든 작업을 취소하고 내 앨범으로 돌아가겠습니까?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
