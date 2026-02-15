"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { HiChevronLeft } from "react-icons/hi";
import Link from "next/link";

// 프로필 메뉴 항목
const PROFILE_MENU_ITEMS = [
  { label: "내 앨범", href: "/album/list" },
  { label: "서비스 소개", href: "/introduceService" },
  { label: "프로필 편집", href: "/profile/edit" },
];

// 프로필 메뉴 컴포넌트
function ProfileMenu({
  isAuthenticated,
  profileMenuOpen,
  setProfileMenuOpen,
  user,
  onMenuClick,
  onLogout,
  onLogin,
  variant = "pc",
}: {
  isAuthenticated: boolean;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean) => void;
  user: any;
  onMenuClick: () => void;
  onLogout: () => void;
  onLogin: () => void;
  variant?: "pc" | "mobile";
}) {
  const profileImageSize = variant === "pc" ? "w-10 h-10" : "w-9 h-9";
  const textSize = variant === "pc" ? "text-base" : "text-xs";
  const menuWidth = variant === "pc" ? "w-56" : "w-52";
  const profileImageInMenu = variant === "pc" ? "w-8 h-8" : "w-8 h-8";

  return (
    <div className="relative">
      {isAuthenticated ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setProfileMenuOpen(!profileMenuOpen);
          }}
          className={`flex items-center ${variant === "pc" ? "gap-2" : ""} hover:opacity-80 transition-opacity`}
        >
          <img
            src={user?.profileImage || "https://placehold.co/40x40"}
            alt={user?.nickname || "프로필"}
            className={`rounded-full ${profileImageSize}`}
          />
          {variant === "pc" && (
            <span className="text-base text-gray-900 max-w-[200px] truncate">
              {user?.nickname || "사용자"}
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={onLogin}
          className={`${textSize} text-gray-900 hover:text-[#006FFF] transition-colors cursor-pointer ${
            variant === "pc" ? "px-4 py-2" : "px-2 py-1.5"
          }`}
        >
          {variant === "pc" ? "로그인이 필요합니다." : "로그인"}
        </button>
      )}

      {isAuthenticated && profileMenuOpen && (
        <div
          className={`absolute top-full right-0 mt-2 ${menuWidth} bg-white border border-gray-200 rounded-lg shadow-lg z-50`}
        >
          <div className="py-2">
            {variant === "mobile" && (
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                <img
                  src={user?.profileImage || "https://placehold.co/36x36"}
                  alt={user?.nickname || "프로필"}
                  className={profileImageInMenu}
                />
                <span className="text-base text-gray-900 truncate">
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

export default function Header() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useOauthStore((s) => s.user);
  const logout = useOauthStore((s) => s.logout);
  const isAuthenticated = useOauthStore((s) => s.isAuthenticated);

  // 페이지 타입 감지
  const isAlbumListPage = pathname === "/album/list";
  const isAlbumDetailPage = pathname.startsWith("/album/") && !isAlbumListPage;
  const isProfileEditPage = pathname === "/profile/edit";
  const isWithdrawPage = pathname === "/profile/withdraw";

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

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    router.replace("/");
  };

  const handleMenuItemClick = () => {
    setProfileMenuOpen(false);
  };


  // ========== PC 헤더 ==========
  const renderPCHeader = () => {
    if (isAlbumListPage) {
      return (
        <div className="hidden md:flex h-[95px] px-20 items-center justify-between max-w-[1440px] mx-auto relative">
          <Link href="/">
            <img src="/images/logo.png" alt="logo" className="h-16 w-auto object-contain" />
          </Link>
          <span className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900">내 앨범</span>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="pc"
          />
        </div>
      );
    } else if (isAlbumDetailPage) {
      return (
        <div className="hidden md:flex h-[95px] px-20 items-center justify-between max-w-[1440px] mx-auto relative">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="뒤로가기"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <span className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900">앨범</span>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="pc"
          />
        </div>
      );
    } else if (isProfileEditPage) {
      return (
        <div className="hidden md:flex h-[95px] px-20 items-center justify-between max-w-[1440px] mx-auto">
          <Link href="/">
            <img src="/images/logo.png" alt="logo" className="h-16 w-auto object-contain" />
          </Link>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="pc"
          />
        </div>
      );
    } else if (isWithdrawPage) {
      return (
        <div className="hidden md:flex h-[95px] px-20 items-center justify-between max-w-[1440px] mx-auto">
          <Link href="/">
            <img src="/images/logo.png" alt="logo" className="h-16 w-auto object-contain" />
          </Link>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="pc"
          />
        </div>
      );
    }
    return null;
  };

  // ========== 모바일 헤더 ==========
  const renderMobileHeader = () => {
    if (isAlbumListPage) {
      return (
        <div className="md:hidden h-[70px] px-4 flex items-center justify-between">
          <Link href="/">
            <img src="/images/logo.png" alt="logo" className="h-10 w-auto object-contain" />
          </Link>
          <span className="text-lg font-semibold text-gray-900">내 앨범</span>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="mobile"
          />
        </div>
      );
    } else if (isAlbumDetailPage) {
      return (
        <div className="md:hidden h-[70px] px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="뒤로가기"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-lg font-semibold text-gray-900">앨범</span>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="mobile"
          />
        </div>
      );
    } else if (isProfileEditPage) {
      return (
        <div className="md:hidden h-[70px] px-4 flex items-center justify-between">
          <Link href="/">
            <img src="/images/logo.png" alt="logo" className="h-10 w-auto object-contain" />
          </Link>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="mobile"
          />
        </div>
      );
    } else if (isWithdrawPage) {
      return (
        <div className="md:hidden h-[70px] px-4 flex items-center justify-between">
          <Link href="/">
            <img src="/images/logo.png" alt="logo" className="h-10 w-auto object-contain" />
          </Link>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            user={user}
            onMenuClick={handleMenuItemClick}
            onLogout={handleLogout}
            onLogin={handleLogin}
            variant="mobile"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <header
      className="w-full bg-white border-b border-gray-200"
      onClick={() => {
        if (profileMenuOpen) setProfileMenuOpen(false);
      }}
    >
      {renderPCHeader()}
      {renderMobileHeader()}
    </header>
  );
}
