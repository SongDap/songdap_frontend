"use client";
import { useRouter } from "next/navigation";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();
  const { user } = useOauthStore();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="h-[95px] px-4 flex items-center justify-between md:px-20 max-w-[1440px] mx-auto">
        {/* 이전 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-base text-gray-800 hover:text-gray-600 transition-colors"
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
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>이전</span>
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
  );
}
