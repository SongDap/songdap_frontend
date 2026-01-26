"use client";

import Image from "next/image";
import { useRef } from "react";

type ProfileImageUploaderProps = {
    imageUrl?: string;
    onChange: (file: File | null) => void;
    disabled?: boolean;
};

export default function ProfileImageUploader({
    imageUrl,
    onChange,
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

    return (
        <div className="flex flex-col items-center gap-4">
            {/* 이미지 영역 */}
            <div className="relative h-40 w-40">
                <Image
                    src={imageUrl || "/images/profile_img.png"}
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
            </div>

            {/* 버튼 영역 (이미지 아래) */}
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
        </div>

    );
}

