"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

// 프로필 메뉴 컴포넌트
function ProfileMenuContent({
  isAuthenticated,
  profileMenuOpen,
  user,
  showProfileInfo,
  onMenuClick,
  onLogout,
  onLogin,
}: {
  isAuthenticated: boolean;
  profileMenuOpen: boolean;
  user: any;
  showProfileInfo?: boolean;
  onMenuClick: () => void;
  onLogout: () => void;
  onLogin: () => void;
}) {
  const menuWidth = showProfileInfo ? "w-52" : "w-56";

  return (
    <div className="relative">
      {isAuthenticated ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Menu toggle handled by parent
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src={user?.profileImage || "https://placehold.co/40x40"}
            alt={user?.nickname || "프로필"}
            className="w-10 h-10 rounded-full"
          />
          {!showProfileInfo && (
            <span className="text-base text-gray-900 max-w-[200px] truncate">
              {user?.nickname || "사용자"}
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={onLogin}
          className="px-4 py-2 text-base text-gray-900 hover:text-[#006FFF] transition-colors cursor-pointer"
        >
          로그인이 필요합니다.
        </button>
      )}

      {isAuthenticated && profileMenuOpen && (
        <div className={`absolute top-full right-0 mt-2 ${menuWidth} bg-white border border-gray-200 rounded-lg shadow-lg z-50`}>
          <div className="py-2">
            {showProfileInfo && (
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                <img
                  src={user?.profileImage || "https://placehold.co/40x40"}
                  alt={user?.nickname || "프로필"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-900">
                  {user?.nickname || "사용자"}
                </span>
              </div>
            )}
            {PROFILE_MENU_ITEMS.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="block px-4 py-2.5 text-base text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={onMenuClick}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              onClick={onLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const user = useOauthStore((s) => s.user);
  const logout = useOauthStore((s) => s.logout);
  const isAuthenticated = useOauthStore((s) => s.isAuthenticated);
  const [showModal, setShowModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const resolvedBackHref = backHref || ROUTES.ALBUM.LIST;

  // 카카오 로그인 URL
  const JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${JAVASCRIPT_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    if (!JAVASCRIPT_KEY || !REDIRECT_URI) {
      alert("로그인 설정 누락");
      return;
    }
    window.location.assign(kakaoURL);
  };

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
        onClick={() => {
          if (profileMenuOpen) setProfileMenuOpen(false);
        }}
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
                <div ref={profileMenuRef}>
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
                    {isAuthenticated && (
                      <span className="text-base text-gray-900 max-w-[200px] truncate">
                        {user?.nickname || "사용자"}
                      </span>
                    )}
                  </button>
                  {isAuthenticated && profileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
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
                      </div>
                    </div>
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
                <div ref={profileMenuRef}>
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
                    {isAuthenticated && (
                      <span className="text-base text-gray-900 max-w-[200px] truncate">
                        {user?.nickname || "사용자"}
                      </span>
                    )}
                  </button>
                  {isAuthenticated && profileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
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
                      </div>
                    </div>
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
                <div ref={profileMenuRef}>
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
                  {isAuthenticated && profileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                          <img
                            src={user?.profileImage || "https://placehold.co/36x36"}
                            alt={user?.nickname || "프로필"}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-base text-gray-900 truncate">
                            {user?.nickname || "사용자"}
                          </span>
                        </div>
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
                      </div>
                    </div>
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
                <div ref={profileMenuRef}>
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
                  {isAuthenticated && profileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                          <img
                            src={user?.profileImage || "https://placehold.co/40x40"}
                            alt={user?.nickname || "프로필"}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-900">
                            {user?.nickname || "사용자"}
                          </span>
                        </div>
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <BottomConfirmModal
        isOpen={showModal}
        message="모든 작업을 취소하고 내 앨범으로 돌아가겠습니까?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
