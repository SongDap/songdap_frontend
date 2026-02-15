"use client";

import { useState } from "react";
import ProfileImageUploader from "./ProfileImageUploader";
import { useProfileForm } from "../hooks/useProfileForm";
import Link from "next/link";
import { trackEvent } from "@/lib/gtag";

type ProfileEditPayload = {
  nickname: string;
  email?: string;
  profileImageFile?: File;
};

type ProfileEditFormProps = {
  initialNickname?: string;
  initialProfileImage?: string;
  onSubmit: (payload: ProfileEditPayload) => Promise<void> | void;
};

export default function ProfileEditForm({
  initialNickname = "",
  initialProfileImage = "",
  onSubmit,
}: ProfileEditFormProps) {
  const {
    nickname,
    setNickname,
    profileImageDataUrl,
    profileImageFile,
    setProfileImage,
    setProfileImageToDefault,
    useDefaultProfileImage,
    isDirty,
  } = useProfileForm({
    initialNickname,
    initialProfileImage,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        nickname: nickname.trim(),
        // 기본 이미지로 설정이면 파일 없이 전송 (회원가입 시 미설정과 동일)
        profileImageFile: useDefaultProfileImage ? undefined : (profileImageFile || undefined),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
      <ProfileImageUploader
        imageUrl={useDefaultProfileImage ? "" : (profileImageDataUrl || initialProfileImage)}
        onChange={setProfileImage}
        onSetDefault={setProfileImageToDefault}
        isDefaultImage={useDefaultProfileImage}
        disabled={false}
      />

      <div className="w-full">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-800" style={{ fontFamily: "KOTRA_HOPE" }}>닉네임</label>
          <div className="relative">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={16}
              placeholder="변경할 프로듀서님의 이름을 알려주세요"
              className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {nickname.length} / 16
            </span>
          </div>
        </div>

        <br />
        <button
          type="submit"
          onClick={() => {
            trackEvent(
              { event: "select_content", content_type: "profile_edit_button", item_id: "profile_edit_submit" },
              { category: "profile", action: "edit_click", label: "profile_edit_form" }
            );
          }}
          disabled={!isDirty || isSubmitting}
          className={`h-12 w-full rounded-md text-base font-semibold shadow-sm active:scale-[0.99] ${isDirty && !isSubmitting
            ? "bg-[#006FFF] text-white"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
        >
          {isSubmitting ? "처리 중..." : "수정하기"}
        </button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="flex">
          <Link href="/profile/withdraw" className="ml-auto">
            <span className="text-red-600 hover:text-red-700 cursor-pointer">
              회원탈퇴하기
            </span>
          </Link>
        </div>
      </div>
    </form>
  );
}

