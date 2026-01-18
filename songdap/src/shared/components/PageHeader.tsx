"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { ROUTES } from "@/shared/lib/routes";
import { BottomConfirmModal } from "@/shared/ui";

type PageHeaderProps = {
  title: string;
  backButtonText?: string;
};

export default function PageHeader({ title, backButtonText = "내 앨범" }: PageHeaderProps) {
  const router = useRouter();
  const { user } = useOauthStore();
  const [showModal, setShowModal] = useState(false);

  const handleBackClick = () => {
    // 모바일에서는 모달 표시, PC에서는 window.confirm 사용
    if (window.innerWidth < 768) {
      setShowModal(true);
    } else {
      if (window.confirm("모든 작업을 취소하고 내 앨범으로 돌아가겠습니까?")) {
        router.push(ROUTES.ALBUM.LIST);
      }
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    router.push(ROUTES.ALBUM.LIST);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200">
        <div className="h-[95px] px-4 flex items-center justify-between md:px-20 max-w-[1440px] mx-auto">
          {/* 내 앨범 버튼 */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-base text-gray-800 hover:text-[#006FFF] active:text-[#006FFF] transition-colors"
          >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden md:block"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="underline md:no-underline">{backButtonText}</span>
        </button>

        {/* 가운데 타이틀 */}
        <h1 className="text-[30px] font-bold text-gray-900">{title}</h1>

        {/* 오른쪽 프로필 */}
        <div className="flex items-center gap-2">
          <img
            src={user?.profileImage || "https://placehold.co/36x36"}
            alt={user?.nickname || "프로필"}
            className="w-9 h-9 rounded-full"
          />
          <span className="text-base text-gray-900 max-w-[200px] truncate hidden md:inline" title={user?.nickname || "사용자"}>
            {user?.nickname?.slice(0, 16) || "사용자"}
            {user?.nickname && user.nickname.length > 16 && "..."}
          </span>
        </div>
      </div>
    </header>

    {/* 모바일 확인 모달 */}
    <BottomConfirmModal
      isOpen={showModal}
      message="모든 작업을 취소하고 내 앨범으로 돌아가겠습니까?"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  </>
  );
}
