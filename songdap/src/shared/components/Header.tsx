"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";

type NavItem = {
  label: string;
  href: string;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useOauthStore();

  const navItems: NavItem[] = [
    { label: "서비스 소개", href: "#" },
    ...(isAuthenticated ? [{ label: "내 앨범", href: "#" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname?.startsWith(href);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* top bar */}
      <div className="h-[95px] px-4 flex items-center justify-between md:px-20 max-w-[1440px] mx-auto">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-10 md:h-16 w-auto object-contain"
        />

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
        {user && (
          <div className="hidden md:flex items-center gap-2 ml-4">
            <img
              src={user.profileImage || "https://placehold.co/36x36"}
              alt={user.nickname}
              className="w-9 h-9 rounded-full"
            />
            <span className="text-base text-gray-900">{user.nickname}</span>
          </div>
        )}

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <img
              src={user.profileImage || "https://placehold.co/36x36"}
              alt={user.nickname}
              className="w-8 h-8 rounded-full"
            />
          )}
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
          <nav className="flex flex-col px-4 py-3 gap-1">
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
      )}
    </header>
  );
}
