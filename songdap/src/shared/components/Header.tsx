"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useOauthStore((s) => s.user);
  const logout = useOauthStore((s) => s.logout);
  const isAuthenticated = useOauthStore((s) => s.isAuthenticated);

  const navItems: NavItem[] = [
    { label: "서비스 소개", href: "/introduceService" },
    { label: "내 앨범", href: "/album/list" },
  ];

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname?.startsWith(href);
  };

  // 메뉴 외부 클릭 시 닫기
  const handleClickOutside = () => {
    setProfileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200" onClick={handleClickOutside}>
      {/* top bar */}
      <div className="h-[95px] px-4 flex items-center justify-between md:px-20 max-w-[1440px] mx-auto relative">
        {/* Logo */}
        <Link href = "/">
          <img
            src="/images/logo.png"
            alt="logo"
            className="h-10 md:h-16 w-auto object-contain"
          />
        </Link>

        {/* 모바일에서만 가운데 타이틀 표시 */}
        {pathname === "/album/list" && (
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900 md:hidden">내 앨범</h1>
        )}
        {pathname === "/song/add" && (
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900 md:hidden">노래 추가</h1>
        )}

        {/* PC nav */}
        <nav className="hidden md:flex items-center gap-3 ml-auto">
          {navItems.map((item, idx) => {
            const active = isActive(item.href);
            return (
              <a
                key={idx}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-base transition
                  ${
                    active
                      ? "text-white font-medium"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                style={active ? { backgroundColor: "#006FFF" } : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* PC user */}
        <div className="hidden md:flex items-center gap-2 ml-4 relative">
          {isAuthenticated ? (
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
              <span
                className="text-base text-gray-900 max-w-[200px] truncate"
                title={user?.nickname || "사용자"}
              >
                {user?.nickname?.slice(0, 16) || "사용자"}
                {user?.nickname && user.nickname.length > 16 && "..."}
              </span>
            </button>
          ) : (
            <span className="text-sm text-gray-700 whitespace-nowrap">
              로그인이 필요합니다.
            </span>
          )}
          
          {/* PC Profile Dropdown */}
          {isAuthenticated && profileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <a
                  href="/profile/edit"
                  className="block px-4 py-2 text-base text-gray-800 hover:bg-gray-100 transition-colors hover:text-gray-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileMenuOpen(false);
                  }}
                >
                  프로필 편집
                </a>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
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

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setOpen(!open)}
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
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col px-4 py-3 gap-1">
            {/* Mobile profile */}
            <div className="flex flex-col gap-2 px-3 py-2 mb-2 border-b border-gray-200 pb-2">
              {isAuthenticated ? (
                <>
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
                    href="/profile/edit"
                    className="px-3 py-2 rounded-lg text-base text-gray-800 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    프로필 편집
                  </a>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg text-base !text-red-600 hover:bg-red-50 text-left"
                    onClick={() => {
                      setOpen(false);
                      logout();
                      router.replace("/");
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-700 px-1">
                  로그인이 필요합니다.
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item, idx) => {
                const active = isActive(item.href);
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-base
                      ${
                        active
                          ? "text-white font-medium"
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
                    style={active ? { backgroundColor: "#006FFF" } : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
