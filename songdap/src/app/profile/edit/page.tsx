"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { getProfile, updateProfile } from "@/features/profile/api";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import ProfileEditForm from "@/features/profile/components/ProfileEditForm";

export default function ProfileEditPage() {
  const router = useRouter();
  const logout = useOauthStore((s) => s.logout);
  const [isLoading, setIsLoading] = useState(true);
  const [initialNickname, setInitialNickname] = useState<string>("");
  const [initialProfileImage, setInitialProfileImage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getProfile()
      .then((me) => {
        if (cancelled) return;
        setInitialNickname(me?.nickname ?? "");
        setInitialProfileImage(me?.profileImage ?? "");
      })
      .catch((e) => {
        // 401/재발급 실패는 axios 인터셉터에서 logout+redirect 처리됨
        console.warn("[Profile Edit] 사용자 정보 조회 실패:", e);
        // 혹시나 인터셉터를 타지 않는 케이스면 안전하게 로그아웃 처리
        if (!cancelled) {
          logout();
          router.replace("/");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, logout]);

  const formKey = useMemo(
    () => `${initialNickname}::${initialProfileImage}`,
    [initialNickname, initialProfileImage]
  );

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-20">
        <h1 className="mb-10 text-center text-[28px] font-semibold text-gray-900">
          개인정보 변경
        </h1>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
              <p className="text-sm text-gray-600">불러오는 중...</p>
            </div>
          </div>
        ) : (
          <ProfileEditForm
            key={formKey}
            initialNickname={initialNickname}
            initialProfileImage={initialProfileImage}
            onSubmit={async (payload) => {
              const updated = await updateProfile(payload);

              // UI 캐시(localStorage) 갱신 + zustand 메모리 갱신
              try {
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    nickname: updated.nickname,
                    profileImage: updated.profileImage,
                  })
                );
              } catch {
                // ignore
              }
              useOauthStore.setState((prev) => ({
                ...prev,
                user: prev.user
                  ? { ...prev.user, nickname: updated.nickname, profileImage: updated.profileImage }
                  : { nickname: updated.nickname, profileImage: updated.profileImage },
                isAuthenticated: true,
              }));

              router.replace("/");
            }}
          />
        )}
      </main>
    </>
  );
}

