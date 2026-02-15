"use client";

import Link from "next/link";
import { useSignupForm } from "../hooks/useSignupForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateMe } from "@/shared/api";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { useRef, useState } from "react";
import { trackEvent } from "@/lib/gtag";

export function SignupForm() {
    const {
        nickname,
        email,
        profileImageDataUrl,
        setProfileImage,
        agreeAll,
        agreeAge,
        agreeTerms,
        setNickname,
        setEmail,
        toggleAll,
        toggleAge,
        toggleTerms,
        isValid,
        isEmailOk,
    } = useSignupForm();
    const router = useRouter();
    const loginFunction = useOauthStore((s) => s.login);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const handleProfileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있습니다.");
            e.target.value = "";
            setProfileImage(null);
            setProfileImageFile(null);
            return;
        }

        const maxSizeMb = 10;
        if (file.size > maxSizeMb * 1024 * 1024) {
            alert(`이미지 용량은 ${maxSizeMb}MB 이하만 가능합니다.`);
            e.target.value = "";
            setProfileImage(null);
            setProfileImageFile(null);
            return;
        }

        setProfileImage(file);
        setProfileImageFile(file);
        trackEvent(
            { event: "upload_image", file_size_kb: Math.round(file.size / 1024) },
            { category: "profile", action: "upload_image", label: "signup_profile_image" }
        );
    };

    async function handleSubmit() {
        if (!isValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                nickname: nickname.trim(),
                email: email.trim() || undefined,
                profileImageFile: profileImageFile || undefined,
                agreeAge,
                agreeTerms,
            } as any;

            const me = await updateMe(payload);

            trackEvent(
                { event: "sign_up", method: "kakao" },
                { category: "authentication", action: "sign_up", label: "onboarding" }
            );

            // 쿠키 기반이라 accessToken은 비워도 됨
            loginFunction({ accessToken: "", user: me });
            router.replace("/album/list");
        } catch (e) {
            console.error("회원가입(온보딩) 실패:", e);
            alert("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mx-auto flex flex-col items-center">
            {/* 로고 영역 */}
            <div className="flex flex-col items-center gap-3 mb-8">
                <Link href="/">
                    <Image src="/images/logo.png" alt="logo" width={200} height={100} />
                </Link>
            </div>

            {/* 타이틀 */}
            <div className="text-center mb-10">
                <p className="text-[28px] font-semibold text-gray-900 leading-snug">
                    회원가입하고
                    <br />
                    추억을 기록해보세요!
                </p>
            </div>

            <div className="relative w-40 h-40">
                {/* 사람 기본 이미지 */}
                <Image
                    src={profileImageDataUrl || "/images/profile_img.png"} // 사람 아이콘
                    alt="profile"
                    fill
                    className="object-cover rounded-full"
                    unoptimized={Boolean(profileImageDataUrl)}
                />

                {/* 프로필 업로드 버튼 */}
                <button
                    type="button"
                    onClick={handleProfileUploadClick}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-blue-500 text-white text-sm font-semibold rounded-full whitespace-nowrap shadow-md hover:bg-blue-600"
                >
                    프로필 업로드
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileFileChange}
                />
            </div>

            <div className="w-full bg-white">
                {/* 닉네임 */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: "KOTRA_HOPE" }}>
                        닉네임(필수)
                    </label>
                    <div className="relative">
                        <input
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength={16}
                            placeholder="프로듀서님의 이름을 알려주세요"
                            className="w-full h-14 rounded-lg border border-gray-300 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006FFF]" style={{ fontFamily: "KOTRA_HOPE" }}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            {nickname.length} / 16
                        </span>
                    </div>
                    <br />
                    <label className="block text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: "KOTRA_HOPE" }}>
                        이메일(선택)
                    </label>
                    <div className="relative">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={254}
                            placeholder="이메일을 알려주시면 수록곡 정보를 보내드려요~"
                            type="email"
                            className="w-full h-14 rounded-lg border border-gray-300 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                        />
                        {!isEmailOk && (
                            <p className="mt-2 text-sm text-red-600">
                                올바른 이메일 형식을 입력해주세요.
                            </p>
                        )}
                    </div>
                </div>

                {/* 동의 박스 */}
                <div className="bg-[#F8F8F8] rounded-2xl border border-[#EDEDED] px-4 py-5 mb-8 mt-30">
                    <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                        <input
                            id="agreeAll"
                            type="checkbox"
                            checked={agreeAll}
                            onChange={toggleAll}
                            className="h-5 w-5 rounded border-gray-400 text-[#006FFF] focus:ring-[#006FFF]"
                        />
                        <label htmlFor="agreeAll" className="text-sm font-semibold text-gray-900">
                            (필수) 모두 동의합니다
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <div className="flex items-start gap-3">
                            <p className="text-sm text-gray-700">
                                회원 가입 및 회원 관리 등의 목적으로 이메일, 닉네임 등의 정보를 수집하고 있습니다.
                            </p>

                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="agreeAge"
                                type="checkbox"
                                checked={agreeAge}
                                onChange={toggleAge}
                                className="h-4 w-4 rounded border-gray-400 text-[#006FFF] focus:ring-[#006FFF]"
                            />
                            <label htmlFor="agreeAge" className="text-sm text-gray-700">
                                (필수) 만 14세 이상이에요
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="agreeTerms"
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={toggleTerms}
                                className="h-4 w-4 rounded border-gray-400 text-[#006FFF] focus:ring-[#006FFF]"
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                                (필수)&nbsp;
                                <a
                                    href="https://www.notion.so/2ef32226841780ba99efce8bf7d31596?source=copy_link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-blue-600"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    이용약관
                                </a>
                                &nbsp;및&nbsp;
                                <a
                                    href="https://www.notion.so/2ef322268417804387d7c3f192ed88a7?source=copy_link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-blue-600"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    개인정보수집·이용
                                </a>
                                &nbsp;동의
                            </label>

                        </div>
                    </div>
                </div>

                {/* 가입 버튼 */}
                <button
                    type="button"
                    onClick={() => {
                        trackEvent(
                            { event: "select_content", content_type: "signup_button", item_id: "signup_submit" },
                            { category: "authentication", action: "sign_up_click", label: "signup_form" }
                        );
                        handleSubmit();
                    }}
                    disabled={!isValid || isSubmitting}
                    className={`w-full h-12 rounded-md text-base font-semibold shadow-sm active:scale-[0.99] ${isValid && !isSubmitting ? "bg-[#006FFF] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? "처리 중..." : "회원가입하기"}
                </button>
            </div>
        </div>
    );
}

