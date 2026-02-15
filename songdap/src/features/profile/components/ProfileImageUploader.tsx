"use client";

import Image from "next/image";
import { useRef } from "react";

type ProfileImageUploaderProps = {
  imageUrl?: string;
  onChange: (file: File | null) => void;
  onSetDefault?: () => void;
  /** true면 회원가입 시처럼 기본 이미지 + 가운데 "프로필 업로드" 버튼만 표시 */
  isDefaultImage?: boolean;
  disabled?: boolean;
};

export default function ProfileImageUploader({
  imageUrl,
  onChange,
  onSetDefault,
  isDefaultImage = false,
  disabled = false,
}: ProfileImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileUploadClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      onChange(null);
      return;
    }

    const maxSizeMb = 10;
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`이미지 용량은 ${maxSizeMb}MB 이하만 가능합니다.`);
      e.target.value = "";
      onChange(null);
      return;
    }

    onChange(file);
  };

  const displaySrc = imageUrl || "/images/profile_img.png";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 이미지 영역 - 회원가입과 동일: 기본 이미지일 땐 가운데 "프로필 업로드" 버튼 오버레이 */}
      <div className="relative h-40 w-40">
        <Image
          src={displaySrc}
          alt="profile"
          fill
          className="rounded-full object-cover"
          unoptimized={Boolean(imageUrl)}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfileFileChange}
          disabled={disabled}
        />

        {/* 기본 이미지일 때: 회원가입처럼 가운데 "프로필 업로드" 버튼 */}
        {isDefaultImage && (
          <button
            type="button"
            onClick={handleProfileUploadClick}
            disabled={disabled}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-blue-500 text-white text-sm font-semibold rounded-full whitespace-nowrap shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            프로필 업로드
          </button>
        )}
      </div>

      {/* 커스텀 이미지일 때만 하단에 "프로필 변경" + "기본 이미지로 설정" */}
      {!isDefaultImage && (
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={handleProfileUploadClick}
            disabled={disabled}
            className={`rounded-full px-6 py-3 text-sm font-semibold shadow-md whitespace-nowrap transition-colors ${
              disabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {disabled ? "카카오 프로필로 설정됨" : "프로필 변경"}
          </button>
          {onSetDefault && (
            <button
              type="button"
              onClick={onSetDefault}
              disabled={disabled}
              className="rounded-full px-5 py-3 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              기본 이미지로 설정
            </button>
          )}
        </div>
      )}
    </div>
  );
}

